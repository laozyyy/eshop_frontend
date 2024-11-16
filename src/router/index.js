//createWebHistory :创建history模式的路由 createRouter：创建路由实例对象
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Layout/layout-index.vue'
import Layout from '@/views/Login/login-index.vue'
import Category from '@/views/Category/category-index.vue'
import Home from '@/views/Home/home-index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   { path: '/',
      component: Login,
      children: [
        {
          path: '',
          component:Home
        },
        {
          path: '/category',
          component:Category
        }
      ]
    },
    {
      path: '/login',
      component:Layout
    }
  ],
})

export default router
