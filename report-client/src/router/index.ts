import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'

export const config = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    title: '概览'
  },
  {
    path: '/screenShot',
    name: 'screenShot',
    component: () => import('../views/ScreenShot/ScreenShot.vue'),
    title: '截图'
  },
  {
    path: '/gencase',
    name: 'gencase',
    component: () => import('../views/GenCase/GenCase.vue'),
    title: '工作台'
  },
  {
    path: '/JSError',
    name: 'JSError',
    component: () => import('../views/JSError/JSError.vue'),
    title: 'JS报错'
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: config
})

export default router
