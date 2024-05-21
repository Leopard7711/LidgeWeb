<template>
  <div class="container is-max-desktop">
    <div class="panel" style="height: 665px;">
      <p class="panel-heading">
        <span class="has-text-weight-semibold">유저 설정</span>
      </p>
      <div class="panel m-5">
       
        <div class="user-info p-5 is-flex is-justify-content-center" v-if="user">
          <div class="is-flex-grow-1 is-flex is-justify-content-center is-align-items-center">
            <figure class="image is-128x128">
              <img class="is-rounded" :src="user.photoURL || 'https://via.placeholder.com/128x128.png?text=Image'" alt="User photo" style="width: 128px; height: 128px; object-fit: cover;">
            </figure>
          </div>
          <div class="is-flex-grow-4 is-flex is-justify-content-center is-align-items-start is-flex-direction-column">
            <p class="is-size-5 has-text-weight-semibold">{{ user.name }}</p>
            <p class="is-size-6">{{ user.email }}</p>
          </div>
          <div class="is-flex-grow-.5 is-flex is-align-items-center">
            <button class="button is-danger has-text-weight-semibold" @click="deleteAccount">탈퇴하기</button>
          </div>
        </div>
      </div>
      <div class="columns ml-3 mr-3 info-setting">
        <div class="column">
          <div class="box" style="height: 350px;">
            <form @submit.prevent="changePassword">
              <div class="field">
                <label class="label">현재 비밀번호</label>
                <div class="control">
                  <input class="input" type="password" v-model="currentPassword" required>
                </div>
              </div>
              <div class="field">
                <label class="label">새 비밀번호</label>
                <div class="control">
                  <input class="input" type="password" v-model="newPassword" required>
                </div>
              </div>
              <div class="field">
                <label class="label">새 비밀번호 다시 입력</label>
                <div class="control">
                  <input class="input" type="password" v-model="confirmPassword" required>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button class="button is-warning has-text-weight-semibold" type="submit">비밀번호 변경</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="column">
          <div class="box is-flex is-align-items-center is-justify-content-center" style="height: 350px;">
            <form @submit.prevent="uploadPhoto">
              <div class="field is-flex is-flex-direction-column is-align-items-center">
                <label class="label">프로필 사진 추가하기</label>
                <div class="file has-name is-boxed">
                  <label class="file-label">
                    <input class="file-input" type="file" @change="onFileChange">
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Choose a file…
                      </span>
                    </span>
                    <span class="file-name" v-if="selectedFile">
                      {{ selectedFile.name }}
                    </span>
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button class="button is-warning has-text-weight-semibold" type="submit">업로드 하기</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db, storage } from '@/firebase';
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, arrayRemove } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref as storageRef, deleteObject } from 'firebase/storage';

export default {
  name: 'UserSettingView',
  setup() {
    const isCheckingAuth = ref(true);
    const router = useRouter();
    const user = ref(null);
    const selectedFile = ref(null);
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        user.value = {
          name: userData.name,
          email: userData.email,
          photoURL: userData.photoURL || null,
        };
      } else {
        console.log('User data does not exist');
      }
    };

    const checkUserAndRedirect = (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        if (isCheckingAuth.value) {
          alert('로그인 해주세요');
          router.push('/');
        }
      }
      isCheckingAuth.value = false;
    };

    const changePassword = async () => {
      if (newPassword.value.length < 6 || newPassword.value.length > 20) {
        alert('새 비밀번호는 6자 이상 20자 이하여야 합니다.');
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        alert('새 비밀번호와 확인이 일치하지 않습니다.');
        return;
      }
      try {
        const userCredential = auth.currentUser;
        if (userCredential) {
          const credential = EmailAuthProvider.credential(userCredential.email, currentPassword.value);
          await reauthenticateWithCredential(userCredential, credential);  // 현재 비밀번호 확인
          await updatePassword(userCredential, newPassword.value);  // 비밀번호 변경
          alert('비밀번호가 성공적으로 변경되었습니다.');
        }
      } catch (error) {
        console.error('비밀번호 변경 중 오류 발생:', error);
        alert('비밀번호를 정확히 입력해주세요');
      }
    };

    const deleteAccount = async () => {
      try {
        const userCredential = auth.currentUser;
        if (userCredential) {
          const currentPassword = prompt('현재 비밀번호를 입력하세요:');
          if (currentPassword === null) {
            return;
          }
          const credential = EmailAuthProvider.credential(userCredential.email, currentPassword);
          await reauthenticateWithCredential(userCredential, credential);

          // Firestore에서 사용자 데이터 삭제
          await deleteDoc(doc(db, 'users', userCredential.uid));

          // Firestore에서 사용자가 생성한 방 삭제
          const roomsQuery = query(collection(db, 'rooms'), where('ownerId', '==', userCredential.uid));
          const roomsSnapshot = await getDocs(roomsQuery);
          for (const roomDoc of roomsSnapshot.docs) {
            await deleteDoc(roomDoc.ref);
          }

          // Firestore에서 사용자 친구 관계 삭제
          const friendsQuery1 = query(collection(db, 'friends'), where('userId1', '==', userCredential.uid));
          const friendsQuery2 = query(collection(db, 'friends'), where('userId2', '==', userCredential.uid));
          const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([getDocs(friendsQuery1), getDocs(friendsQuery2)]);
          for (const friendDoc of friendsSnapshot1.docs.concat(friendsSnapshot2.docs)) {
            await deleteDoc(friendDoc.ref);
          }

          // Firestore에서 사용자 친구 요청 삭제
          const friendRequestsQuery = query(collection(db, 'friendRequests'), where('senderId', '==', userCredential.uid));
          const friendRequestsSnapshot = await getDocs(friendRequestsQuery);
          for (const requestDoc of friendRequestsSnapshot.docs) {
            await deleteDoc(requestDoc.ref);
          }

          const friendRequestsQueryReceived = query(collection(db, 'friendRequests'), where('receiverId', '==', userCredential.uid));
          const friendRequestsSnapshotReceived = await getDocs(friendRequestsQueryReceived);
          for (const requestDoc of friendRequestsSnapshotReceived.docs) {
            await deleteDoc(requestDoc.ref);
          }

          // Firestore에서 사용자가 참가한 방에서 사용자 제거
          const participantRoomsQuery = query(collection(db, 'rooms'), where('participants', 'array-contains', userCredential.uid));
          const participantRoomsSnapshot = await getDocs(participantRoomsQuery);
          for (const roomDoc of participantRoomsSnapshot.docs) {
            await updateDoc(roomDoc.ref, {
              participants: arrayRemove(userCredential.uid)
            });
          }

          // Firebase Storage에서 사용자 프로필 사진 삭제
          const fileRef = storageRef(storage, `users/${userCredential.uid}/profile.jpg`);
          await deleteObject(fileRef).catch(error => {
            if (error.code !== 'storage/object-not-found') {
              throw error;
            }
          });

          // Firebase Authentication에서 사용자 삭제
          await deleteUser(userCredential);
          alert('계정이 성공적으로 삭제되었습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('계정 삭제 중 오류 발생:', error);
        alert('계정 삭제 중 오류가 발생했습니다: ' + error.message);
      }
    };

    const onFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const uploadPhoto = async () => {
      if (!selectedFile.value) {
        alert('파일을 먼저 선택해 주세요');
        return;
      }
      try {
        const userCredential = auth.currentUser;
        if (userCredential) {
          const fileRef = storageRef(storage, `users/${userCredential.uid}/profile.jpg`);
          await uploadBytes(fileRef, selectedFile.value);
          const photoURL = await getDownloadURL(fileRef);
          await updateDoc(doc(db, 'users', userCredential.uid), {
            photoURL: photoURL
          });
          user.value.photoURL = photoURL;
          alert('사진이 성공적으로 업로드되었습니다.');
        }
      } catch (error) {
        console.error('사진 업로드 중 오류 발생:', error);
        alert('사진 업로드 중 오류가 발생했습니다: ' + error.message);
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        checkUserAndRedirect(user);
      });
    });

    return {
      user,
      currentPassword,
      newPassword,
      confirmPassword,
      selectedFile,
      changePassword,
      deleteAccount,
      onFileChange,
      uploadPhoto
    };
  }
};
</script>
