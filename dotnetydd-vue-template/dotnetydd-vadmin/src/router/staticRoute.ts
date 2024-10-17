import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: false,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/home/index.vue'),
  },
]

export default routes