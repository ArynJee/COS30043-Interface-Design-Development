<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from '@lucide/vue'
import { getProductsApi, getFiltersApi } from '@/services/productServices.js'

const route = useRoute()

// ── data ──────────────────────────────────────────────
const products   = ref([])
const total      = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const loading    = ref(false)

const categories         = ref([])
const tags               = ref([])
const selectedCategories = ref([])
const selectedTags       = ref([])
const sortBy             = ref('default')
const sidebarOpen        = ref(true)

// ── slug → category name (from home page links) ───────
const slugToName = {
  'living-room': 'Living Room',
  'study-room':  'Study Room',
  'kitchen':     'Kitchen',
  'bathroom':    'Bathroom',
  'bedroom':     'Bedroom',
}

// ── computed ──────────────────────────────────────────
const hasActiveFilters = computed(
  () => selectedCategories.value.length > 0 || selectedTags.value.length > 0
)

// show only tags that belong to currently selected categories (or all if none selected)
const visibleTags = computed(() => {
  if (selectedCategories.value.length === 0) return tags.value
  return tags.value.filter(t => selectedCategories.value.includes(t.category_id))
})

const visiblePages = computed(() => {
  const tp = totalPages.value
  const cur = currentPage.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('…')
  for (let i = Math.max(2, cur - 1); i <= Math.min(tp - 1, cur + 1); i++) pages.push(i)
  if (cur < tp - 2) pages.push('…')
  pages.push(tp)
  return pages
})

// ── helpers ───────────────────────────────────────────
const formatPrice = (price) =>
  'RM ' + parseFloat(price).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatMeasurements = (p) => {
  const h = p.height_cm != null ? Math.round(p.height_cm) : null
  const w = p.width_cm  != null ? Math.round(p.width_cm)  : null
  const d = p.depth_cm  != null ? Math.round(p.depth_cm)  : null
  if (!h || !w) return null
  return d ? `${h}H × ${w}W × ${d}D cm` : `${h}H × ${w}W cm`
}

// ── fetch ─────────────────────────────────────────────
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: 12, sort: sortBy.value }
    if (selectedCategories.value.length) params.category_ids = selectedCategories.value.join(',')
    if (selectedTags.value.length)       params.tag_ids      = selectedTags.value.join(',')

    const data = await getProductsApi(params)
    products.value   = data.products
    total.value      = data.total
    totalPages.value = data.totalPages
  } finally {
    loading.value = false
  }
}

// reset page + fetch when filters/sort change
watch([selectedCategories, selectedTags, sortBy], () => {
  currentPage.value = 1
  fetchProducts()
}, { deep: true })

// deselect tags that no longer belong to selected categories
watch(selectedCategories, (cats) => {
  if (cats.length > 0) {
    selectedTags.value = selectedTags.value.filter(id => {
      const tag = tags.value.find(t => t.id === id)
      return tag && cats.includes(tag.category_id)
    })
  }
})

// ── actions ───────────────────────────────────────────
const goToPage = (p) => {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleCategory = (id) => {
  const i = selectedCategories.value.indexOf(id)
  selectedCategories.value = i === -1
    ? [...selectedCategories.value, id]
    : selectedCategories.value.filter(c => c !== id)
}

const toggleTag = (id) => {
  const i = selectedTags.value.indexOf(id)
  selectedTags.value = i === -1
    ? [...selectedTags.value, id]
    : selectedTags.value.filter(t => t !== id)
}

const clearFilters = () => {
  selectedCategories.value = []
  selectedTags.value = []
}

// ── init ──────────────────────────────────────────────
onMounted(async () => {
  const filterData = await getFiltersApi()
  categories.value = filterData.categories
  tags.value       = filterData.tags

  // pre-select category from home page ?type= param
  const slug = route.query.type
  if (slug && slugToName[slug]) {
    const cat = categories.value.find(c => c.name === slugToName[slug])
    if (cat) selectedCategories.value = [cat.id]
  }

  await fetchProducts()
})
</script>

<template>
  <div class="products-page">

    <!-- page header -->
    <div class="page-header">
      <h1 class="page-title">Our Collection</h1>
      <p class="page-sub">Curated furniture for every room in your home</p>
    </div>

    <!-- controls bar -->
    <div class="controls-bar">
      <button class="ctrl-btn" @click="sidebarOpen = !sidebarOpen">
        <SlidersHorizontal :size="14" class="me-2" />
        {{ sidebarOpen ? 'Hide Filters' : 'Show Filters' }}
      </button>

      <div class="ctrl-right">
        <span class="result-count">{{ total }} items</span>
        <select class="sort-select" v-model="sortBy">
          <option value="default">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="most_sold">Most Sold</option>
        </select>
      </div>
    </div>

    <!-- main layout -->
    <div class="layout-wrapper" :class="{ 'sidebar-hidden': !sidebarOpen }">

      <!-- sidebar -->
      <aside class="sidebar">
        <div class="sidebar-inner">
          <!-- clear filter -->
          <button class="clear-btn" :disabled="!hasActiveFilters" @click="clearFilters">
            <X :size="12" class="me-1" /> Clear Filters
          </button>

          <!-- category filter -->
          <div class="filter-section">
            <h6 class="filter-heading">Category</h6>
            <label
              v-for="cat in categories"
              :key="cat.id"
              class="filter-label"
            >
              <input
                type="checkbox"
                class="filter-checkbox"
                :checked="selectedCategories.includes(cat.id)"
                @change="toggleCategory(cat.id)"
              />
              <span>{{ cat.name }}</span>
            </label>
          </div>

          <!-- product type / tag filter -->
          <div class="filter-section" v-if="visibleTags.length">
            <h6 class="filter-heading">Product Type</h6>
            <label
              v-for="tag in visibleTags"
              :key="tag.id"
              class="filter-label"
            >
              <input
                type="checkbox"
                class="filter-checkbox"
                :checked="selectedTags.includes(tag.id)"
                @change="toggleTag(tag.id)"
              />
              <span>{{ tag.name }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- products area -->
      <div class="products-area">

        <!-- loading -->
        <div v-if="loading" class="state-msg">Loading products…</div>

        <!-- empty -->
        <div v-else-if="products.length === 0" class="state-msg">
          No products found. Try adjusting your filters.
        </div>

        <!-- grid -->
        <div v-else class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <!-- image with hover swap -->
            <router-link :to="`/products/${product.id}`" class="card-img-wrapper">
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="img-primary"
              />
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
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            aria-label="Previous page"
          >
            <ChevronLeft :size="14" />
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
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            aria-label="Next page"
          >
            <ChevronRight :size="14" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  font-family: 'Times New Roman', Times, serif;
  background: #faf7f2;
  min-height: 100vh;
}

/* ── page header ── */
.page-header {
  background: #1e1a14;
  color: #fff;
  text-align: center;
  padding: 3.5rem 1rem 3rem;
}
.page-title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 0.4rem;
}
.page-sub {
  font-size: 0.88rem;
  letter-spacing: 0.1em;
  opacity: 0.65;
  margin: 0;
}

/* ── controls bar ── */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e0d5c5;
  position: sticky;
  top: 0;         /* sticks below the navbar (which is also sticky) */
  z-index: 50;
}
.ctrl-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.ctrl-btn {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid #2c2218;
  color: #2c2218;
  font-family: 'Times New Roman', serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.45rem 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.ctrl-btn:hover {
  background: #1e1a14;
  color: #fff;
}
.result-count {
  font-size: 0.8rem;
  color: #7a6a58;
}
.sort-select {
  background: transparent;
  border: 1px solid #2c2218;
  color: #2c2218;
  font-family: 'Times New Roman', serif;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
}

/* ── layout ── */
.layout-wrapper {
  display: flex;
  gap: 0;
  align-items: flex-start;
  padding: 1.5rem 2rem 3rem;
}

/* ── sidebar ── */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: #fff;
  border: 1px solid #e0d5c5;
  margin-right: 1.5rem;
  flex-shrink: 0;
  transition: width 0.3s ease, min-width 0.3s ease, margin 0.3s ease, opacity 0.25s ease;
  overflow: hidden;
}
.layout-wrapper.sidebar-hidden .sidebar {
  width: 0;
  min-width: 0;
  margin-right: 0;
  opacity: 0;
  border: none;
}
.sidebar-inner {
  padding: 1.25rem;
  min-width: 210px;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: transparent;
  border: 1px solid #e0d5c5;
  color: #7a6a58;
  font-family: 'Times New Roman', serif;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.45rem 1rem;
  cursor: pointer;
  margin-bottom: 1.25rem;
  transition: border-color 0.2s, color 0.2s;
}
.clear-btn:not(:disabled):hover {
  border-color: #2c2218;
  color: #2c2218;
}
.clear-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.filter-section {
  margin-bottom: 1.25rem;
}
.filter-section + .filter-section {
  border-top: 1px solid #e0d5c5;
  padding-top: 1.1rem;
}
.filter-heading {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2c2218;
  font-weight: 700;
  margin-bottom: 0.75rem;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.83rem;
  color: #2c2218;
  cursor: pointer;
  padding: 0.22rem 0;
  transition: color 0.2s;
}
.filter-label:hover { color: #c4a882; }
.filter-checkbox {
  accent-color: #c4a882;
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

/* ── products area ── */
.products-area { flex: 1; min-width: 0; }

.state-msg {
  text-align: center;
  padding: 5rem 2rem;
  color: #7a6a58;
  font-size: 0.95rem;
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
.product-card:hover {
  box-shadow: 0 6px 24px rgba(30, 26, 20, 0.1);
}

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
.card-sold {
  font-size: 0.68rem;
  color: #7a6a58;
}
.card-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #2c2218;
  line-height: 1.35;
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-measurements {
  font-size: 0.7rem;
  color: #7a6a58;
  letter-spacing: 0.03em;
  margin-bottom: 0.55rem;
}
.card-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2c2218;
}

/* ── pagination ── */
.pagination-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  padding-top: 1rem;
}
.page-btn {
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e0d5c5;
  color: #2c2218;
  font-family: 'Times New Roman', serif;
  font-size: 0.83rem;
  cursor: pointer;
  padding: 0 0.4rem;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.page-btn:hover:not(:disabled) {
  background: #1e1a14;
  color: #fff;
  border-color: #1e1a14;
}
.page-btn.page-active {
  background: #1e1a14;
  color: #fff;
  border-color: #1e1a14;
}
.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.page-ellipsis {
  color: #7a6a58;
  padding: 0 0.2rem;
  font-size: 0.85rem;
}

/* ── responsive ── */
@media (max-width: 1199px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 991px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .sidebar {
    width: 200px;
    min-width: 200px;
  }
}
@media (max-width: 767px) {
  .layout-wrapper { flex-direction: column; padding: 1rem; }
  .sidebar {
    width: 100% !important;
    min-width: 100% !important;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .layout-wrapper.sidebar-hidden .sidebar {
    display: none;
  }
  .controls-bar { padding: 0.75rem 1rem; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: 1fr; }
}
</style>
