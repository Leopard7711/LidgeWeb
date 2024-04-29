<template>
  <section class="mainSection">
    <div class="container is-max-desktop">
      <div class="columns">
        <div class="column is-8">
          <div class="panel pb-4">
            <p class="panel-heading">Repositories</p>
            <RoomList></RoomList>
          </div>
        </div>
        <div class="column is-4 is-flex is-flex-direction-column" >
          <div class="box">
            <LoginBox></LoginBox>
          </div>
          <div class="box is-flex-grow-1">
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
  </section>

</template>

<script>
import LoginBox from "@/components/LoginBox.vue";
import RoomList from "@/components/RoomList.vue";
import FriendList from "@/components/FriendList.vue";
export default {
  name: 'HomeView',
  components: {
    LoginBox,
    RoomList,
    FriendList,
  }
}
</script>
<style scoped>
  .panel{
    background-color: white;
  }
  .box.is-flex-grow-1 {
  display: flex;
  flex-direction: column;
}
</style>