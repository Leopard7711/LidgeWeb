<template>
  <div class="container is-max-desktop mt-5">
    <div class="panel pb-4">
      <p class="panel-heading"><span class="has-text-weight-semibold">친구 검색</span></p>
      <div class="panel-block">
        <p class="control has-icons-left">
          <input class="input" type="text" placeholder="친구 검색" v-model="searchText">
          <span class="icon is-left">
            <i class="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
      <div v-if="filteredUsers.length === 0" class="user-list has-text-grey is-flex is-justify-content-center is-align-items-center">
        <p class="is-size-5">찾을 유저를 입력해주세요</p>
      </div>
      <div v-else class="list user-list">
        <div class="list-item ml-4 mr-4" v-for="user in filteredUsers" :key="user.id">
          <div class="list-item-image">
            <figure class="image is-64x64">
              <img class="is-rounded user-image" :src="user.photoURL || 'https://via.placeholder.com/128x128.png?text=Image'">
            </figure>
          </div>
          <div class="list-item-content">
            <div class="list-item-title is-size-5 has-text-weight-semibold">{{ user.name }}</div>
            <div class="list-item-description">{{ user.email }}</div>
          </div>
          <button class="button is-primary ml-2" @click="sendFriendRequest(user.id)">
            <p class="has-text-weight-semibold">친구 요청</p>
          </button>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="panel pb-4">
          <p class="panel-heading"><span class="has-text-weight-semibold">친구 리스트</span></p>
          <div v-if="friends.length === 0" class="has-text-grey friend-request-list is-flex is-justify-content-center is-align-items-center">
            <p class="is-size-5">친구가 없습니다</p>
          </div>
          <div v-else class="list friend-list">
            <div class="list-item ml-2 mr-2" v-for="friend in friends" :key="friend.id">
              <div class="is-flex is-align-items-center">
                <figure class="image is-64x64">
                  <img class="is-rounded friend-image" :src="friend.photoURL || 'https://via.placeholder.com/128x128.png?text=Image'">
                </figure>
              </div>
              <div class="list-item-content">
                <div class="list-item-title is-size-5 has-text-weight-semibold">{{ friend.name }}</div>
                <div class="list-item-description">{{ friend.email }}</div>
              </div>
              <button class="delete" @click="deleteFriend(friend.id)"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="panel pb-4">
          <p class="panel-heading"><span class="has-text-weight-semibold">친구 요청</span></p>
          <div v-if="incomingRequests.length === 0" class="has-text-grey friend-request-list is-flex is-justify-content-center is-align-items-center">
            <p class="is-size-5">친구 요청이 없습니다</p>
          </div>
          <div v-else class="list friend-request-list">
            <div class="list-item ml-2 mr-2" v-for="request in incomingRequests" :key="request.id">
              <div class="list-item-image">
                <figure class="image is-64x64">
                  <img class="is-rounded request-image" :src="request.senderPhotoURL || 'https://via.placeholder.com/128x128.png?text=Image'">
                </figure>
              </div>
              <div class="list-item-content">
                <div class="list-item-title is-size-5 has-text-weight-semibold">{{ request.senderName }}</div>
                <div class="list-item-description">{{ request.senderEmail }}</div>
              </div>
              <button class="button is-danger ml-2" @click="acceptRequest(request.id)">수락</button>
              <button class="button is-light ml-2" @click="declineRequest(request.id)">거절</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';

export default {
  name: 'FriendView',
  setup() {
    const router = useRouter();
    let unsubscribeAuth = null;
    let unsubscribeRequests = null;

    const currentUser = ref();
    const allUsers = ref([]);
    const searchText = ref("");
    const incomingRequests = ref([]);
    const friends = ref([]);

    const fetchCurrentUser = () => {
      currentUser.value = auth.currentUser;
    };

    const fetchAllUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      allUsers.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().photoURL || ''
      })).filter(user => user.id !== currentUser.value?.uid);
    };

    const fetchFriends = async () => {
      const currentUserUid = currentUser.value.uid;

      const friendsQuery1 = query(collection(db, 'friends'), where('userId1', '==', currentUserUid));
      const friendsQuery2 = query(collection(db, 'friends'), where('userId2', '==', currentUserUid));

      const [firstQuerySnapshot, secondQuerySnapshot] = await Promise.all([
        getDocs(friendsQuery1),
        getDocs(friendsQuery2)
      ]);

      const friendsData = [...firstQuerySnapshot.docs, ...secondQuerySnapshot.docs].map(async docSnapshot => {
        const friendData = docSnapshot.data();
        const otherUserId = friendData.userId1 === currentUserUid ? friendData.userId2 : friendData.userId1;

        const userDocRef = doc(db, 'users', otherUserId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = {
            id: userDocSnapshot.id,
            name: userDocSnapshot.data().name,
            email: userDocSnapshot.data().email,
            photoURL: userDocSnapshot.data().photoURL || ''
          };
          return userData;
        }
        return null;
      });

      const loadedFriends = await Promise.all(friendsData);

      friends.value = loadedFriends.filter(friend => friend !== null);
    };

    const deleteFriend = async (friendId) => {
      const currentUserUid = currentUser.value.uid;

      try {
        const friendsQuery1 = query(collection(db, 'friends'), where('userId1', '==', currentUserUid), where('userId2', '==', friendId));
        const friendsQuery2 = query(collection(db, 'friends'), where('userId1', '==', friendId), where('userId2', '==', currentUserUid));

        const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
          getDocs(friendsQuery1),
          getDocs(friendsQuery2)
        ]);

        for (const docSnapshot of friendsSnapshot1.docs) {
          await deleteDoc(doc(db, 'friends', docSnapshot.id));
        }

        for (const docSnapshot of friendsSnapshot2.docs) {
          await deleteDoc(doc(db, 'friends', docSnapshot.id));
        }

        alert('친구가 삭제되었습니다.');
        fetchFriends();
      } catch (error) {
        console.error("Error deleting friend: ", error);
        alert('친구 삭제에 실패하였습니다.');
      }
    };

    const fetchIncomingRequests = () => {
      if (!currentUser.value) return;
      const q = query(collection(db, 'friendRequests'), where('receiverId', '==', currentUser.value.uid));
      unsubscribeRequests = onSnapshot(q, async (snapshot) => {
        const requests = [];
        for (const requestDoc of snapshot.docs) {
          const userDocRef = doc(db, 'users', requestDoc.data().senderId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            requests.push({
              id: requestDoc.id,
              senderId: requestDoc.data().senderId,
              senderName: userDoc.data().name,
              senderEmail: userDoc.data().email,
              senderPhotoURL: userDoc.data().photoURL || ''
            });
          }
        }
        incomingRequests.value = requests;
      });
    };

    const filteredUsers = computed(() => {
      if (searchText.value.trim() === "") {
        return [];
      }
      return allUsers.value.filter(user => user.name.toLowerCase().includes(searchText.value.toLowerCase()));
    });

    const sendFriendRequest = async (receiverId) => {
      const senderId = currentUser.value.uid;
      try {
        const checkFriendship1 = query(collection(db, 'friends'), where('userId1', '==', senderId), where('userId2', '==', receiverId));
        const checkFriendship2 = query(collection(db, 'friends'), where('userId1', '==', receiverId), where('userId2', '==', senderId));
        const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
          getDocs(checkFriendship1),
          getDocs(checkFriendship2)
        ]);

        if (friendsSnapshot1.docs.length > 0 || friendsSnapshot2.docs.length > 0) {
          alert('이미 친구입니다.');
          return;
        }

        const checkSentRequests = query(collection(db, 'friendRequests'), where('senderId', '==', senderId), where('receiverId', '==', receiverId));
        const sentRequestsSnapshot = await getDocs(checkSentRequests);
        if (sentRequestsSnapshot.docs.length > 0) {
          alert('이미 친구 요청을 보냈습니다.');
          return;
        }

        const checkReceivedRequests = query(collection(db, 'friendRequests'), where('senderId', '==', receiverId), where('receiverId', '==', senderId));
        const receivedRequestsSnapshot = await getDocs(checkReceivedRequests);
        if (receivedRequestsSnapshot.docs.length > 0) {
          alert('이 사용자에게 이미 요청이 왔습니다. 요청 목록을 확인해 주세요.');
          return;
        }

        await addDoc(collection(db, 'friendRequests'), {
          senderId: senderId,
          receiverId: receiverId,
          timestamp: serverTimestamp()
        });
        alert('친구 요청이 전송되었습니다.');
      } catch (error) {
        console.error("Error sending friend request: ", error);
        alert('친구 요청 전송에 실패하였습니다.');
      }
    };

    const acceptRequest = async (requestId) => {
      try {
        const requestDocRef = doc(db, 'friendRequests', requestId);
        const requestDoc = await getDoc(requestDocRef);

        if (requestDoc.exists()) {
          const { senderId, receiverId } = requestDoc.data();
          const newFriendship = {
            userId1: senderId,
            userId2: receiverId
          };
          await addDoc(collection(db, 'friends'), newFriendship);
          await deleteDoc(requestDocRef);
          alert('친구 요청을 수락하였습니다.');
          fetchFriends();
        }
      } catch (error) {
        console.error("Error accepting friend request: ", error);
        alert('친구 요청 수락에 실패하였습니다.');
      }
    };

    const declineRequest = async (requestId) => {
      try {
        await deleteDoc(doc(db, 'friendRequests', requestId));
        alert('친구 요청을 거절하였습니다.');
      } catch (error) {
        console.error("Error declining friend request: ", error);
        alert('친구 요청 거절에 실패하였습니다.');
      }
    };

    const checkUserAndRedirect = (user) => {
      if (!user) {
        alert('로그인 해주세요');
        router.push('/');
      }
    };

    onMounted(() => {
      fetchCurrentUser();
      fetchAllUsers();
      unsubscribeAuth = auth.onAuthStateChanged(user => {
        currentUser.value = user;
        checkUserAndRedirect(user);
        if (user) {
          fetchIncomingRequests();
          fetchFriends();
        }
      });
    });

    onUnmounted(() => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeRequests) unsubscribeRequests();
    });

    return {
      allUsers,
      currentUser,
      searchText,
      filteredUsers,
      sendFriendRequest,
      incomingRequests,
      acceptRequest,
      declineRequest,
      friends,
      fetchFriends,
      deleteFriend
    };
  }
};
</script>
  
<style scoped>
.user-list{
  overflow-y:scroll; 
  height:183px; 
}
.friend-list{
  overflow-y:scroll;
  height: 400px;
}
.friend-request-list{
  overflow-y:scroll; 
  height: 400px;
}
.user-image, .friend-image, .request-image {
  object-fit: cover;
  width: 64px;
  height: 64px;
  border-radius: 50%;
}
</style>
