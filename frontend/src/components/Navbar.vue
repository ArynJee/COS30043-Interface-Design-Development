<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPin, ShoppingCart, UserCircle } from '@lucide/vue'

const navLinks = [
  { name: 'Products', path: '/products' },
  { name: 'Showcase', path: '/showcase' },
  { name: 'Customize', path: '/customize' },
  { name: 'About Us', path: '/about' },
]

// check login status
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})

// dynamic profile route
const profileRoute = computed(() => {
  return isLoggedIn.value
    ? '/profile'
    : '/login'
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
    <div class="container position-relative d-flex align-items-center">
      <!-- left: logo-->
      <router-link to="/" class="navbar-brand fw-bold fs-4 text-uppercase m-0">
        ComfyHome
      </router-link>

      <!-- hamburger menu for mobile -->
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">

        <!-- center: links -->
        <ul class="navbar-nav mx-auto text-uppercase small fw-bold custom-center-nav">
          <li v-for="link in navLinks" :key="link.name" class="nav-item px-3">
            <router-link :to="link.path" class="nav-link" v-text="link.name"></router-link>
          </li>
        </ul>

        <!-- right: branch, cart, profile -->
        <div class="d-flex align-items-center gap-4 ms-auto">
          <router-link title="Locations" to="/locations" class="text-dark">
            <MapPin :size="20" />
          </router-link>

          <router-link title="Cart" to="/cart" class="text-dark position-relative">
            <ShoppingCart :size="20" />
          </router-link>

          <router-link title="Profile" :to="profileRoute" class="text-dark">
            <UserCircle :size="22" />
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  font-family: 'Times New Roman', Times, serif;
}
.nav-link {
  color: #2c2218 !important;
  transition: opacity 0.3s ease;
  letter-spacing: 1px;
}
.nav-link:hover {
  opacity: 0.5;
  color: #8b6f47 !important
}
@media (min-width: 992px) {
  .custom-center-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    white-space: nowrap;
  }
}
.ms-auto {
  margin-left: auto !important;
}
a {
  text-decoration: none;
}
</style>
