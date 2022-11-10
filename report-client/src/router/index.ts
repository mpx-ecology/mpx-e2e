import { createRouter, createWebHashHistory } from 'vue-router'
import GenCaseView from '@/views/GenCase/GenCase.vue'
import HomeView from '../views/HomeView/HomeView.vue'

export const config = [
  {
    path: '/gencase',
    name: 'gencase',
    component: GenCaseView,
    title: '用例管理'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    title: '测试报告'
  },
  {
    path: '/screenShot',
    name: 'screenShot',
    component: () => import('../views/ScreenShot/ScreenShot.vue'),
    title: '页面快照'
  },
  {
    path: '/JSError',
    name: 'JSError',
    component: () => import('../views/JSError/JSError.vue'),
    title: '错误日志'
  },
  { path: '/', redirect: '/gencase' }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: config
})

export default router
