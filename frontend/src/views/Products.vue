<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { RouterLink, useRouter } from "vue-router";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Check,
} from "@lucide/vue";
import useProducts from "@/hooks/useProducts.js";
import { useCartStore } from "@/stores/cart.js";

const router = useRouter();
const cartStore = useCartStore();

// Tracks per-product feedback: null | 'adding' | 'added'
const addingStates = ref({});

async function addToCart(product) {
  if (!localStorage.getItem("token")) {
    router.push("/login");
    return;
  }
  addingStates.value[product.id] = "adding";
  const ok = await cartStore.addProduct(product);
  addingStates.value[product.id] = ok ? "added" : null;
  if (ok) {
    // Update sold_count display locally so it feels responsive
    product.sold_count = (product.sold_count || 0) + 1;
    setTimeout(() => {
      addingStates.value[product.id] = null;
    }, 1800);
  }
}

const {
  products,
  total,
  totalPages,
  currentPage,
  loading,
  categories,
  selectedCategories,
  selectedTags,
  sortBy,
  searchQuery,
  hasActiveFilters,
  visibleTags,
  visiblePages,
  formatPrice,
  formatMeasurements,
  goToPage,
  toggleCategory,
  toggleTag,
  clearFilters,
} = useProducts();

// filter dropdown state
const openDropdown = ref(null);
const categoryDropdownRef = ref(null);
const tagDropdownRef = ref(null);
const sortDropdownRef = ref(null);

const sortLabels = {
  default: "Default Sorting",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  most_sold: "Most Sold",
};

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name;
};

const handleOutsideClick = (e) => {
  if (!openDropdown.value) return;
  const refMap = {
    category: categoryDropdownRef,
    tag: tagDropdownRef,
    sort: sortDropdownRef,
  };
  const activeRef = refMap[openDropdown.value];
  if (activeRef?.value && !activeRef.value.contains(e.target)) {
    openDropdown.value = null;
  }
};

// add/remove the document listener only while a dropdown is open
watch(openDropdown, (val) => {
  if (val) document.addEventListener("mousedown", handleOutsideClick);
  else document.removeEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>

<template>
  <div class="products-page">
    <!-- ── hero ── -->
    <section
      class="shop-hero position-relative overflow-hidden d-flex align-items-center"
    >
      <img
        src="/product/product-hero.png"
        alt=""
        class="hero-img position-absolute w-100 h-100 object-fit-cover"
      />
      <div class="hero-content position-relative z-1">
        <p class="hero-breadcrumb mb-3">
          <RouterLink to="/">Home</RouterLink>&ensp;&rsaquo;&ensp;Products
        </p>
        <h1 class="hero-title fw-bold mb-3">Our Collection</h1>
        <p class="hero-sub m-0">
          Curated furniture for every room in your home
        </p>
      </div>
    </section>

    <!-- ── filter + sort bar ── -->
    <div
      class="filter-bar d-flex align-items-center justify-content-between position-sticky mt-5"
    >
      <!-- left: dropdowns -->
      <div class="d-flex align-items-center gap-2">
        <span class="filter-label pe-2 text-uppercase">Filter by</span>

        <!-- Category dropdown -->
        <div class="filter-dropdown" ref="categoryDropdownRef">
          <button
            class="filter-btn d-inline-flex align-items-center gap-1 pointer px-3 py-2"
            :class="{ 'is-open': openDropdown === 'category' }"
            @click="toggleDropdown('category')"
          >
            <span class="d-inline-flex align-items-center gap-1">
              <span
                class="active-dot d-inline-block rounded-3 me-2"
                v-if="selectedCategories.length"
              />
              Categories
            </span>
            <ChevronDown :size="13" class="btn-chevron" />
          </button>

          <Transition name="drop">
            <div
              class="filter-panel position-absolute overflow-y-auto left-0"
              v-if="openDropdown === 'category'"
            >
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="panel-item d-flex align-items-center gap-1 px-3 py-2"
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
            class="filter-btn d-inline-flex align-items-center gap-1 pointer px-3 py-2"
            :class="{ 'is-open': openDropdown === 'tag' }"
            @click="toggleDropdown('tag')"
          >
            <span class="d-inline-flex align-items-center gap-1">
              <span
                class="active-dot d-inline-block rounded-3 me-2"
                v-if="selectedTags.length"
              />
              Product Type
            </span>
            <ChevronDown :size="13" class="btn-chevron" />
          </button>

          <Transition name="drop">
            <div
              class="filter-panel position-absolute overflow-y-auto left-0"
              v-if="openDropdown === 'tag'"
            >
              <label
                v-for="tag in visibleTags"
                :key="tag.id"
                class="panel-item d-flex align-items-center gap-1 px-3 py-2"
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
          <button
            v-if="hasActiveFilters"
            class="clear-all-btn border-0 text-decoration-underline px-2"
            @click="clearFilters"
          >
            &times; Clear All
          </button>
        </Transition>
      </div>

      <!-- right: search + count + sort -->
      <div class="filter-right d-flex align-items-center gap-3">
        <div class="position-relative d-flex align-items-center">
          <Search :size="13" class="search-icon position-absolute pe-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products…"
            class="search-input rounded-pill"
          />
        </div>
        <span class="result-count">{{ total }} items</span>

        <!-- custom sort dropdown -->
        <div class="filter-dropdown" ref="sortDropdownRef">
          <button
            class="filter-btn d-inline-flex align-items-center gap-1 pointer px-3 py-2"
            :class="{ 'is-open': openDropdown === 'sort' }"
            @click="toggleDropdown('sort')"
          >
            <span class="d-inline-flex align-items-center gap-1">{{
              sortLabels[sortBy]
            }}</span>
            <ChevronDown :size="13" class="btn-chevron" />
          </button>
          <Transition name="drop">
            <div
              class="filter-panel sort-panel position-absolute overflow-y-auto left-0"
              v-if="openDropdown === 'sort'"
            >
              <button
                v-for="(label, val) in sortLabels"
                :key="val"
                class="panel-item sort-option d-flex align-items-center gap-1 px-3 py-2 border-0 w-100 text-start"
                :class="{ 'sort-active fw-bold': sortBy === val }"
                @click="
                  sortBy = val;
                  openDropdown = null;
                "
              >
                {{ label }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- products -->
    <div class="products-container">
      <div v-if="loading" class="state-msg">Loading products…</div>

      <div v-else-if="products.length === 0" class="state-msg">
        No products found. Try adjusting your filters.
      </div>

      <div v-else class="product-grid d-grid gap-4 mb-5">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card overflow-hidden"
        >
          <!-- image with hover swap -->
          <router-link
            :to="`/products/${product.id}`"
            class="card-img-wrapper position-relative d-block overflow-hidden"
          >
            <img
              :src="product.images[0]"
              :alt="product.name"
              class="img-primary position-absolute inset-0 w-100 h-100 object-fit-cover"
            />
            <img
              :src="product.images[1] ?? product.images[0]"
              :alt="product.name"
              class="img-secondary position-absolute inset-0 w-100 h-100 object-fit-cover"
            />
          </router-link>

          <!-- card info -->
          <div class="card-body">
            <div
              class="card-meta d-flex align-items-center justify-content-between mb-4"
            >
              <span class="card-category-badge text-uppercase">{{
                product.category
              }}</span>
              <span class="card-sold">{{ product.sold_count }} sold</span>
            </div>
            <h3 class="card-name fw-bold mb-2 overflow-hidden">
              {{ product.name }}
            </h3>
            <p class="card-measurements" v-if="formatMeasurements(product)">
              {{ formatMeasurements(product) }}
            </p>
            <div
              class="card-price-row d-flex align-items-center justify-content-between mt-3"
            >
              <span class="card-price fw-bold">{{
                formatPrice(product.base_price)
              }}</span>
              <button
                class="card-add-btn border-0 px-2 py-2"
                :class="{ 'btn-added': addingStates[product.id] === 'added' }"
                :disabled="addingStates[product.id] === 'adding'"
                @click.prevent="addToCart(product)"
              >
                <Check
                  v-if="addingStates[product.id] === 'added'"
                  size="14"
                  class="me-1"
                />
                <Plus
                  v-else
                  size="14"
                  class="me-1 justify-content-center text-center"
                />
                {{
                  addingStates[product.id] === "adding"
                    ? "Adding…"
                    : addingStates[product.id] === "added"
                      ? "Added"
                      : "Add to Cart"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- pagination -->
      <nav
        class="pagination-wrap"
        v-if="totalPages > 1"
        aria-label="Products pagination"
      >
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
          >
            {{ p }}
          </button>
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
@import "@/styles/main.css";

.products-page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* ── hero ── */
.shop-hero {
  height: 400px;
  background: #f0ebe2;
}
.hero-img {
  inset: 0;
  object-position: right center;
}
.shop-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(30, 26, 20, 0.8) 0%,
    rgba(30, 26, 20, 0) 70%
  );
  pointer-events: none;
  z-index: 0;
}
.hero-content {
  padding: 0 5rem;
}
.hero-breadcrumb {
  font-size: 0.78rem;
  color: #f0e1cc;
  letter-spacing: 0.04em;
}
.hero-breadcrumb a {
  color: #f0e1cc;
  text-decoration: none;
  transition: color 0.2s;
}
.hero-breadcrumb a:hover {
  color: #dbbea0;
}
.hero-title {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #f0e1cc;
  line-height: 1.1;
}
.hero-sub {
  font-size: 0.85rem;
  color: #f0e1cc;
  letter-spacing: 0.04em;
  max-width: 320px;
}
/* ── filter bar ── */
.filter-bar {
  padding: 0.7rem 5rem;
  z-index: 90;
}
.filter-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--color-secondary);
}
.result-count {
  font-size: 0.8rem;
  color: var(--color-secondary);
  white-space: nowrap;
}
/* ── search bar ── */
.search-icon {
  left: 0.6rem;
  color: var(--color-muted);
  flex-shrink: 0;
}
.search-input {
  border: 1px solid var(--border-input);
  padding: 0.35rem 0.8rem 0.35rem 2rem;
  font-family: var(--font-serif);
  font-size: 0.78rem;
  color: var(--color-primary);
  background: transparent;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: var(--accent-hover);
}
.search-input::placeholder {
  color: var(--color-muted);
}

/* ── filter dropdown trigger ── */
.filter-dropdown {
  position: relative;
}
.filter-btn {
  background: transparent;
  border: 1px solid var(--border-input);
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s;
  white-space: nowrap;
}
.filter-btn:hover {
  border-color: var(--accent-hover);
}
.filter-btn.is-open {
  background: var(--btn-bg);
  border-color: var(--btn-bg);
  color: var(--btn-color);
}
.active-dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  flex-shrink: 0;
}
.filter-btn.is-open .active-dot {
  background: rgba(255, 255, 255, 0.8);
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
  top: calc(100% + 5px);
  min-width: 190px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: 0 10px 30px rgba(30, 26, 20, 0.1);
  z-index: 200;
  max-height: 290px;
}
.panel-item {
  font-size: 0.83rem;
  color: var(--color-primary);
  transition: background 0.15s;
  cursor: pointer;
}
.panel-item:hover {
  background: var(--bg-elevated);
}
.sort-panel {
  right: 0;
  left: auto;
}
.sort-option {
  background: none;
  font-family: var(--font-serif);
}
.sort-active {
  color: var(--color-primary);
}
.panel-checkbox {
  accent-color: var(--accent);
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
}
.clear-all-btn {
  background: transparent;
  color: var(--color-secondary);
  font-family: var(--font-serif);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.clear-all-btn:hover {
  color: var(--color-primary);
}

/* ── dropdown slide-down animation ── */
.drop-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.drop-leave-active {
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
}
.drop-enter-from {
  opacity: 0;
  transform: translateY(-7px);
}
.drop-leave-to {
  opacity: 0;
  transform: translateY(-7px);
}

/* ── fade for clear-all button ── */
.fade-enter-active {
  transition: opacity 0.18s;
}
.fade-leave-active {
  transition: opacity 0.12s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── products area ── */
.products-container {
  padding: 2rem 5rem 4rem;
}

/* ── product grid ── */
.product-grid {
  grid-template-columns: repeat(4, 1fr);
}

/* ── product card ── */
.product-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  transition: box-shadow 0.3s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(30, 26, 20, 0.1);
}

.card-img-wrapper {
  aspect-ratio: 4 / 3;
}
.img-primary,
.img-secondary {
  transition: opacity 0.4s ease;
}
.img-secondary {
  opacity: 0;
}
.product-card:hover .img-primary {
  opacity: 0;
}
.product-card:hover .img-secondary {
  opacity: 1;
}

.card-body {
  padding: 0.85rem;
}
.card-category-badge { font-size: 0.6rem; letter-spacing: 0.12em; background: var(--accent); color: #fff; padding: 0.15rem 0.5rem; }
.card-sold { font-size: 0.68rem; color: var(--color-secondary); }
.card-name { font-size: 0.88rem; color: var(--color-primary); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; }
.card-measurements { font-size: 0.7rem; color: var(--color-secondary); }
.card-price { font-size: 0.95rem; color: var(--color-primary); }
.card-add-btn { background: var(--btn-bg); color: var(--btn-color); font-family: var(--font-serif); font-size: 0.7rem; letter-spacing: 0.06em; cursor: pointer; white-space: nowrap; transition: background 0.2s; flex-shrink: 0; }
.card-add-btn:hover:not(:disabled) { background: var(--btn-bg-hover); }
.card-add-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.card-add-btn.btn-added { background: var(--color-success); }

/* ── loading / empty ── */
.state-msg { text-align: center; padding: 5rem 2rem; color: var(--color-secondary); font-size: 0.95rem; }

/* ── pagination ── */
.pagination-wrap { display: flex; justify-content: center; align-items: center; gap: 0.3rem; padding-top: 1.5rem; }
.page-btn { min-width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; background: var(--bg-surface); border: 1px solid var(--border); color: var(--color-primary); font-family: var(--font-serif); font-size: 0.85rem; cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s; }
.page-btn:hover:not(:disabled) { border-color: var(--color-primary); }
.page-btn.page-active { background: var(--btn-bg); color: var(--btn-color); border-color: var(--btn-bg); }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-ellipsis { color: var(--color-secondary); padding: 0 0.25rem; }

/* ── responsive ── */
@media (max-width: 1199px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 991px) {
  .filter-bar {
    padding: 0.7rem 2.5rem;
  }
  .products-container {
    padding: 2rem 2.5rem 4rem;
  }
  .hero-content {
    padding: 0 2.5rem;
  }
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 767px) {
  .filter-bar {
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0.7rem 1.25rem;
  }
  .filter-right {
    width: 100%;
    justify-content: space-between;
  }
  .products-container {
    padding: 1.5rem 1.25rem 3rem;
  }
  .hero-content {
    padding: 0 1.5rem;
  }
  .shop-hero {
    height: 220px;
  }
}
@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
