<template>
  <nav class="navbar is-warning has-background-warning-65">
    <div class="navbar-brand">
      
    </div>

    <div class="navbar-menu">
      <div class="navbar-start" style="min-width: 300px;">
          
      </div>
      
      <div class="navbar-center">
        <router-link to="/" class="navbar-item" style="padding: 0;">
        <img :src="logoImage" style="max-height: 70px;">
        </router-link>
        <router-link to="/" class="navbar-item is-size-5 has-text-dark has-text-weight-bold">홈</router-link>
        <router-link to="/RoomSetting" class="navbar-item is-size-5 has-text-dark has-text-weight-bold">방 만들기</router-link>
        <router-link to="/Friend" class="navbar-item is-size-5 has-text-dark has-text-weight-bold">친구</router-link>
        <router-link to="/UserSetting" class="navbar-item is-size-5 has-text-dark has-text-weight-bold">설정</router-link>
      </div>
      
      <div class="navbar-end" style="min-width: 300px;">
        <div class="navbar-item">
          <div class="buttons">
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
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarTop',
  data() {
    return {
      logoImage: require('@/assets/lidgelogo.png')
    }
  }
}
</script>

<style scoped>
.navbar {
  height: 70px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.navbar-center {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}
.navbar-item {
  padding-left: 1rem;
}
</style>
