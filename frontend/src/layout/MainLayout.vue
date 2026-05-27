<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Navbar />

  <main class="main-content">
    <RouterView />
  </main>

  <Footer />
</template>

<style scoped>
/* On mobile push content right to clear the 62px collapsed sidebar */
@media (max-width: 991.98px) {
  .main-content {
    padding-left: 62px;
  }
}
</style>
