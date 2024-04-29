<template>
    
    <div class="room-list">
    <div class="box box-light mx-4 my-4 pl-5 is-flex is-justify-content-space-between" >
        <div class="texts">
          <h2 class=" is-size-4 has-text-weight-semibold">Tobbit님의 방</h2>
          <p class="has-text-left ">3명 입장 중</p>
        </div>
        <div class="buttons">
          <button class="button is-light"  ><p class="has-text-weight-semibold">정보</p></button>
          <button class="button is-primary"  ><p class="has-text-weight-semibold">참가</p></button>
        </div>
        
        
    </div>
    <div class="box box-light mx-4 my-4 pl-5 is-flex is-justify-content-space-between" >
        <div class="texts">
          <h2 class=" is-size-4 has-text-weight-semibold">Panther님의 방</h2>
          <p class="has-text-left ">2명 입장 중</p>
        </div>
        <div class="buttons">
          <button class="button is-light"  ><p class="has-text-weight-semibold">정보</p></button>
          <button class="button is-primary"  ><p class="has-text-weight-semibold">참가</p></button>
        </div>
        
        
    </div>
    <div class="box box-light mx-4 my-4 pl-5  is-flex is-justify-content-space-between" >
        <div class="texts">
          <h2 class=" is-size-4 has-text-weight-semibold">Gomi님의 방</h2>
          <p class="has-text-left ">4명 입장 중</p>
        </div>
        <div class="buttons">
          <button class="button is-light"  ><p class="has-text-weight-semibold">정보</p></button>
          <button class="button is-primary"  ><p class="has-text-weight-semibold">참가</p></button>
        </div>
        
        
    </div>
    <div class="box box-light mx-4 my-4 pl-5  is-flex is-justify-content-space-between" >
        <div class="texts">
          <h2 class=" is-size-4 has-text-weight-semibold">Borrow님의 방</h2>
          <p class="has-text-left ">1명 입장 중</p>
        </div>
        <div class="buttons">
          <button class="button is-light"  ><p class="has-text-weight-semibold">정보</p></button>
          <button class="button is-primary"  ><p class="has-text-weight-semibold">참가</p></button>
          
        </div>
        
        
    </div>
    </div>
</template>
  
  <script>
  export default {
    name: 'RoomList',
    
  }
  </script>
  
  <style scoped>
  .room-list{
    overflow-y: auto; 
    
    height:420px; 
  }
  </style>