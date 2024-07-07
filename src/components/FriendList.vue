<template>
  <p class="has-text-weight-bold">친구 목록</p>
  <div v-if="!currentUser" class="is-flex is-align-items-center" style="height: 100%;">
    <div class="is-flex-grow-1">
      <p class="is-size-5 has-text-grey">로그인 해주세요</p>
    </div>
  </div>
  <div v-else-if="friends.length === 0" class="is-flex is-align-items-center" style="height: 100%;">
    <div class="is-flex-grow-1">
      <p class="is-size-5 has-text-grey">친구가 없습니다</p>
    </div>
  </div>
  <div v-else class="list mt-1" style="width: 100%;">
    <div v-for="friend in friends" :key="friend.id"
      class="list-item is-flex is-align-items-center is-justify-content-space-between">
      <div class="is-flex is-align-items-center">
        <figure class="image is-32x32">
          <img class="is-rounded friend-image"
            :src="friend.photoURL || 'https://via.placeholder.com/128x128.png?text=User'" alt="Friend Image">
        </figure>
      </div>
      <p class="ml-3 has-text-weight-semibold">{{ friend.name }}</p>
      <button class="delete" @click="deleteFriend(friend.id)"></button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';

export default {
  name: 'FriendList',
  setup() {
    const friends = ref([]);
    const currentUser = ref(null);

    const fetchFriends = async () => {
      const currentUserUid = currentUser.value.uid;

      const friendsQuery1 = query(collection(db, 'friends'), where('userId1', '==', currentUserUid));
      const friendsQuery2 = query(collection(db, 'friends'), where('userId2', '==', currentUserUid));

      const [firstQuerySnapshot, secondQuerySnapshot] = await Promise.all([
        getDocs(friendsQuery1),
        getDocs(friendsQuery2)
      ]);

      const friendsDataPromises = [...firstQuerySnapshot.docs, ...secondQuerySnapshot.docs].map(async docSnapshot => {
        const friendData = docSnapshot.data();
        const otherUserId = friendData.userId1 === currentUserUid ? friendData.userId2 : friendData.userId1;

        const userDocRef = doc(db, 'users', otherUserId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          return {
            id: userDocSnapshot.id,
            name: userDocSnapshot.data().name,
            email: userDocSnapshot.data().email,
            photoURL: userDocSnapshot.data().photoURL // 친구의 photoURL 추가
          };
        }
        return null;
      });

      const loadedFriends = await Promise.all(friendsDataPromises);

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

        const deletePromises = [...friendsSnapshot1.docs, ...friendsSnapshot2.docs].map(docSnapshot =>
          deleteDoc(doc(db, 'friends', docSnapshot.id))
        );

        await Promise.all(deletePromises);

        // Update the local list after deletion
        await fetchFriends();
      } catch (error) {
        console.error("Error deleting friend: ", error);
      }
    };

    let unsubscribe = null;

    const fetchCurrentUser = () => {
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          currentUser.value = user;
          await fetchFriends();
        } else {
          currentUser.value = null;
        }
      });
    };

    onMounted(() => {
      fetchCurrentUser();
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    return { friends, deleteFriend, currentUser };
  }
};
</script>

<style scoped>
.list {
  flex: 1;
  overflow-y: auto;
  max-height: 207px;
}

.friend-image {
  object-fit: cover;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>
