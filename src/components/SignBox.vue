<template>
    <div class="container is-flex is-justify-content-center">
      <div class="signup-box">
        <div class="field">
          <p class="control">
            <input class="input" type="text" v-model="email" placeholder="email">
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="password" v-model="password" placeholder="password">
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-primary" v-on:click="signUp">가입하기</button>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    name: 'SignUp',
  
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      signUp() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, this.email, this.password).then(
          () => {
            alert('회원가입완료!');
          },
          (err) => {
            alert('에러: ' + err.message);
          }
        );
      }
    },
  }
  </script>
  
  <!-- 스타일을 별도로 분리 -->
  <style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 50px; /* 네비게이션바 높이에 맞춰 조정 */
}

.signup-box {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
  border-radius: 5px;
  background-color: white; /* 박스 배경색을 흰색으로 설정 */
}
</style>

  