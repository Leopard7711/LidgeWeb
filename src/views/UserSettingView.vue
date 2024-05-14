<template>
  <div class="container is-max-desktop">
    <div class="panel p-5 " style="height: 800px;">
      <div class="panel ">
        <div class="user-info p-5 is-flex  is-justify-content-center" v-if="user">

          <div class="is-flex-grow-1  is-flex is-justify-content-center is-align-items-center">
            <figure class="image is-128x128 ">
              <img class="is-rounded" :src="user.photoURL || 'https://via.placeholder.com/128x128.png?text=Image'" alt="User photo">
            </figure>
          </div>
          <div class="is-flex-grow-4 is-flex is-justify-content-center is-align-items-start is-flex-direction-column ">
            <p class="is-size-5 has-text-weight-semibold">{{ user.name }}</p>
            <p class="is-size-6">{{ user.email }}</p>
          </div>
          <div class="is-flex-grow-.5  is-flex  is-align-items-center  ">
            <button class=" button is-danger has-text-weight-semibold">탈퇴하기</button>
          </div>
          
          
        </div>
      </div >
      <div class="columns info-setting" >
        <div class="column ">
          <div class="box" style="height: 300px;">

          </div>
        </div>
        <div class="column ">
          <div class="box" style="height: 300px;">
            
          </div>
        </div>
        
      </div>
    
    </div>
  </div>
</template>
<script>
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  name: 'UserSettingView',
  setup() {
    const isCheckingAuth = ref(true);
    const router = useRouter();
    const user = ref(null);

    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        user.value = {
          name: userData.name,
          email: userData.email,
          photoURL: userData.photoURL || null,
        };
      } else {
        console.log('User data does not exist');
      }
    };

    const checkUserAndRedirect = (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        if (isCheckingAuth.value) {
          alert('로그인 해주세요');
          router.push('/');
        }
      }
      isCheckingAuth.value = false;
    };

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        checkUserAndRedirect(user);
      });
    });

    return {
      user
    };
  }
}
</script>

<style scoped>
.user-info {
  text-align: center;

}
</style>