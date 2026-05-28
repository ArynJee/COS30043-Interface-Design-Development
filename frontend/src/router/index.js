import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '@/layout/AuthLayout.vue'
import MainLayout from '@/layout/MainLayout.vue'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Products from '@/views/Products.vue'
import Showcase from '@/views/Showcase.vue'
import Customize from '@/views/Customize.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'products', component: Products },
      { path: 'showcase', component: Showcase },
      { path: 'customize', component: Customize },
    ],
  },

  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'registration', component: Registration },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router