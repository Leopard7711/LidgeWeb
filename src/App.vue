<template>
  <div id="app" class="is-flex is-flex-direction-column is-justify-content-space-between" >
    <NavbarTop></NavbarTop>
    <div class="background-panel has-background-warning-70"></div>

    <!-- Content container might be needed for proper spacing -->
    <div>
      <router-view class="mt-5" />
    </div>

    <FooterBottom />
  </div>
</template>

<script>
import NavbarTop from "@/components/NavbarTop.vue";
import FooterBottom from "@/components/FooterBottom.vue";

export default {
  name: 'App',
  components: {
    NavbarTop,
    FooterBottom
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
body {
  font-family: 'Pretendard-Regular';

  margin: 0;
}
.background-panel {
  width: 100%;
  height: 500px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  position: absolute;
  z-index: -1;
}
.panel {
  background-color: white;
  box-shadow: 0 8px 8px 0 rgba(0,0,0,.1);
}
</style>