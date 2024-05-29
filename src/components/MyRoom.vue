<template>
  <div class="is-flex is-flex-direction-column is-align-items-center" style="height: 300px;">
    <div v-if="!isAuthChecked" class="has-text-grey is-flex is-justify-content-center is-align-items-end" style="height: 100%; ">
      <p class="is-size-5">로딩 중...</p>
    </div>
    <div v-else-if="!currentUser" class="has-text-grey is-flex is-justify-content-center is-align-items-center" style="height: 100%;">
      <p class="is-size-5">로그인 해주세요</p>
    </div>
    <div v-else-if="rooms.length === 0" class="has-text-grey is-flex is-justify-content-center is-align-items-center" style="height: 100%;">
      <p class="is-size-5">생성한 방이 없습니다</p>
    </div>
    <div v-else class="box is-flex is-flex-direction-column is-justify-content-center" style="height: 100px; width: 100%;">
      <div class="is-flex is-align-items-center is-justify-content-center" style="position: relative; height: 100%;">
        <div class="is-flex-grow-1 has-text-centered">
          <p><strong class="is-size-4">{{ rooms[0].name }}</strong></p>
          <p>참여자: {{ rooms[0].participants.length }}명</p>
        </div>
        <div class="buttons is-flex is-align-items-end" style="position: absolute; right:0rem; top: 50%; transform: translateY(-50%);">
          <button class="button is-light has-text-weight-semibold" @click="enterRoom(rooms[0].id)">입장</button>
          <button class="button is-danger has-text-weight-semibold" @click="deleteRoom(rooms[0].id)">삭제</button>
        </div>
      </div>
    </div>
    <div v-if="rooms.length > 0 && rooms[0].participantDetails" class="table-container">
      <table class="table is-fullwidth is-bordered">
        <thead>
          <tr>
            <th class="has-text-centered">이름</th>
            <th class="has-text-centered">이메일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="participant in rooms[0].participantDetails" :key="participant.id">
            <td>{{ participant.name }}</td>
            <td>{{ participant.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'MyRoom',
  setup() {
    const rooms = ref([]);
    const currentUser = ref(null);
    const isAuthChecked = ref(false);
    const router = useRouter();

    const fetchParticipantDetails = async (participantIds) => {
      const details = await Promise.all(participantIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
      }));
      return details.filter(detail => detail !== null);
    };

    const fetchRooms = async () => {
      if (currentUser.value) {
        const q = query(collection(db, 'rooms'), where('ownerId', '==', currentUser.value.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const roomData = doc.data();
          const participantDetails = await fetchParticipantDetails(roomData.participants);
          rooms.value = [{ id: doc.id, ...roomData, participantDetails }];
        }
      }
    };

    const deleteRoom = async (roomId) => {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        rooms.value = [];
        alert('방이 삭제되었습니다.');
        location.reload(); // 페이지 새로고침 추가
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('방 삭제에 실패하였습니다.');
      }
    };

    const enterRoom = (roomId) => {
      router.push({ name: 'RoomView', params: { roomId } });
    };

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isAuthChecked.value = true;
        currentUser.value = user;
        if (user) {
          fetchRooms();
        }
      });
    });

    return {
      rooms,
      deleteRoom,
      enterRoom,
      currentUser,
      isAuthChecked
    };
  }
};
</script>

<style scoped>
.table-container {
  overflow-y: auto;
  max-height: 200px;
  width: 100%;
  background-color: #fff;
}
.table {
  background-color: #f5f5f5; /* 회색 배경 */
  color: #333; /* 텍스트 색상 */
  border: 1px solid #ccc; /* 테두리 색상 */
}
.table th {
  background-color: #e0e0e0; /* 헤더 배경 색상 */
  color: #333; /* 헤더 텍스트 색상 */
  border: 1px solid #ccc; /* 헤더 테두리 색상 */
}
.table td {
  background-color: #fafafa; /* 셀 배경 색상 */
  color: #333; /* 셀 텍스트 색상 */
  border: 1px solid #ccc; /* 셀 테두리 색상 */
}
</style>
