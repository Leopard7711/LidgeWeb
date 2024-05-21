<template>
    <div class="container is-max-desktop">
      <div class="panel">
        <div class="panel-heading is-flex is-align-items-center is-justify-content-center">
          <div class="is-flex-grow-1" style="width: 10%;"></div>
          <div class="is-flex-grow-4 has-text-centered">
            <p class="has-text-weight-bold">&lt; {{ roomName }} &gt;</p>
          </div>
          <div class="is-flex-grow-1 has-text-right" style="width: 10%;">
            <button class="button is-light has-text-weight-bold mr-3" @click="goToMain">메인</button>
            <button v-if="!isOwner" class="button is-danger has-text-weight-bold" @click="confirmLeaveRoom">방 퇴장</button>
          </div>
        </div>
        <div v-if="participants.length === 0" class="has-text-grey is-flex is-justify-content-center is-align-items-center" style="height: 100%;">
          <p class="is-size-5">참여자가 없습니다</p>
        </div>
        <div class="columns is-multiline m-2 pb-4">
          <div v-for="index in 8" :key="index" class="column is-half ">
            <div class="panel-block is-flex is-align-items-center " style="padding: 0;">
              <div v-if="participants[index - 1]" class="panel is-flex is-align-items-center" style="width: 100%; height: 100px;">
                <figure class="image is-64x64 ml-5" style="margin-right: 15px; margin-left: 15px; position: relative;">
                    <img class="is-rounded participant-image" :src="participants[index - 1].photoURL || 'https://via.placeholder.com/96x96.png?text=User'" alt="Participant Image">
                    <i v-if="participants[index - 1].id === ownerId" class="fa-solid fa-crown" style="position: absolute; top: -10px; left: -10px; color: gold;"></i>
                </figure>
                <div class="is-flex-grow-1 is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
                  <p class="is-size-5 has-text-weight-semibold">{{ participants[index - 1].name }}</p>
                  <p class="is-size-6">{{ participants[index - 1].email }}</p>
                </div>
              </div>
              <div v-else class="panel is-flex is-align-items-center is-justify-content-center" style="width: 100%; height: 100px;">
                <p class="has-text-grey">유저가 입장하지 않음</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns mt-4">
        <div class="column is-half pt-0">
          <div class="gallery-section panel p-4" style="height: 260px;">
            <p class="is-size-4 has-text-weight-semibold has-text-centered mb-3">갤러리</p>
            <div class="columns is-multiline">
              <div v-for="image in galleryImages" :key="image.id" class="column is-one-quarter" style="position: relative;">
                <figure class="image is-4by3 " style="margin-bottom: 15px;">
                  <img :src="image.url" alt="Gallery Image">
                  <i class="fa-solid fa-circle-xmark" @click="confirmDelete(image.id, image.name)" style="position: absolute; top: 0px; right: 0px;"></i>
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-half pt-0">
          <div class="upload-section panel p-5" style="height: 260px;">
            <form @submit.prevent="uploadPhoto">
              <div class="field is-flex is-flex-direction-column is-align-items-center">
                <label class="label">갤러리 사진 추가하기</label>
                <div class="file has-name is-boxed">
                  <label class="file-label">
                    <input class="file-input" type="file" @change="onFileChange">
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        파일 선택…
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
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { db, auth, storage } from '@/firebase';
  import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
  import { uploadBytes, getDownloadURL, ref as storageRef, deleteObject } from 'firebase/storage';
  
  export default {
    name: 'RoomView',
    props: {
      roomId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const roomName = ref('');
      const participants = ref([]);
      const galleryImages = ref([]);
      const selectedFile = ref(null);
      const isOwner = ref(false);
      const ownerId = ref(null);
      const router = useRouter();
  
      const fetchRoomDetails = async () => {
        const roomDocRef = doc(db, 'rooms', props.roomId);
        const roomDoc = await getDoc(roomDocRef);
  
        if (roomDoc.exists()) {
          const roomData = roomDoc.data();
          roomName.value = roomData.name;
          ownerId.value = roomData.ownerId;
  
          const participantDetails = await Promise.all(
            roomData.participants.map(async (participantId) => {
              const userDocRef = doc(db, 'users', participantId);
              const userDoc = await getDoc(userDocRef);
  
              if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() };
              }
              return null;
            })
          );
  
          participants.value = participantDetails.filter((participant) => participant !== null);
          galleryImages.value = roomData.gallery || [];
          isOwner.value = roomData.ownerId === auth.currentUser.uid;
        } else {
          alert('방을 찾을 수 없습니다.');
          router.push('/');
        }
      };
  
      const goToMain = () => {
      router.push('/');
        };
      const leaveRoom = async () => {
        const user = auth.currentUser;
        const roomDocRef = doc(db, 'rooms', props.roomId);
  
        // 방의 참가자 목록에서 현재 사용자 제거
        await updateDoc(roomDocRef, {
          participants: arrayRemove(user.uid)
        });
  
        // 참가자가 없는 방이라면 방 자체를 삭제하거나 다른 처리를 할 수 있음
        const roomDoc = await getDoc(roomDocRef);
        if (roomDoc.exists() && roomDoc.data().participants.length === 0) {
          await deleteDoc(roomDocRef);
        }
  
        // 홈으로 리디렉션
        router.push('/');
      };
  
      const onFileChange = (event) => {
        selectedFile.value = event.target.files[0];
      };
  
      const sanitizeFileName = (fileName) => {
        return fileName.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
      };
  
      const uploadPhoto = async () => {
        if (!selectedFile.value) return;
  
        const sanitizedFileName = sanitizeFileName(selectedFile.value.name);
        const fileRef = storageRef(storage, `rooms/${props.roomId}/${sanitizedFileName}`);
        await uploadBytes(fileRef, selectedFile.value);
        const fileURL = await getDownloadURL(fileRef);
  
        const roomDocRef = doc(db, 'rooms', props.roomId);
        const newImage = {
          id: Date.now().toString(),
          url: fileURL,
          name: sanitizedFileName
        };
  
        await updateDoc(roomDocRef, {
          gallery: arrayUnion(newImage)
        });
  
        galleryImages.value.push(newImage);
  
        selectedFile.value = null;
        alert('사진이 업로드 되었습니다.');
      };
  
      const confirmLeaveRoom = () => {
      if (confirm('정말 방을 퇴장하시겠습니까?')) {
        leaveRoom();
      }
    };
      const confirmDelete = (imageId, imageName) => {
        if (confirm('이 사진을 삭제하시겠습니까?')) {
          deletePhoto(imageId, imageName);
        }
      };
  
      const deletePhoto = async (imageId, imageName) => {
        const image = galleryImages.value.find(img => img.id === imageId);
        if (!image) return;
  
        const fileRef = storageRef(storage, `rooms/${props.roomId}/${imageName}`);
        await deleteObject(fileRef);
  
        const roomDocRef = doc(db, 'rooms', props.roomId);
        await updateDoc(roomDocRef, {
          gallery: arrayRemove(image)
        });
  
        galleryImages.value = galleryImages.value.filter(img => img.id !== imageId);
        alert('사진이 삭제되었습니다.');
      };
  
      onMounted(() => {
        fetchRoomDetails();
      });
  
      return {
        roomName,
        participants,
        galleryImages,
        selectedFile,
        onFileChange,
        uploadPhoto,
        confirmDelete,
        deletePhoto,
        leaveRoom,
        isOwner,
        ownerId,
        goToMain,
        confirmLeaveRoom,
      };
    }
  };
  </script>
  
  <style scoped>
  .panel-heading {
    align-items: center;
  }
  .delete {
    background: white;
    border-radius: 50%;
  }
  .participant-image {
    object-fit: cover;
    width: 64px;
    height: 64px;
    border-radius: 50%;
}
  </style>
  