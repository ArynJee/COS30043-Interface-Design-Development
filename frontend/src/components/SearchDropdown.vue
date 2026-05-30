<script setup>
import { watch } from 'vue'
import { ArrowRight } from '@lucide/vue'
import { useSearch } from '@/hooks/useSearch.js'

const props = defineProps({
  query: { type: String, required: true },
})
const emit = defineEmits(['close'])

const {
  query,
  products,
  showcaseResults,
  loading,
  hasSearched,
  hasResults,
  formatPrice,
  goToProducts,
  goToShowcase,
  goToShowcaseAll,
} = useSearch()

watch(
  () => props.query,
  (q) => { query.value = q },
  { immediate: true },
)

function handleGoToProducts() { goToProducts(); emit('close') }
function handleGoToShowcase(id) { goToShowcase(id); emit('close') }
function handleGoToShowcaseAll() { goToShowcaseAll(); emit('close') }
</script>

<template>
  <div class="sd-wrap position-absolute right-0 overflow-hidden">
    <!-- loading -->
    <div v-if="loading" class="sd-state d-flex align-items-center justify-content-center px-3 py-2 gap-3">
      <span class="sd-spinner rounded-pill" />
      <span>Searching…</span>
    </div>

    <template v-else-if="hasSearched">
      <!-- products -->
      <div v-if="products.length > 0" class="sd-section px-2 py-3">
        <p class="sd-section-label text-uppercase px-3 mb-2">Products</p>
        <button
          v-for="p in products"
          :key="p.id"
          class="sd-item d-flex align-items-center gap-3 w-100 px-3 py-2 border-0 text-left"
          @mousedown.prevent
          @click="handleGoToProducts"
        >
          <img :src="p.images?.[0]" :alt="p.name" class="sd-thumb object-fit-cover" />
          <div class="sd-item-body d-flex flex-column gap-1">
            <span class="sd-item-name overflow-hidden">{{ p.name }}</span>
            <span class="sd-item-meta">{{ formatPrice(p.base_price) }}</span>
          </div>
        </button>
        <button class="sd-see-all d-flex align-items-center w-100 gap-2 border-0 text-left" @mousedown.prevent @click="handleGoToProducts">
          See all products for "{{ query }}"
          <ArrowRight :size="12" />
        </button>
      </div>

      <!-- showcase -->
      <div v-if="showcaseResults.length > 0" class="sd-section px-2 py-3">
        <p class="sd-section-label text-uppercase px-3 mb-2">Showcase</p>
        <button
          v-for="c in showcaseResults"
          :key="c.id"
          class="sd-item d-flex align-items-center gap-3 w-100 px-3 py-2 border-0 text-left"
          @mousedown.prevent
          @click="handleGoToShowcase(c.id)"
        >
          <img
            v-if="c.preview_image_url"
            :src="c.preview_image_url"
            :alt="c.area"
            class="sd-thumb"
          />
          <div v-else class="sd-thumb sd-thumb-placeholder" />
          <div class="sd-item-body d-flex flex-column gap-1">
            <span class="sd-item-name overflow-hidden">{{ c.first_name }} {{ c.last_name }}</span>
            <span class="sd-item-meta">{{ c.area }} · {{ c.furniture_type }}</span>
          </div>
        </button>
        <button class="sd-see-all d-flex align-items-center w-100 gap-2 border-0 text-lef" @mousedown.prevent @click="handleGoToShowcaseAll">
          Browse all showcase
          <ArrowRight :size="12" />
        </button>
      </div>

      <!-- empty -->
      <div v-if="!hasResults" class="sd-state">
        No results for "{{ query }}"
      </div>
    </template>
  </div>
</template>

<style scoped>
.sd-wrap {
  top: calc(100% + 6px);
  width: 340px;
  background: #fff;
  border: 1px solid #e4ddd5;
  box-shadow: 0 8px 28px rgba(44, 34, 24, 0.12);
  z-index: 1200;
  font-family: 'Times New Roman', Times, serif;
}

.sd-state {
  font-size: var(--fs-sm);
  color: #9b8b79;
}

.sd-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e4ddd5;
  border-top-color: #8b6f47;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.sd-section + .sd-section {
  border-top: 1px solid #f0ebe4;
}

.sd-section-label {
  font-size: var(--fs-xs);
  letter-spacing: 0.16em;
  color: #c4a882;
}

.sd-item {
  background: none;
  cursor: pointer;
  transition: background 0.15s;
}
.sd-item:hover {
  background: #faf7f3;
}

.sd-thumb {
  width: 42px;
  height: 42px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f0ebe4;
}
.sd-thumb-placeholder {
  background: #ede8e1;
}

.sd-item-body {
  min-width: 0;
}
.sd-item-name {
  font-size: var(--fs-sm);
  color: #2c2218;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sd-item-meta {
  font-size: var(--fs-xs);
  color: #9b8b79;
}

.sd-see-all {
  background: none;
  cursor: pointer;
  font-size: var(--fs-xs);
  color: #8b6f47;
  transition: color 0.15s;
}
.sd-see-all:hover {
  color: #5c4830;
}

/* dark mode */
[data-theme='dark'] .sd-wrap {
  background: #1e1b14;
  border-color: #3a3025;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}
[data-theme='dark'] .sd-section + .sd-section { border-top-color: #3a3025; }
[data-theme='dark'] .sd-item:hover { background: #2a2418; }
[data-theme='dark'] .sd-item-name { color: #e8ddd0; }
[data-theme='dark'] .sd-item-meta { color: #7a6a5a; }
[data-theme='dark'] .sd-thumb-placeholder { background: #2a2418; }
[data-theme='dark'] .sd-state { color: #7a6a5a; }
[data-theme='dark'] .sd-see-all { color: #c4a882; }
[data-theme='dark'] .sd-see-all:hover { color: #e0c99a; }
[data-theme='dark'] .sd-spinner {
  border-color: #3a3025;
  border-top-color: #c4a882;
}
</style>
