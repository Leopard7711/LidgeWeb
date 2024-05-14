<template>

    <p class="has-text-weight-bold">친구 목록</p>
    <div v-if="friends.length === 0" class="is-flex is-align-items-center" style="height: 100%;">
      <div class="is-flex-grow-1">
        <p class="is-size-5 has-text-grey">로그인 해주세요</p>
      </div>
    </div>
    <div v-else class="list mt-1 " style="width: 100%;">
      <div v-for="friend in friends" :key="friend.id" class="list-item is-flex is-align-items-center is-justify-content-space-between">
        <div class="is-flex is-align-items-center">
          <figure class="image is-32x32">
            <img class="is-rounded" :src="friend.photoURL || 'https://via.placeholder.com/128x128.png?text=User'" alt="Friend Image">
          </figure>
        </div>
        <p class="ml-3 has-text-weight-semibold">{{ friend.name }}</p>
        <button class="delete" @click="deleteFriend(friend.id)"></button>
      </div>
    </div>
</template>
  
  <script>
  import { ref , onMounted, onUnmounted} from 'vue';
  import { db, auth } from '@/firebase'; 
  import { collection, query, where, getDocs, doc, deleteDoc,getDoc } from 'firebase/firestore';
  
  export default {
    name: 'FriendList',
    setup() {
      const friends = ref([]);
      const currentUser = ref();
      // Fetch the current user's friends
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
                    email: userDocSnapshot.data().email
                };
                return userData;
            }
            return null;
        });

        const loadedFriends = await Promise.all(friendsData);

        friends.value = loadedFriends.filter(friend => friend !== null);
        };

      const deleteFriend = async (friendId) => {
        const currentUserUid = auth.currentUser.uid;
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

      return { friends, deleteFriend };
    }
  }
  </script>
  
  <style scoped>
  .list {
    flex: 1;
    overflow-y: auto;
    max-height: 160px;
  }
  </style>