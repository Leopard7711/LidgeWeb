<template>
  <div class="room-list">
    <div v-for="room in rooms" :key="room.id" class="box box-light mx-4 my-4 pl-5 is-flex is-justify-content-space-between">
      <div class="texts">
        <h2 class="is-size-4 has-text-weight-semibold has-text-left">{{ room.name }}</h2>
        <p class="has-text-left">{{ room.participants.length }}명 입장 중</p>
      </div>
      <div class="buttons">
        <button class="button is-light" @click="enterRoom(room.id)"><p class="has-text-weight-semibold">입장</p></button>
        <button class="button is-primary" @click="joinRoom(room.id)"><p class="has-text-weight-semibold">참가</p></button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import { collection, getDocs, updateDoc, arrayUnion, getDoc, doc } from 'firebase/firestore';

export default {
  name: 'RoomList',
  setup() {
    const rooms = ref([]);
    const currentUser = ref(null);
    const router = useRouter();

    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      rooms.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        participants: doc.data().participants || []
      }));
    };

    const enterRoom = (roomId) => {
      if (!currentUser.value) {
        alert('로그인이 필요합니다.');
        return;
      }
      const room = rooms.value.find(room => room.id === roomId);
      if (room && room.participants.includes(currentUser.value.uid)) {
        router.push({ name: 'RoomView', params: { roomId } });
      } else {
        alert('방에 참가하지 않았습니다.');
      }
    };

    const joinRoom = async (roomId) => {
      if (!currentUser.value) {
        alert('로그인이 필요합니다.');
        return;
      }
      const roomDocRef = doc(db, 'rooms', roomId);
      const roomDoc = await getDoc(roomDocRef);

      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        if (roomData.participants.includes(currentUser.value.uid)) {
          alert('이미 이 방에 참가하셨습니다.');
          return;
        }
        if (roomData.password) {
          const password = prompt('비밀번호를 입력하세요:');
          if (password !== roomData.password) {
            alert('비밀번호가 틀렸습니다.');
            return;
          }
        }
        if (roomData.participants.length >= 8) {
          alert('방의 참가 인원이 가득 찼습니다.');
          return;
        }
        
        await updateDoc(roomDocRef, {
          participants: arrayUnion(currentUser.value.uid)
        });
        alert('참가되었습니다.');
        fetchRooms();
      } else {
        alert('방을 찾을 수 없습니다.');
      }
    };

    onMounted(() => {
      const unsubscribeAuth = auth.onAuthStateChanged(user => {
        if (user) {
          currentUser.value = user;
        } else {
          currentUser.value = null;
        }
        fetchRooms();
      });
      
      return () => unsubscribeAuth(); // Clean up the subscription on component unmount
    });

    return {
      rooms,
      enterRoom,
      joinRoom
    };
  }
};
</script>

<style scoped>
.room-list {
  overflow-y: auto;
  height: 420px;
}
</style>
