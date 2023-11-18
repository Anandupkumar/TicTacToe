import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/play',
      name: 'play',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView
    },
    {
      path: '/selectOponent',
      name: 'selectOponent',
      
      component: () => import('../views/SelectOponent.vue')
    },
    {
      path: '/wait',
      name: 'wait',
      
      component: () => import('../views/waiting.vue')
    }
  ]
})

export default router
