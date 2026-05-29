<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<template>
  <main>
    <router-view />
  </main>
</template>

<style>
body {
  font-family: 'Times New Roman', Times, serif;
}
</style>