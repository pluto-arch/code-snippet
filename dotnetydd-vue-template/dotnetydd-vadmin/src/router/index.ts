import { createRouter, createWebHistory } from 'vue-router'
import routes from './staticRoute'


  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  export default router