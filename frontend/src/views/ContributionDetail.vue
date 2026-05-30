<script setup>
import { useRoute, RouterLink } from 'vue-router'
import ItemDetailPanel from '@/components/ItemDetailPanel.vue'
import useContributionDetail from '@/hooks/useContributionDetail.js'

const route = useRoute()
const {
  contribution, reviews, loading, error,
  skeletonType, furnitureTypeId, parsedConfig, configEntries,
  addingToCart, cartAdded,
  submittingReview, reviewError, reviewSuccess,
  addToCart, submitReview,
} = useContributionDetail(route.params.id)
</script>

<template>
  <div class="cd-page">
    <!-- breadcrumb -->
    <div class="cd-breadcrumb">
      <RouterLink to="/">Home</RouterLink>
      &ensp;›&ensp;
      <RouterLink to="/showcase">Showcase</RouterLink>
      <span v-if="contribution">&ensp;›&ensp;{{ contribution.furniture_type }}</span>
    </div>

    <!-- loading -->
    <div v-if="loading" class="cd-state">Loading design…</div>

    <!-- error -->
    <div v-else-if="error" class="cd-state cd-error">{{ error }}</div>

    <!-- panel -->
    <ItemDetailPanel
      v-else
      type="contribution"
      :item="contribution"
      :reviews="reviews"
      :addingToCart="addingToCart"
      :cartAdded="cartAdded"
      :submittingReview="submittingReview"
      :reviewError="reviewError"
      :reviewSuccess="reviewSuccess"
      :skeletonType="skeletonType"
      :furnitureTypeId="furnitureTypeId"
      :parsedConfig="parsedConfig"
      :configEntries="configEntries"
      @add-to-cart="addToCart"
      @submit-review="submitReview"
    />
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.cd-page {
  background: var(--bg-page);
  min-height: 100vh;
}

.cd-breadcrumb {
  padding: 1.1rem 5rem;
  font-size: var(--fs-sm);
  color: var(--color-secondary);
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
}
.cd-breadcrumb a {
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.cd-breadcrumb a:hover { color: var(--color-primary); }

.cd-state {
  text-align: center;
  padding: 6rem 2rem;
  font-size: var(--fs-md);
  color: var(--color-secondary);
}
.cd-error { color: #c0392b; }

@media (max-width: 991px) {
  .cd-breadcrumb { padding: 1rem 2.5rem; }
}
@media (max-width: 767px) {
  .cd-breadcrumb { padding: 0.9rem 1.25rem; }
}
</style>
