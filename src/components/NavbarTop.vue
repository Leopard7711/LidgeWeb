<template>
    <nav class="navbar is-warning has-background-warning-65">
      

        <div class="navbar-menu">
          <router-link to="/" style="width: 164.07px;">
            <div class="image">
              <img :src="logoImage">
            </div>
          </router-link>
          
            
          
            <router-link to="/" class="navbar-item pl-4 is-size-5 has-text-dark has-text-weight-bold">홈</router-link>
            <router-link to="/RoomSetting" class="navbar-item pl-4 is-size-5 has-text-dark has-text-weight-bold">방 만들기</router-link>
            <router-link to="/Friend" class="navbar-item pl-4 is-size-5 has-text-dark has-text-weight-bold">친구</router-link>
            <router-link to="/UserSetting" class="navbar-item pl-4 is-size-5 has-text-dark has-text-weight-bold">설정</router-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field is-grouped"> 
              <a class="button">
                <span class="icon">
                  <i class="fa-brands fa-twitter"></i>
                </span>
                <span class="has-text-weight-semibold">트위터</span>
              </a>
              <a class="button">
                <span class="icon">
                  <i class="fa-solid fa-download"></i>
                </span>
                <span class="has-text-weight-semibold">다운로드</span>
              </a>
            </div>
          </div>

        </div>
      
      </nav>
</template>
<script>
    export default{
    name: 'NavbarTop',
    data() {
    return {
      logoImage: require('@/assets/lidgelogo.png')
    }
  
    }
    
  }
  
</script>
<style scoped>

.navbar{
    height: 70px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  }
  .navbar-menu{
    justify-content: center;
  }
  
  /* .hover-change:hover{
    background-color:rgba(0, 0, 0, 0.073)
  }
   */
</style>

