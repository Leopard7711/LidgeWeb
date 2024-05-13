<template>
  <div class="room-list">
    <div v-for="room in rooms" :key="room.id" class="box box-light mx-4 my-4 pl-5 is-flex is-justify-content-space-between">
      <div class="texts">
        <h2 class="is-size-4 has-text-weight-semibold has-text-left">{{ room.name }}</h2>
        <p class="has-text-left">{{ room.participants.length }}명 입장 중</p>
      </div>
      <div class="buttons">
        <button class="button is-light" @click="showRoomInfo(room.id)"><p class="has-text-weight-semibold">정보</p></button>
        <button class="button is-primary" @click="joinRoom(room.id)"><p class="has-text-weight-semibold">참가</p></button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'RoomList',
  setup() {
    const rooms = ref([]);

    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      rooms.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        participants: doc.data().participants || []
      }));
    };

    const showRoomInfo = (roomId) => {
      // 방 정보를 보여주는 로직 (다이얼로그나 모달을 사용할 수 있습니다)
      console.log('Showing info for room:', roomId);
    };

    const joinRoom = (roomId) => {
      // 방에 참가하는 로직 (참가 처리를 여기에서 구현)
      console.log('Joining room:', roomId);
    };

    onMounted(fetchRooms);

    return {
      rooms,
      showRoomInfo,
      joinRoom
    };
  }
}
</script>
  
  <style scoped>
  .room-list{
    overflow-y: auto; 
    
    height:420px; 
  }
  
  </style>