<template>
  <section class="head">
    <NavbarTop></NavbarTop>
    <div class="background-panel has-background-warning-70"></div>
  </section>


  <router-view class="mt-5"/>
</template>

<script>
import NavbarTop from "@/components/NavbarTop.vue";
export default {
  name: 'App',
  components: {
    NavbarTop
  }
}

</script>

<style>
#app {
  text-align: center;
}
@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
body{
  font-family:'Pretendard-Regular';
}
.background-panel{
  width: 100%;
  height: 500px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  position: absolute;
  z-index: -1;
}
/* nav a.router-link-exact-active {
  
} */


</style>
