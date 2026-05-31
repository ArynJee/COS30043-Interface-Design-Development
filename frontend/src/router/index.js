import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '@/layout/AuthLayout.vue'
import MainLayout from '@/layout/MainLayout.vue'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Products from '@/views/Products.vue'
import Showcase from '@/views/Showcase.vue'
import ContributionDetail from '@/views/ContributionDetail.vue'
import Customize from '@/views/Customize.vue'
import LocationView from '@/views/Location.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'
import OrderConfirmation from '@/views/OrderConfirmation.vue'
import UserProfile from '@/views/UserProfile.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'products', component: Products },
      { path: 'showcase', component: Showcase },
      { path: 'showcase/:id', component: ContributionDetail },
      { path: 'customize', component: Customize },
      { path: 'locations', component: LocationView },
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout },
      { path: 'order-confirmation', component: OrderConfirmation },
      { path: 'profile', component: UserProfile },
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
  scrollBehavior: () => ({ top: 0 }),
})

export default router
