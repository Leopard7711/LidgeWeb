<template>
  
  <div class="container is-max-desktop ">
    
    <div class="columns ">
      <div class="column is-8">
        <div class="panel pb-4 ">
          <p class="panel-heading">진행중인 방</p>
          <RoomList></RoomList>
        </div>
      </div>
      <div class="column is-4 is-flex is-flex-direction-column pr-0" >
        <div class="panel p-4 " style="height: 250px;">
          <LoginBox v-if="!isLoggedIn"></LoginBox>
          <UserBox v-else></UserBox>
        </div>
        <div class="panel p-4 is-flex-grow-1">
          <FriendList ></FriendList>
        </div>
      </div>
    </div>
    <div class="panel">
      <p class="panel-heading">내가 만든 방</p>
      <MyRoom class="px-4 py-4"></MyRoom>
      </div>
  

</div>

</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginBox from "@/components/Login/LoginBox.vue"; 
import UserBox from "@/components/Login/UserBox.vue"; 
import RoomList from "@/components/RoomList.vue"; 
import FriendList from "@/components/FriendList.vue";
import MyRoom from "@/components/MyRoom.vue"

export default {
  name: 'HomeView',
  components: {
    LoginBox,
    UserBox,
    RoomList,
    FriendList,
    MyRoom
  },
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
          router.push('/'); // 로그인 페이지로 리다이렉트
        }
      });
    });

    return {
      isLoggedIn
    };
  }
};
</script>
<style scoped>
  .box.is-flex-grow-1 {
  display: flex;
  flex-direction: column;
}
</style>