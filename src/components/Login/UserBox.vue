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
  
  export default {
    name: 'UserBox',
    computed: {
      userName() {
        return auth.currentUser ? auth.currentUser.displayName || auth.currentUser.email : '';
      }
    },
    methods: {
      logout() {
        signOut(auth).then(() => {
          console.log('Logged out successfully');
        }).catch((error) => {
          console.error('Logout failed', error);
        });
      }
    }
  }
  </script>