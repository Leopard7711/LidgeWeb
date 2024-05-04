<template>
  <section class="sign-view">
    <SignBox></SignBox>
    <!-- 추가적인 내용이나 뷰 여기에 삽입할 수 있음 -->
  </section>
</template>

<script>
// SignBox.vue 컴포넌트를 임포트합니다.
import SignBox from '@/components/SignBox.vue'

export default {
  name: 'SignView',
  components: {
    SignBox // SignBox 컴포넌트를 등록합니다.
  }
}
</script>

<style>

</style>
