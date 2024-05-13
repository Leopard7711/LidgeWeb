<template>
  
  <div class="container is-max-desktop">
    <div class="columns">
      <div class="column is-8">
        <div class="panel pb-4">
          <p class="panel-heading">진행중인 방</p>
          <RoomList></RoomList>
        </div>
      </div>
      <div class="column is-4 is-flex is-flex-direction-column" >
        <div class="panel p-4" style="height: 250px;">
          <LoginBox v-if="!isLoggedIn"></LoginBox>
          <UserBox v-else></UserBox>
        </div>
        <div class="panel p-4 is-flex-grow-1">
          <FriendList ></FriendList>
        </div>
      </div>
    </div>
    <div class="panel">
      <p class="panel-heading">최근 기록</p>
      <p class="px-4 py-4">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Ducimus culpa dolores veritatis tenetur animi possimus recusandae magni atque
        vitae vero, minima obcaecati molestiae eveniet distinctio magnam esse, sit iure veniam!
      </p>
      </div>
    <div class="panel ">
      <p class="panel-heading">공지사항</p>
      <p class="px-4 py-4">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Ducimus culpa dolores veritatis tenetur animi possimus recusandae magni atque
        vitae vero, minima obcaecati molestiae eveniet distinctio magnam esse, sit iure veniam!
      </p>
    </div>
  </div>


</template>

<script>
 import { ref, onMounted } from 'vue';
   import LoginBox from "@/components/Login/LoginBox.vue"; 
   import UserBox from "@/components/Login/UserBox.vue"; 
   import RoomList from "@/components/RoomList.vue"; 
   import FriendList from "@/components/FriendList.vue"; 
   import { auth } from '@/firebase'; 
   import { onAuthStateChanged } from 'firebase/auth';

   export default { 
     name: 'HomeView', 
     components: { 
       LoginBox, 
       UserBox, 
       RoomList, 
       FriendList 
     }, 
     setup() {
       const isLoggedIn = ref(false);

       onMounted(() => {
         const unsubscribe = onAuthStateChanged(auth, (user) => {
           isLoggedIn.value = !!user;
         });

         // Clean up the subscription on unmount
         return () => unsubscribe();
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