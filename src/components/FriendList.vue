<template>
    
      <p class="has-text-weight-bold">친구 목록</p>
      <div class="list mt-1 ">
        <div class="list-item is-flex is-align-items-center is-justify-content-space-between">
            <div class="is-flex is-align-items-center">
                <figure class="image is-32x32">
                    <img class="is-rounded" src="https://via.placeholder.com/128x128.png?text=Image">
                </figure>
                <p class="ml-3 has-text-weight-semibold">오주영</p>
            </div>

            <button class="delete"></button>
        </div>
        <div class="list-item is-flex is-align-items-center is-justify-content-space-between">
            <div class="is-flex is-align-items-center">
                <figure class="image is-32x32">
                    <img class="is-rounded" src="https://via.placeholder.com/128x128.png?text=Image">
                </figure>
                <p class="ml-3 has-text-weight-semibold">최상호</p>
            </div>

            <button class="delete"></button>
        </div>
        <div class="list-item is-flex is-align-items-center is-justify-content-space-between">
            <div class="is-flex is-align-items-center">
                <figure class="image is-32x32">
                    <img class="is-rounded" src="https://via.placeholder.com/128x128.png?text=Image">
                </figure>
                <p class="ml-3 has-text-weight-semibold">박세준</p>
            </div>

            <button class="delete"></button>
        </div>
        <div class="list-item is-flex is-align-items-center is-justify-content-space-between">
            <div class="is-flex is-align-items-center">
                <figure class="image is-32x32">
                    <img class="is-rounded" src="https://via.placeholder.com/128x128.png?text=Image">
                </figure>
                <p class="ml-3 has-text-weight-semibold">유정인</p>
            </div>

            <button class="delete"></button>
        </div>
      </div>
    
</template>
  
<script>
export default {
name: 'FriendList',
}
</script>
<style scoped>
    .list {
    flex: 1;
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 표시 */
    max-height: 160px;
    }
</style>