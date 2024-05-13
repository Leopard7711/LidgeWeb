<template>
  <div class="container is-max-desktop">
    <div class="panel">
      <p class="panel-heading">
        <span class="has-text-weight-semibold">방 만들기</span>
      </p>
      <div class="panel-block">
        <div class="control">
          <input class="input" type="text" placeholder="방 이름" v-model="roomName">
          <input class="input mt-2" type="password" placeholder="방 비밀번호 (선택)" v-model="roomPassword">
          <button class="button is-primary mt-2" @click="createRoom">
            <span class="has-text-weight-semibold">방 생성</span>
          </button>
          <button class="button is-light mt-2 ml-3" @click="removeRoom">
            <span class="has-text-weight-semibold">만들어 놓은 방 지우기</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 친구 초대 섹션 -->
    <div class="columns">
      <!-- 입장한 친구 목록 -->
      <div class="column">
        <div class="panel pb-4">
          <p class="panel-heading"><span class="has-text-weight-semibold">추가된 친구</span></p>
          <div class="list friend-list">
            <div class="list-item ml-2 mr-2 is-flex is-align-items-center is-justify-content-space-between" v-for="friend in joinedFriends" :key="friend.id">
              <div class="is-flex is-align-items-center">
                <figure class="image is-64x64">
                  <img class="is-rounded" :src="'https://via.placeholder.com/128x128.png?text=Image'">
                </figure>
              </div>
              <div class="list-item-content">
                <div class="list-item-title is-size-5 has-text-weight-semibold">{{ friend.name }}</div>
                <div class="list-item-description">{{ friend.email }}</div>
              </div>
              <button class="delete" @click="removeFriendFromRoom(friend.id)"></button>
            </div>
          </div>
        </div>
      </div>
      <!-- 친구 초대 목록 -->
      <div class="column">
        <div class="panel pb-4">
          <p class="panel-heading"><span class="has-text-weight-semibold">친구 목록</span></p>
          <div class="list friend-list">
            <div class="list-item ml-2 mr-2" v-for="friend in availableFriends" :key="friend.id">
              <div class="list-item-image">
                <figure class="image is-64x64">
                  <img class="is-rounded" :src="'https://via.placeholder.com/128x128.png?text=Image'">
                </figure>
              </div>
              <div class="list-item-content">
                <div class="list-item-title is-size-5 has-text-weight-semibold">{{friend.name}}</div>
                <div class="list-item-description">{{ friend.email }}</div>
              </div>
              <button class="button is-danger ml-2" @click="inviteFriendToRoom(friend.id)">추가</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';

export default {
  name: 'RoomSettingView',
  setup() {
    const router = useRouter();
    const currentUserUid = ref(null);
    const roomName = ref('');
    const roomPassword = ref('');
    const friends = ref([]);
    const joinedFriends = ref([]);
    const selectedFriends = ref([]);

    const isCheckingAuth = ref(true);

    const checkUserAndRedirect = (user) => {
     if (user) {
       currentUserUid.value = user.uid;
       fetchFriends();
     } else {
       if (isCheckingAuth.value) {
         alert('로그인 해주세요');
         router.push('/');
       }
     }
     isCheckingAuth.value = false;
   };

    const availableFriends = computed(() => {
      return friends.value.filter(friend => !joinedFriends.value.some(joinedFriend => joinedFriend.id === friend.id));
    });

    const fetchFriends = async () => {
      const friendsQuery1 = query(collection(db, 'friends'), where('userId1', '==', currentUserUid.value));
      const friendsQuery2 = query(collection(db, 'friends'), where('userId2', '==', currentUserUid.value));

      const [firstQuerySnapshot, secondQuerySnapshot] = await Promise.all([
        getDocs(friendsQuery1),
        getDocs(friendsQuery2)
      ]);

      const friendIds = new Set(); 
      firstQuerySnapshot.docs.concat(secondQuerySnapshot.docs).forEach(doc => {
        const data = doc.data();
        friendIds.add(data.userId1 === currentUserUid.value ? data.userId2 : data.userId1);
      });

      const friendDetails = await Promise.all(Array.from(friendIds).map(async friendId => {
        const userDocRef = doc(db, 'users', friendId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          return {
            id: friendId,
            name: userDocSnapshot.data().name,
            email: userDocSnapshot.data().email
          };
        }
        return null;
      }));

      friends.value = friendDetails.filter(friend => friend !== null);
    };

    const createRoom = async () => {
      if (selectedFriends.value.length > 7) {
        alert('참여자 수는 최대 8명을 초과할 수 없습니다. (자신을 포함)');
        return;
      }

      const existingRoomQuery = query(collection(db, 'rooms'), where('ownerId', '==', currentUserUid.value));
      const querySnapshot = await getDocs(existingRoomQuery);

      if (!querySnapshot.empty) {
        alert('이미 방을 생성하셨습니다.');
        return;
      }

      if (!roomName.value) {
        alert('방 이름을 입력해주세요.');
        return;
      }
      console.log('selectedFriends.value:', selectedFriends.value);
      await addDoc(collection(db, 'rooms'), {
        name: roomName.value,
        password: roomPassword.value || "",
        ownerId: currentUserUid.value,
        participants: [currentUserUid.value, ...selectedFriends.value.map(friend => friend.id)],
        timestamp: serverTimestamp()
      });

      // 방 생성 후 입력 필드 초기화
      roomName.value = '';
      roomPassword.value = '';
      selectedFriends.value = [];
      alert('방이 성공적으로 생성되었습니다.');
    };

    const removeRoom = async () => {
      const roomQuery = query(collection(db, 'rooms'), where('ownerId', '==', currentUserUid.value));
      const querySnapshot = await getDocs(roomQuery);

      if (querySnapshot.empty) {
        alert('삭제할 방이 없습니다.');
        return;
      }

      const roomDocRef = doc(db, 'rooms', querySnapshot.docs[0].id);
      await deleteDoc(roomDocRef);
      alert('방이 성공적으로 삭제되었습니다.');
    };

    const inviteFriendToRoom = friendId => {
      const friend = friends.value.find(f => f.id === friendId);
      if (!friend) return;
      if (joinedFriends.value.length >= 7) {
        alert('이 방은 이미 최대 인원에 도달했습니다.');
        return;
      }
      joinedFriends.value.push(friend);
      selectedFriends.value.push(friend);
      console.log(`${friend.name}을(를) 방에 초대했습니다.`);
    };

    const removeFriendFromRoom = friendId => {
      joinedFriends.value = joinedFriends.value.filter(f => f.id !== friendId);
      selectedFriends.value = selectedFriends.value.filter(id => id !== friendId);
      console.log(`친구를 방에서 제거했습니다.`);
    };

    onMounted(() => {
     const user = auth.currentUser;
     checkUserAndRedirect(user);

     const unsubscribe = onAuthStateChanged(auth, user => {
       checkUserAndRedirect(user);
     });

     // Clean up the subscription on unmount
     return () => unsubscribe();
   });

    return {
      roomName,
      roomPassword,
      joinedFriends,
      availableFriends,
      inviteFriendToRoom,
      removeFriendFromRoom,
      fetchFriends,
      createRoom,
      removeRoom,
      selectedFriends,
      friends
    };
  }
};
</script>

<style scoped> 
.friend-list{
  overflow-y:scroll; 
  height:400px; 
}
</style>