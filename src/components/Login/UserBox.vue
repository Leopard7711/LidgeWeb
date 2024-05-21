<template>
  <div class="is-flex is-align-items-center is-flex-direction-column is-justify-content-center">
    <figure class="image">
      <img class="is-rounded" :src="userPhotoURL || 'https://via.placeholder.com/128x128.png?text=Image'" alt="User photo" style="width: 128px; height: 128px; object-fit: cover;">
    </figure>
    <p class="mt-3">환영합니다, {{ userName }}!</p>
    <button @click="logout" class="button is-light mt-2">
      <p class="has-text-weight-semibold">로그아웃</p>
    </button>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  name: 'UserBox',
  setup() {
    const router = useRouter();
    const userName = ref('');
    const userPhotoURL = ref('');

    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        userName.value = userData.name || userData.email;
        userPhotoURL.value = userData.photoURL || '';
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchUserData(user.uid);
        }
      });
    });

    const logout = () => {
      signOut(auth)
        .then(() => {
          console.log('Logged out successfully');
          alert('로그아웃 되었습니다');
          router.go(0);
        })
        .catch((error) => {
          console.error('Logout failed', error);
          alert('로그아웃 실패: ' + error.message);
        });
    };

    return {
      userName,
      userPhotoURL,
      logout,
    };
  },
};
</script>