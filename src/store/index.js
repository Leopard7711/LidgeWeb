import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      user: null, // 사용자 정보를 null로 초기화
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user; // 사용자 정보 설정
    },
  },
  actions: {
    login({ commit }, user) {
      // 로그인 액션, 예시이므로 실제 인증 로직은 구현 필요
      commit('setUser', user);
    },
  },
});
