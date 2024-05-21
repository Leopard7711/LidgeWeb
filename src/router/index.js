import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RoomSettingView from '@/views/RoomSettingView.vue'
import UserSettingView from '@/views/UserSettingView.vue'
import CreateAccountView from '@/views/CreateAccountView.vue'
import FriendView from '@/views/FriendView.vue'
import RoomView from '@/views/RoomView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/RoomSetting',
    name: 'roomSetting',
    component: RoomSettingView
  },
  {
    path: '/UserSetting',
    name: 'userSetting',
    component: UserSettingView
  },
  {
    path:'/CreateAccount',
    name: 'createAccount',
    component: CreateAccountView
  },
  {
    path:'/Friend',
    name: 'friend',
    component: FriendView
  },
  {
    path: '/room/:roomId',
    name: 'RoomView',
    component: RoomView,
    props: true, // roomId를 props로 전달합니다.
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
