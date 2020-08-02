import { createRouter, createWebHistory } from "vue-router"
import Home from "/@/views/Home.vue"
import Other from "/@/views/Other.vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/other',
      component: Other
    }
  ]
})