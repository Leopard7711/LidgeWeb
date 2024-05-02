<template>
  <form class="login" @submit.prevent="login" v-if="!isLoggedIn">
      <div class="field">
          <label class="label">이메일</label>
          <div class="control">
              <input class="input" type="email" v-model="email" placeholder="e.g. alex@example.com" />
          </div>
      </div>
      <div class="field">
          <label class="label">비밀번호</label>
          <div class="control">
              <input class="input" type="password" v-model="password" placeholder="********" />
          </div>
      </div>
      <div class="buttons">
          <button class="button is-danger" type="submit"><p class="has-text-weight-semibold">로그인</p></button>
          <button class="button is-light" type="button" @click="goToSignUp"><p class="has-text-weight-semibold">회원가입</p></button>
      </div>
  </form>
  <div v-else>
      <p>{{ userName }}님 환영합니다!</p>
      <button class="button is-primary" @click="createRoom">방 만들기</button>
      <button class="button is-info" @click="createCharacter">캐릭터 만들기</button>
      <button class="button is-light" @click="logout">로그아웃</button>
  </div> <!-- 이것은 올바른 닫는 태그입니다. -->
</template>

<script>
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'LoginBox',
  data() {
    return {
      email: '',
      password: '',
      isLoggedIn: false, // 로그인 상태
      userName: '', // 사용자 이름
    }
  },
  methods: {
    login() {
      // Firebase Auth 인스턴스 생성
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // 로그인 성공
          console.log(userCredential.user);
          this.userName = userCredential.user.email; // 사용자 이름 설정
          this.isLoggedIn = true; // 로그인 상태를 true로 설정
        })
        .catch(err => {
          alert('로그인 에러: ' + err.message); // 에러 표시
        });
    },
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        // 로그아웃 성공
        this.isLoggedIn = false; // 로그인 상태를 false로 설정
        this.email = '';
        this.password = '';
        alert("로그아웃되었습니다."); // 로그아웃 알림
      }).catch((err) => {
        console.error("로그아웃 에러: ", err.message); // 에러 처리
      });
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 사용자가 로그인한 경우
        this.userName = user.email; // 사용자 이름 설정
        this.isLoggedIn = true; // 로그인 상태를 true로 설정
      } else {
        // 사용자가 로그아웃한 경우
        this.isLoggedIn = false; // 로그인 상태를 false로 설정
        this.userName = ''; // 사용자 이름 초기화
      }
    });
  }
}
</script>


<style scoped>
.login-success {
  text-align: center;
}

.login-success .buttons {
  display: flex;
  justify-content: center; /* 버튼들을 가운데 정렬합니다 */
  gap: 10px; /* 버튼 사이의 간격을 지정 */
}

/* 화면이 작을 경우 버튼을 세로로 정렬 */
@media (max-width: 600px) {
  .login-success .buttons {
    flex-direction: column; /* 버튼을 세로 방향으로 정렬 */
  }
}
</style>
