<template>
    <div>
      <p>환영합니다, {{ userName }}!</p>
        <button @click="logout" class="button is-light ml-3">
            <p class="has-text-weight-semibold">로그아웃</p>
        </button>
    </div>
  </template>
  
  <script>
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'UserBox',
  setup() {
    const router = useRouter();

    const userName = computed(() => {
      return auth.currentUser ? auth.currentUser.displayName || auth.currentUser.email : '';
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
        });
    };

    return {
      userName,
      logout,
    };
  },
};
</script>