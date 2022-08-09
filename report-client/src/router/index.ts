import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'

export const config = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    title: '报告'
  },
  {
    path: '/screenShot',
    name: 'screenShot',
    component: () => import('../views/ScreenShot/ScreenShot.vue'),
    title: '截图'
  },
  // {
  //   path: '/work',
  //   name: 'work',
  //   component: () => import('../views/WorkView.vue'),
  //   title: '工作台'
  // },
  {
    path: '/gencase',
    name: 'gencase',
    component: () => import('../views/GenCaseView.vue'),
    title: '工作台'
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: config
})

export default router
