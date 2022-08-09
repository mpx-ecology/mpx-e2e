import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const config = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    title: '报告'
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
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
