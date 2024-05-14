<template>
  <form class="login" @submit.prevent="login(email, password)">
      <div class="field">
          <label class="label">이메일</label>
          <div class="control">
              <input class="input" type="email" placeholder="이메일 입력" v-model="email" />
          </div>
      </div>

      <div class="field">
          <label class="label">비밀번호</label>
          <div class="control">
              <input class="input" type="password" placeholder="비밀번호 입력" v-model="password" />
          </div>
      </div>

      <button type="submit" class="button is-danger">
          <p class="has-text-weight-semibold">로그인</p>
      </button>
      <router-link to="/createAccount" v-slot="{ navigate }">
          <button class="button is-light ml-3" @click="navigate">
              <p class="has-text-weight-semibold">회원가입</p>
          </button>
      </router-link>
  </form>
</template>

<script>
import { auth } from '@/firebase'; 
import { signInWithEmailAndPassword} from 'firebase/auth';

export default {
  name: 'LoginBox',
  data() {
      return {
          email: '',
          password: ''
      };
  },
  methods: {
      login(email, password) {
          signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                  console.log("Login successful", userCredential.user);
                  
              })
              .catch((error) => {
                  console.error("Login failed", error);
                  alert("입력하신 정보가 잘못되었습니다");
              });
      }
  }
}
</script>
<style>


</style>