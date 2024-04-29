<template>
    <form class="login">
        <div class="field">
        <label class="label">이메일</label>
        <div class="control">
            <input class="input" type="email" placeholder="e.g. alex@example.com" />
        </div>
        </div>

        <div class="field">
        <label class="label">비밀번호</label>
        <div class="control">
            <input class="input" type="password" placeholder="********" />
        </div>
        </div>

        <button class="button is-danger "><p class="has-text-weight-semibold">로그인</p></button>
        <button class="button is-light ml-3"><p class="has-text-weight-semibold">회원가입</p></button>
    </form>
</template>
<script>
  export default {
    name: 'LoginBox',
    
  }
  
  </script>
<style>


</style>