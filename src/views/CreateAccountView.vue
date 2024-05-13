<template>
  <div class="container" style="width: 400px;">
    <div class="box">
      <h1 class="is-size-4 m-4 has-text-weight-semibold">회원가입</h1>
      <div class="columns is-centered">
        <div class="column is-11">
          <form @submit.prevent="onSubmit">
            <div class="field">
              <label class="label">이름</label>
              <div class="control">
                <input class="input" type="text" placeholder="이름 입력" v-model="name">
                <p class="help is-danger" v-if="errors.name">{{ errors.name }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">이메일</label>
              <div class="control">
                <input class="input" type="email" placeholder="이메일 입력" v-model="email">
                <p class="help is-danger" v-if="errors.email">{{ errors.email }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">비밀번호</label>
              <div class="control">
                <input class="input" type="password" placeholder="비밀번호 입력" v-model="password">
                <p class="help is-danger" v-if="errors.password">{{ errors.password }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">비밀번호 확인</label>
              <div class="control">
                <input class="input" type="password" placeholder="비밀번호 재입력" v-model="confirmPassword">
                <p class="help is-danger" v-if="passwordMismatch">비밀번호가 일치하지 않습니다.</p>
              </div>
            </div>
            <div class="field pt-2">
              <div class="control">
                <button class="button is-danger has-text-weight-semibold" type="submit">
                  회원가입
                </button>
                <router-link to="/" v-slot="{ navigate }">
                  <button class="button is-light ml-3 has-text-weight-semibold" @click="navigate">
                    취소
                  </button>
                </router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default {
  name: "CreateAccountView",
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  computed: {
    passwordMismatch() {
      return this.password !== this.confirmPassword;
    }
  },
  watch: {
    name() {
      if (!this.name) {
        this.errors.name = "이름을 입력해주세요.";
      } else {
        this.errors.name = '';
      }
    },
    email() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(this.email)) {
        this.errors.email = '이메일 형식이 올바르지 않습니다.';
      } else {
        this.errors.email = '';
      }
    },
    password() {
      if (this.password.length < 6 || this.password.length > 20) {
        this.errors.password = '비밀번호는 6자 이상 20자 이하로 입력해야 합니다.';
      } else {
        this.errors.password = '';
      }
    },
    confirmPassword() {
      if (this.confirmPassword && this.password !== this.confirmPassword) {
        this.errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      } else {
        this.errors.confirmPassword = '';
      }
    }
  },
  methods: {
    async onSubmit() {
      const errorMessages = Object.values(this.errors).filter(error => error);
      const email = this.email;
      const password = this.password;
      const name = this.name;

      if (errorMessages.length > 0 || this.passwordMismatch) {
        alert("입력 조건을 만족하지 않습니다: \n" + errorMessages.join("\n"));
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Firebase Auth 사용자 프로필에 이름 추가
          await updateProfile(user, { displayName: name });

          // Firestore에 사용자 정보 저장
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            name: name
          });

          alert("가입을 환영합니다!");
          console.log("User created with name: ", this.name);
          this.$router.push('/'); // 홈페이지로 리다이렉트
        } catch (error) {
          console.error("Error signing up or updating profile: ", error);
          if (error.code === 'auth/email-already-in-use') {
            alert("이미 사용 중인 이메일입니다. 다른 이메일을 사용해 주세요.");
          } else {
            alert("회원가입에 실패했습니다: " + error.message);
          }
        }
      }
    }
  }
};
</script>
<style>
.user-list{
    overflow-y: auto; 
    
    height:200px; 
  }
</style>