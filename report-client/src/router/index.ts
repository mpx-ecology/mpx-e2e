import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const config = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    title: '首页'
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    title: '截图'
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: config
})

export default router
