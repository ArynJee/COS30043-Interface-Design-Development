<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronLeft, ChevronRight, ChevronDown } from '@lucide/vue'
import useProducts from '@/hooks/useProducts.js'

const {
  products, total, totalPages, currentPage, loading,
  categories, selectedCategories, selectedTags, sortBy,
  hasActiveFilters, visibleTags, visiblePages,
  formatPrice, formatMeasurements,
  goToPage, toggleCategory, toggleTag, clearFilters,
} = useProducts()

// filter dropdown state
const openDropdown = ref(null)
const categoryDropdownRef = ref(null)
const tagDropdownRef      = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const handleOutsideClick = (e) => {
  if (!openDropdown.value) return
  // only check the wrapper of the dropdown that is currently open
  const activeRef = openDropdown.value === 'category' ? categoryDropdownRef : tagDropdownRef
  if (activeRef.value && !activeRef.value.contains(e.target)) {
    openDropdown.value = null
  }
}

// add/remove the document listener only while a dropdown is open
watch(openDropdown, (val) => {
  if (val) document.addEventListener('mousedown', handleOutsideClick)
  else document.removeEventListener('mousedown', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <div class="products-page">

    <!-- ── hero ── -->
    <section class="shop-hero">
      <img src="/product/product-hero.png" alt="" class="hero-img" />
      <div class="hero-content">
        <p class="hero-breadcrumb">
          <RouterLink to="/">Home</RouterLink>&ensp;&rsaquo;&ensp;Products
        </p>
        <h1 class="hero-title">Our Collection</h1>
        <p class="hero-sub">Curated furniture for every room in your home</p>
      </div>
    </section>

    <!-- ── filter + sort bar ── -->
    <div class="filter-bar">

      <!-- left: dropdowns -->
      <div class="filter-left">
        <span class="filter-label">Filter by</span>

        <!-- Category dropdown -->
        <div class="filter-dropdown" ref="categoryDropdownRef">
          <button
            class="filter-btn"
            :class="{ 'is-open': openDropdown === 'category' }"
            @click="toggleDropdown('category')"
          >
            <span class="btn-label">
              <span class="active-dot" v-if="selectedCategories.length" />
              Categories
            </span>
            <ChevronDown :size="13" class="btn-chevron" />
          </button>

          <Transition name="drop">
            <div class="filter-panel" v-if="openDropdown === 'category'">
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="panel-item"
              >
                <input
                  type="checkbox"
                  class="panel-checkbox"
                  :checked="selectedCategories.includes(cat.id)"
                  @change="toggleCategory(cat.id)"
                />
                <span>{{ cat.name }}</span>
              </label>
            </div>
          </Transition>
        </div>

        <!-- Product Type dropdown -->
        <div class="filter-dropdown" ref="tagDropdownRef">
          <button
            class="filter-btn"
            :class="{ 'is-open': openDropdown === 'tag' }"
            @click="toggleDropdown('tag')"
          >
            <span class="btn-label">
              <span class="active-dot" v-if="selectedTags.length" />
              Product Type
            </span>
            <ChevronDown :size="13" class="btn-chevron" />
          </button>

          <Transition name="drop">
            <div class="filter-panel" v-if="openDropdown === 'tag'">
              <label
                v-for="tag in visibleTags"
                :key="tag.id"
                class="panel-item"
              >
                <input
                  type="checkbox"
                  class="panel-checkbox"
                  :checked="selectedTags.includes(tag.id)"
                  @change="toggleTag(tag.id)"
                />
                <span>{{ tag.name }}</span>
              </label>
            </div>
          </Transition>
        </div>

        <!-- inline clear all — appears only when filters are active -->
        <Transition name="fade">
          <button v-if="hasActiveFilters" class="clear-all-btn" @click="clearFilters">
            &times; Clear All
          </button>
        </Transition>
      </div>

      <!-- right: count + sort -->
      <div class="filter-right">
        <span class="result-count">{{ total }} items</span>
        <select class="sort-select" v-model="sortBy">
          <option value="default">Default Sorting</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="most_sold">Most Sold</option>
        </select>
      </div>
    </div>

    <!-- ── products ── -->
    <div class="products-container">

      <div v-if="loading" class="state-msg">Loading products…</div>

      <div v-else-if="products.length === 0" class="state-msg">
        No products found. Try adjusting your filters.
      </div>

      <div v-else class="product-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <!-- image with hover swap -->
          <router-link :to="`/products/${product.id}`" class="card-img-wrapper">
            <img :src="product.images[0]" :alt="product.name" class="img-primary" />
            <img
              :src="product.images[1] ?? product.images[0]"
              :alt="product.name"
              class="img-secondary"
            />
          </router-link>

          <!-- card info -->
          <div class="card-body">
            <div class="card-meta">
              <span class="card-category-badge">{{ product.category }}</span>
              <span class="card-sold">{{ product.sold_count }} sold</span>
            </div>
            <h3 class="card-name">{{ product.name }}</h3>
            <p class="card-measurements" v-if="formatMeasurements(product)">
              {{ formatMeasurements(product) }}
            </p>
            <span class="card-price">{{ formatPrice(product.base_price) }}</span>
          </div>
        </div>
      </div>

      <!-- pagination -->
      <nav class="pagination-wrap" v-if="totalPages > 1" aria-label="Products pagination">
        <button
          class="page-btn page-arrow"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          aria-label="Previous page"
        >
          <ChevronLeft :size="15" />
        </button>

        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '…'" class="page-ellipsis">…</span>
          <button
            v-else
            :class="['page-btn', { 'page-active': currentPage === p }]"
            @click="goToPage(p)"
          >{{ p }}</button>
        </template>

        <button
          class="page-btn page-arrow"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          aria-label="Next page"
        >
          <ChevronRight :size="15" />
        </button>
      </nav>
    </div>

  </div>
</template>

<style scoped>
.products-page {
  font-family: 'Times New Roman', Times, serif;
  background: #faf7f2;
  min-height: 100vh;
}

/* ── hero ── */
.shop-hero {
  position: relative;
  height: 300px;
  background: #f0ebe2;   /* warm fallback while image loads */
  overflow: hidden;
  display: flex;
  align-items: center;
}
.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;  /* keep visual content on the right */
}
.shop-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(30, 26, 20, 0.6) 0%, rgba(30, 26, 20, 0) 65%);
  pointer-events: none;
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
  padding: 0 5rem;
}
.hero-breadcrumb {
  font-size: 0.78rem;
  color: #2c2218;
  margin-bottom: 0.9rem;
  letter-spacing: 0.04em;
}
.hero-breadcrumb a {
  color: #2c2218;
  text-decoration: none;
  transition: color 0.2s;
}
.hero-breadcrumb a:hover { color: #2c2218; }
.hero-title {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 700;
  color: #2c2218;
  line-height: 1.1;
  margin-bottom: 0.55rem;
}
.hero-sub {
  font-size: 0.88rem;
  color: #2c2218;
  letter-spacing: 0.04em;
  margin: 0;
  max-width: 320px;
}

/* ── filter bar ── */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 5rem;
  background: #fff;
  border-bottom: 1px solid #e0d5c5;
  position: sticky;
  top: 0;       /* adjust to match your navbar height if they overlap */
  z-index: 90;  /* stay below Bootstrap's sticky navbar (z-index 1020) */
}
.filter-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.filter-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7a6a58;
  padding-right: 0.35rem;
}
.filter-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.result-count {
  font-size: 0.8rem;
  color: #7a6a58;
  white-space: nowrap;
}
.sort-select {
  background: transparent;
  border: 1px solid #d0c5b5;
  color: #2c2218;
  font-family: 'Times New Roman', serif;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  padding: 0.38rem 0.7rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.sort-select:hover { border-color: #c4a882; }

/* ── filter dropdown trigger ── */
.filter-dropdown {
  position: relative;
}
.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: transparent;
  border: 1px solid #d0c5b5;
  color: #2c2218;
  font-family: 'Times New Roman', serif;
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  padding: 0.38rem 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  white-space: nowrap;
}
.filter-btn:hover {
  border-color: #b09070;
}
.filter-btn.is-open {
  background: #2c2218;
  border-color: #2c2218;
  color: #fff;
}

.btn-label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* dot indicator — shows when that filter has active selections */
.active-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 0.25rem;
  background: #c4a882;
  flex-shrink: 0;
}
.filter-btn.is-open .active-dot {
  background: rgba(255,255,255,0.8);
}

/* chevron rotates 180° when open */
.btn-chevron {
  transition: transform 0.22s ease;
  flex-shrink: 0;
  opacity: 0.7;
}
.filter-btn.is-open .btn-chevron {
  transform: rotate(180deg);
  opacity: 1;
}

/* ── dropdown panel ── */
.filter-panel {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  min-width: 190px;
  background: #fff;
  border: 1px solid #e0d5c5;
  box-shadow: 0 10px 30px rgba(30, 26, 20, 0.1);
  z-index: 200;
  max-height: 290px;
  overflow-y: auto;
  padding: 0.4rem 0;
}
.panel-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.48rem 1rem;
  font-size: 0.83rem;
  color: #2c2218;
  cursor: pointer;
  transition: background 0.15s;
}
.panel-item:hover { background: #faf7f2; }
.panel-checkbox {
  accent-color: #c4a882;
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

/* ── clear all ── */
.clear-all-btn {
  background: transparent;
  border: none;
  color: #7a6a58;
  font-family: 'Times New Roman', serif;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  padding: 0.38rem 0.5rem;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.clear-all-btn:hover { color: #2c2218; }

/* ── dropdown slide-down animation ── */
.drop-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.drop-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.drop-enter-from  { opacity: 0; transform: translateY(-7px); }
.drop-leave-to    { opacity: 0; transform: translateY(-7px); }

/* ── fade for clear-all button ── */
.fade-enter-active { transition: opacity 0.18s; }
.fade-leave-active { transition: opacity 0.12s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── products area ── */
.products-container {
  padding: 2rem 5rem 4rem;
}

/* ── product grid ── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.15rem;
  margin-bottom: 2.5rem;
}

/* ── product card ── */
.product-card {
  background: #fff;
  border: 1px solid #e0d5c5;
  overflow: hidden;
  transition: box-shadow 0.3s;
}
.product-card:hover { box-shadow: 0 6px 24px rgba(30, 26, 20, 0.1); }

.card-img-wrapper {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}
.img-primary,
.img-secondary {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.45s ease;
}
.img-secondary { opacity: 0; }
.product-card:hover .img-primary  { opacity: 0; }
.product-card:hover .img-secondary { opacity: 1; }

.card-body { padding: 0.85rem; }
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
}
.card-category-badge {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: #c4a882;
  color: #fff;
  padding: 0.15rem 0.5rem;
}
.card-sold { font-size: 0.68rem; color: #7a6a58; }
.card-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #2c2218;
  line-height: 1.35;
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-measurements { font-size: 0.7rem; color: #7a6a58; margin-bottom: 0.55rem; }
.card-price { font-size: 0.95rem; font-weight: 700; color: #2c2218; }

/* ── loading / empty ── */
.state-msg { text-align: center; padding: 5rem 2rem; color: #7a6a58; font-size: 0.95rem; }

/* ── pagination ── */
.pagination-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  padding-top: 1.5rem;
}
.page-btn {
  min-width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e0d5c5;
  color: #2c2218;
  font-family: 'Times New Roman', serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.page-btn:hover:not(:disabled) { border-color: #2c2218; }
.page-btn.page-active {
  background: #2c2218;
  color: #fff;
  border-color: #2c2218;
}
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-ellipsis { color: #7a6a58; padding: 0 0.25rem; }

/* ── responsive ── */
@media (max-width: 1199px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 991px) {
  .filter-bar         { padding: 0.7rem 2.5rem; }
  .products-container { padding: 2rem 2.5rem 4rem; }
  .hero-content       { padding: 0 2.5rem; }
  .product-grid       { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767px) {
  .filter-bar         { flex-wrap: wrap; gap: 0.6rem; padding: 0.7rem 1.25rem; }
  .filter-right       { width: 100%; justify-content: space-between; }
  .products-container { padding: 1.5rem 1.25rem 3rem; }
  .hero-content       { padding: 0 1.5rem; }
  .shop-hero          { height: 220px; }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: 1fr; }
}
</style>
