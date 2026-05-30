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
  <div class="sd-wrap">
    <!-- loading -->
    <div v-if="loading" class="sd-state">
      <span class="sd-spinner" />
      <span>Searching…</span>
    </div>

    <template v-else-if="hasSearched">
      <!-- products -->
      <div v-if="products.length > 0" class="sd-section">
        <p class="sd-section-label">Products</p>
        <button
          v-for="p in products"
          :key="p.id"
          class="sd-item"
          @mousedown.prevent
          @click="handleGoToProducts"
        >
          <img :src="p.images?.[0]" :alt="p.name" class="sd-thumb" />
          <div class="sd-item-body">
            <span class="sd-item-name">{{ p.name }}</span>
            <span class="sd-item-meta">{{ formatPrice(p.base_price) }}</span>
          </div>
        </button>
        <button class="sd-see-all" @mousedown.prevent @click="handleGoToProducts">
          See all products for "{{ query }}"
          <ArrowRight :size="12" />
        </button>
      </div>

      <!-- showcase -->
      <div v-if="showcaseResults.length > 0" class="sd-section">
        <p class="sd-section-label">Showcase</p>
        <button
          v-for="c in showcaseResults"
          :key="c.id"
          class="sd-item"
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
          <div class="sd-item-body">
            <span class="sd-item-name">{{ c.first_name }} {{ c.last_name }}</span>
            <span class="sd-item-meta">{{ c.area }} · {{ c.furniture_type }}</span>
          </div>
        </button>
        <button class="sd-see-all" @mousedown.prevent @click="handleGoToShowcaseAll">
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
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 340px;
  background: #fff;
  border: 1px solid #e4ddd5;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(44, 34, 24, 0.12);
  z-index: 1200;
  overflow: hidden;
  font-family: 'Times New Roman', Times, serif;
}

.sd-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 16px;
  font-size: var(--fs-sm);
  color: #9b8b79;
}

.sd-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e4ddd5;
  border-top-color: #8b6f47;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.sd-section {
  padding: 10px 0 4px;
}
.sd-section + .sd-section {
  border-top: 1px solid #f0ebe4;
}

.sd-section-label {
  font-size: var(--fs-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c4a882;
  padding: 0 14px;
  margin: 0 0 6px;
}

.sd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 14px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.sd-item:hover {
  background: #faf7f3;
}

.sd-thumb {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  background: #f0ebe4;
}
.sd-thumb-placeholder {
  background: #ede8e1;
}

.sd-item-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.sd-item-name {
  font-size: var(--fs-sm);
  color: #2c2218;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sd-item-meta {
  font-size: var(--fs-xs);
  color: #9b8b79;
}

.sd-see-all {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 8px 14px 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--fs-xs);
  color: #8b6f47;
  transition: color 0.15s;
  text-align: left;
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
