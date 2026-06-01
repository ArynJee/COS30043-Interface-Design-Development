<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MapPin, ShoppingCart, UserCircle, Search, ShoppingBag, LayoutGrid, Sliders, Info, ChevronLeft, ChevronRight, Sun, Moon, ArrowRight, X } from '@lucide/vue'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useCartStore } from '@/stores/cart'
import { useSearch } from '@/hooks/useSearch.js'
import SearchDropdown from '@/components/SearchDropdown.vue'

const cartStore = useCartStore()
onMounted(() => cartStore.fetchCart())

const { isDark, toggleDark } = useDarkMode()
const isAnimating = ref(false)

function handleToggle() {
  if (isAnimating.value) return
  isAnimating.value = true
  toggleDark()
  setTimeout(() => { isAnimating.value = false }, 360)
}

const navLinks = [
  { name: 'Products', path: '/products', icon: ShoppingBag },
  { name: 'Showcase', path: '/showcase', icon: LayoutGrid },
  { name: 'Customize', path: '/customize', icon: Sliders },
]

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const profileRoute = computed(() => isLoggedIn.value ? '/profile' : '/login')
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const searchQuery = ref('')
const searchFocused = ref(false)
const showDropdown = computed(() => searchFocused.value && searchQuery.value.length >= 2)

function onSearchFocus() { searchFocused.value = true }
function onSearchBlur() { setTimeout(() => { searchFocused.value = false }, 150) }
function onSearchEnter() {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/products', query: { search: searchQuery.value.trim() } })
  searchFocused.value = false
}
function onSearchEscape() {
  searchQuery.value = ''
  searchFocused.value = false
}
function closeSearch() {
  searchQuery.value = ''
  searchFocused.value = false
}

// mobile sidebar search
const mobileSearchRef = ref(null)
const {
  query: sbQuery,
  products: sbProducts,
  showcaseResults: sbShowcase,
  branchResults: sbBranches,
  loading: sbLoading,
  hasSearched: sbHasSearched,
  hasResults: sbHasResults,
  formatPrice,
  goToProducts: sbGoToProducts,
  goToShowcase: sbGoToShowcase,
  goToShowcaseAll: sbGoToShowcaseAll,
  goToBranch: sbGoToBranch,
} = useSearch()

watch(searchQuery, (q) => { sbQuery.value = q })
watch(sidebarOpen, (open) => { if (!open) closeSearch() })
const sbShowResults = computed(() => sidebarOpen.value && searchQuery.value.length >= 2)

async function openSidebarSearch() {
  sidebarOpen.value = true
  await nextTick()
  mobileSearchRef.value?.focus()
}
function sbHandleGoToProducts() { sbGoToProducts(); sidebarOpen.value = false }
function sbHandleGoToShowcase(id) { sbGoToShowcase(id); sidebarOpen.value = false }
function sbHandleGoToShowcaseAll() { sbGoToShowcaseAll(); sidebarOpen.value = false }
function sbHandleGoToBranch() { sbGoToBranch(); sidebarOpen.value = false }
</script>

<template>
  <!-- desktop view -->
  <nav class="top-navbar d-none d-lg-flex">
    <div class="container-fluid px-5 d-flex align-items-center h-100">
      <!-- Logo -->
      <router-link to="/" class="brand fw-bold text-uppercase text-decoration-none">ComfyHome</router-link>

      <!-- Nav links: directly after logo -->
      <ul class="nav-links">
        <li v-for="link in navLinks" :key="link.name">
          <router-link
            :to="link.path"
            class="nav-item"
            :class="{ 'is-active': route.path.startsWith(link.path) }"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <!-- right -->
      <div class="utility-icons d-flex align-items-center gap-3 ms-auto">
        <!-- search bar left of location -->
        <div class="search-wrap">
          <label class="search-pill d-flex align-items-center gap-2 px-2 py-1 rounded-pill mt-2">
            <Search :size="14" class="search-icon-inner" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search…"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
              @keydown.enter="onSearchEnter"
              @keydown.escape="onSearchEscape"
            />
          </label>
          <SearchDropdown v-if="showDropdown" :query="searchQuery" @close="closeSearch" />
        </div>

        <router-link title="Locations" to="/locations" class="icon-btn">
          <MapPin :size="19" />
        </router-link>

        <router-link title="Cart" to="/cart" class="icon-btn cart-icon-btn">
          <ShoppingCart :size="19" />
          <span v-if="cartStore.itemCount > 0" class="cart-badge">{{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}</span>
        </router-link>

        <router-link title="Profile" :to="profileRoute" class="icon-btn">
          <UserCircle :size="21" />
        </router-link>

        <button class="icon-btn theme-toggle" :class="{ 'is-spinning': isAnimating }" @click="handleToggle" :title="isDark ? 'Light mode' : 'Dark mode'">
          <Moon v-if="isDark" :size="19" />
          <Sun v-else :size="19" />
        </button>
      </div>
    </div>
  </nav>

  <!-- mobile sidebar -->
  <aside class="mobile-sidebar d-lg-none top-0 left-0 position-fixed d-flex flex-column overflow-hidden" :class="{ 'is-open': sidebarOpen }">

    <!-- toggle to open -->
    <div class="sb-header justify-content-between align-items-center d-flex">
      <router-link to="/" class="sb-brand d-flex align-items-center text-decoration-none overflow-hidden">
        <span class="sb-brand-label fw-bold text-uppercase">ComfyHome</span>
      </router-link>
      <button class="sb-toggle d-flex align-items-center justify-content-center rounded-2" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle sidebar">
        <ChevronLeft v-if="sidebarOpen" :size="16" />
        <ChevronRight v-else :size="16" />
      </button>
    </div>

    <!-- search icon trigger (collapsed state only) -->
    <button class="sb-search-trigger position-relative d-flex align-items-center justify-content-center rounded-2 mx-auto my-2" @click="openSidebarSearch" title="Search">
      <Search :size="19" class="sb-icon" />
      <span class="sb-tooltip">Search</span>
    </button>

    <!-- expanded search bar (open state) -->
    <div class="sb-search d-flex align-items-center gap-2 rounded-pill overflow-hidden">
      <Search :size="14" class="sb-search-icon" />
      <input ref="mobileSearchRef" v-model="searchQuery" type="text" placeholder="Search…" class="sb-search-input border-0 w-100" @keydown.enter="onSearchEnter" @keydown.escape="onSearchEscape" />
    </div>

    <!-- Nav links -->
    <nav class="sb-nav d-flex flex-column gap-1 overflow-y-auto px-2 py-3">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 my-1 overflow-hidden text-decoration-none"
        :class="{ 'is-active': route.path.startsWith(link.path) }"
      >
        <component :is="link.icon" :size="19" class="sb-icon" />
        <span class="sb-label pe-none">{{ link.name }}</span>
        <span class="sb-tooltip">{{ link.name }}</span>
      </router-link>
    </nav>

    <!-- bottom utility links -->
    <div class="sb-bottom d-flex flex-column gap-1 p-2">
      <router-link to="/locations" class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 overflow-hidden text-decoration-none">
        <MapPin :size="19" class="sb-icon" />
        <span class="sb-label pe-none">Locations</span>
        <span class="sb-tooltip">Locations</span>
      </router-link>
      <router-link to="/cart" class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 overflow-hidden text-decoration-none">
        <div class="sb-cart-wrap">
          <ShoppingCart :size="19" class="sb-icon" />
          <span v-if="cartStore.itemCount > 0" class="sb-cart-badge">{{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}</span>
        </div>
        <span class="sb-label pe-none">Cart{{ cartStore.itemCount > 0 ? ` (${cartStore.itemCount})` : '' }}</span>
        <span class="sb-tooltip">Cart</span>
      </router-link>
      <router-link :to="profileRoute" class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 overflow-hidden text-decoration-none">
        <UserCircle :size="19" class="sb-icon" />
        <span class="sb-label">{{ isLoggedIn ? 'Profile' : 'Login' }}</span>
        <span class="sb-tooltip">{{ isLoggedIn ? 'Profile' : 'Login' }}</span>
      </router-link>

      <!-- light / dark mode toggler -->
      <button class="sb-link sb-theme-btn position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 overflow-hidden border-0 w-100" @click="toggleDark">
        <component :is="isDark ? Moon : Sun" :size="19" class="sb-icon" />
        <span class="sb-label pe-none">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
        <span class="sb-tooltip">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
      </button>
    </div>
  </aside>

  <!-- overlay when sidebar is expanded -->
  <div
    class="sidebar-overlay d-lg-none position-fixed inset-0"
    :class="{ visible: sidebarOpen }"
    @click="sidebarOpen = false"
  ></div>

  <!-- mobile search results panel (slides in beside open sidebar) -->
  <div class="sb-result-panel d-lg-none position-fixed d-flex flex-column" :class="{ 'is-visible': sbShowResults }">
    <!-- header -->
    <div class="sb-rp-header d-flex align-items-center justify-content-between px-3 flex-shrink-0">
      <p class="sb-rp-title mb-0">Results for "{{ searchQuery }}"</p>
      <button class="sb-rp-close d-flex align-items-center justify-content-center border-0 rounded-2" @click="closeSearch">
        <X :size="15" />
      </button>
    </div>

    <!-- scrollable body -->
    <div class="sb-rp-body overflow-y-auto">
      <div v-if="sbLoading" class="sb-result-state px-3 py-3">Searching…</div>
      <template v-else-if="sbHasSearched">
        <!-- products -->
        <div v-if="sbProducts.length > 0" class="sb-result-section">
          <p class="sb-result-label px-3 pt-3 pb-1 mb-0">Products</p>
          <button v-for="p in sbProducts" :key="p.id" class="sb-result-item d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-left" @click="sbHandleGoToProducts">
            <img :src="p.images?.[0]" :alt="p.name" class="sb-result-thumb object-fit-cover flex-shrink-0" />
            <div class="flex-fill overflow-hidden">
              <p class="sb-result-name mb-0 text-truncate">{{ p.name }}</p>
              <p class="sb-result-meta mb-0">{{ formatPrice(p.base_price) }}</p>
            </div>
          </button>
          <button class="sb-result-seeall d-flex align-items-center gap-1 w-100 px-3 py-2 border-0 text-left" @click="sbHandleGoToProducts">
            All products <ArrowRight :size="11" />
          </button>
        </div>
        <!-- branches -->
        <div v-if="sbBranches.length > 0" class="sb-result-section">
          <p class="sb-result-label px-3 pt-3 pb-1 mb-0">Branches</p>
          <button v-for="b in sbBranches" :key="b.id" class="sb-result-item d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-left" @click="sbHandleGoToBranch">
            <div class="sb-result-thumb sb-result-thumb--branch d-flex align-items-center justify-content-center flex-shrink-0">
              <MapPin :size="15" class="sb-result-pin" />
            </div>
            <div class="flex-fill overflow-hidden">
              <p class="sb-result-name mb-0 text-truncate">{{ b.name }}</p>
              <p class="sb-result-meta mb-0 text-truncate">{{ b.state }}</p>
            </div>
          </button>
          <button class="sb-result-seeall d-flex align-items-center gap-1 w-100 px-3 py-2 border-0 text-left" @click="sbHandleGoToBranch">
            All branches <ArrowRight :size="11" />
          </button>
        </div>
        <!-- showcase -->
        <div v-if="sbShowcase.length > 0" class="sb-result-section">
          <p class="sb-result-label px-3 pt-3 pb-1 mb-0">Showcase</p>
          <button v-for="c in sbShowcase" :key="c.id" class="sb-result-item d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-left" @click="sbHandleGoToShowcase(c.id)">
            <img v-if="c.preview_image_url" :src="c.preview_image_url" :alt="c.area" class="sb-result-thumb object-fit-cover flex-shrink-0" />
            <div v-else class="sb-result-thumb sb-result-thumb--blank flex-shrink-0" />
            <div class="flex-fill overflow-hidden">
              <p class="sb-result-name mb-0 text-truncate">{{ c.first_name }} {{ c.last_name }}</p>
              <p class="sb-result-meta mb-0 text-truncate">{{ c.area }}</p>
            </div>
          </button>
          <button class="sb-result-seeall d-flex align-items-center gap-1 w-100 px-3 py-2 border-0 text-left" @click="sbHandleGoToShowcaseAll">
            Browse showcase <ArrowRight :size="11" />
          </button>
        </div>
        <!-- empty -->
        <div v-if="!sbHasResults" class="sb-result-state px-3 py-4 text-center">No results for "{{ searchQuery }}"</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* desktop view */
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 900;
  height: 80px;
  background: #fff;
  border-bottom: 1px solid #e8e3dc;
  font-family: 'Times New Roman', Times, serif;
}

.brand {
  font-size: 1.25rem;
  letter-spacing: 1.5px;
  color: #473829;
  white-space: nowrap;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 4px;
  margin: 0 0 0 24px;
  padding: 0;
}

.nav-item {
  position: relative;
  display: inline-block;
  padding: 6px 10px;
  font-size: var(--fs-sm);
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #2c2218;
  text-decoration: none;
  transition: color 0.25s ease;
  border-radius: 6px;
}

/* animated underline bar */
.nav-item::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #8b6f47;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0, 0, 0.01, 1);
}

.nav-item:hover {
  color: #8b6f47;
}
.nav-item:hover::after {
  transform: scaleX(1);
}

/* Active state */
.nav-item.is-active {
  color: #8b6f47;
}
.nav-item.is-active::after {
  transform: scaleX(1);
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2218;
  text-decoration: none;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.icon-btn:hover {
  color: #8b6f47;
  transform: translateY(-1px);
}
.search-wrap {
  position: relative;
}
.search-pill {
  background: #f5f2ee;
  border: 1px solid #e4ddd5;
  cursor: text;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 180px;
}
.search-pill:focus-within {
  border-color: #8b6f47;
  box-shadow: 0 0 0 2px rgba(139, 111, 71, 0.12);
}
.search-icon-inner {
  color: #9b8b79;
  flex-shrink: 0;
}
.search-pill input {
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--fs-base);
  color: #2c2218;
  width: 130px;
  font-family: 'Times New Roman', Times, serif;
}
.search-pill input::placeholder {
  color: #b8a99a;
}

/* mobile sidebar */
.mobile-sidebar {
  top: 0;
  bottom: 0;
  width: 62px;
  background: #fff;
  border-right: 1px solid #e8e3dc;
  z-index: 1100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Times New Roman', Times, serif;
}
.mobile-sidebar.is-open {
  width: 220px;
  box-shadow: 4px 0 24px rgba(44, 34, 24, 0.12);
}

/* sidebar header */
.sb-header {
  justify-content: space-between;
  padding: 16px 12px;
  min-height: 62px;
  border-bottom: 1px solid #f0ebe4;
}
.sb-brand {
  white-space: nowrap;
}
.sb-brand-label {
  font-size: var(--fs-md);
  letter-spacing: 1px;
  color: #2c2218;
  opacity: 0;
}
.mobile-sidebar.is-open .sb-brand-label {
  opacity: 1;
  transform: translateX(0);
}

.sb-toggle {
  width: 26px;
  height: 26px;
  border: 1px solid #e4ddd5;
  background: #fff;
  color: #6b5d52;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease;
}
.sb-toggle:hover {
  background: #f5f2ee;
}

/* search icon trigger (collapsed only) */
.sb-search-trigger {
  width: 38px;
  height: 38px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4a3c30;
  transition: background 0.2s ease, color 0.2s ease;
}
.sb-search-trigger:hover {
  background: #f5f2ee;
  color: #2c2218;
}
.mobile-sidebar.is-open .sb-search-trigger {
  display: none !important;
}

/* sidebar search */
.sb-search {
  background: #f5f2ee;
  border: 1px solid #e4ddd5;
  transition: opacity 0.2s ease, max-height 0.3s ease;
  max-height: 0;
  opacity: 0;
}
.mobile-sidebar.is-open .sb-search {
  max-height: 44px;
  opacity: 1;
  margin: 10px 10px 6px;
  padding: 7px 10px;
  border-width: 1px;
}
.sb-search-icon {
  color: #9b8b79;
  flex-shrink: 0;
}
.sb-search-input {
  background: transparent;
  outline: none;
  font-size: var(--fs-base);
  color: #2c2218;
  font-family: 'Times New Roman', Times, serif;
}
.sb-search-input::placeholder {
  color: #b8a99a;
}

/* mobile search results panel */
.sb-result-panel {
  top: 0;
  bottom: 0;
  left: 220px;
  right: 0;
  background: #fff;
  border-left: 1px solid #e8e3dc;
  box-shadow: 4px 0 20px rgba(44, 34, 24, 0.08);
  z-index: 1099;
  transform: translateX(16px);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  font-family: 'Times New Roman', Times, serif;
}
.sb-result-panel.is-visible {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}
.sb-rp-header {
  min-height: 62px;
  border-bottom: 1px solid #f0ebe4;
  gap: 8px;
}
.sb-rp-title {
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  color: #9b8b79;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-rp-close {
  width: 26px;
  height: 26px;
  background: none;
  color: #6b5d52;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.sb-rp-close:hover { background: #f5f2ee; }
.sb-rp-body { flex: 1; overflow-y: auto; }

.sb-result-section + .sb-result-section {
  border-top: 1px solid #f0ebe4;
}
.sb-result-label {
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c4a882;
  font-family: 'Times New Roman', Times, serif;
}
.sb-result-item {
  background: none;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.sb-result-item:hover {
  background: #f5f2ee;
}
.sb-result-thumb {
  width: 32px;
  height: 32px;
  background: #f0ebe4;
}
.sb-result-thumb--branch {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sb-result-thumb--blank {
  background: #ede8e1;
}
.sb-result-pin {
  color: #8b6f47;
}
.sb-result-name {
  font-size: var(--fs-sm);
  color: #2c2218;
  font-family: 'Times New Roman', Times, serif;
}
.sb-result-meta {
  font-size: 0.7rem;
  color: #9b8b79;
  font-family: 'Times New Roman', Times, serif;
}
.sb-result-seeall {
  background: none;
  cursor: pointer;
  font-size: 0.7rem;
  color: #8b6f47;
  font-family: 'Times New Roman', Times, serif;
  padding-bottom: 6px;
  transition: color 0.15s;
}
.sb-result-seeall:hover {
  color: #5c4830;
}
.sb-result-state {
  font-size: var(--fs-sm);
  color: #9b8b79;
  font-family: 'Times New Roman', Times, serif;
}

/* sidebar navlinks */
.sb-nav {
  flex: 1;
}
.sb-bottom {
  border-top: 1px solid #f0ebe4;
}

.sb-link {
  color: #4a3c30;
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}
.sb-link:hover {
  background: #f5f2ee;
  color: #2c2218;
}
.sb-link.is-active {
  background: rgba(139, 111, 71, 0.1);
  color: #8b6f47;
  font-weight: 700;
}
.sb-icon {
  flex-shrink: 0;
}
.sb-label {
  font-size: var(--fs-base);
  opacity: 0;
}
.mobile-sidebar.is-open .sb-label {
  opacity: 1;
}

/* Tooltip shown on collapsed sidebar hover */
.sb-tooltip {
  display: none;
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: #2c2218;
  color: #f5f0ea;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: var(--fs-sm);
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
}
.sb-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: #2c2218;
}
/* Only show tooltip when sidebar is collapsed */
.mobile-sidebar:not(.is-open) .sb-link:hover .sb-tooltip {
  display: block;
}
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(44, 34, 24, 0.3);
  z-index: 1050;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.sidebar-overlay.visible {
  display: block;
  opacity: 1;
}

.cart-icon-btn {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #c4a882;
  color: #fff;
  font-size: 0.55rem;
  font-family: 'Times New Roman', serif;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  line-height: 1;
}
.sb-cart-wrap {
  position: relative;
  flex-shrink: 0;
  display: flex;
}
.sb-cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #c4a882;
  color: #fff;
  font-size: 0.5rem;
  min-width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
}
@keyframes spinOnce {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.theme-toggle.is-spinning {
  animation: spinOnce 0.42s ease forwards;
}

.sb-theme-btn {
  background: none;
  cursor: pointer;
  text-align: left;
}

/* ── dark mode ── */
[data-theme="dark"] .top-navbar {
  background: #1e1b14;
  border-bottom-color: #3a3025;
}
[data-theme="dark"] .brand { color: #e8ddd0; }
[data-theme="dark"] .nav-item { color: #c8bdb0; }
[data-theme="dark"] .nav-item:hover,
[data-theme="dark"] .nav-item.is-active { color: #c4a882; }
[data-theme="dark"] .icon-btn { color: #c8bdb0; }
[data-theme="dark"] .icon-btn:hover { color: #c4a882; }
[data-theme="dark"] .search-pill {
  background: #2a2418;
  border-color: #3a3025;
}
[data-theme="dark"] .search-pill input { color: #e8ddd0; }
[data-theme="dark"] .search-pill input::placeholder { color: #6a5a4a; }
[data-theme="dark"] .mobile-sidebar {
  background: #1e1b14;
  border-right-color: #3a3025;
}
[data-theme="dark"] .sb-header { border-bottom-color: #3a3025; }
[data-theme="dark"] .sb-bottom { border-top-color: #3a3025; }
[data-theme="dark"] .sb-brand-label { color: #c8bdb0; }
[data-theme="dark"] .sb-toggle {
  background: #2a2418;
  border-color: #3a3025;
  color: #c8bdb0;
}
[data-theme="dark"] .sb-toggle:hover { background: #3a3025; }
[data-theme="dark"] .sb-search-trigger { color: #c8bdb0; }
[data-theme="dark"] .sb-search-trigger:hover { background: #2a2418; color: #e8ddd0; }
[data-theme="dark"] .sb-result-panel { background: #1e1b14; border-left-color: #3a3025; }
[data-theme="dark"] .sb-rp-header { border-bottom-color: #3a3025; }
[data-theme="dark"] .sb-rp-title { color: #7a6a5a; }
[data-theme="dark"] .sb-rp-close { color: #c8bdb0; }
[data-theme="dark"] .sb-rp-close:hover { background: #2a2418; }
[data-theme="dark"] .sb-result-section + .sb-result-section { border-top-color: #3a3025; }
[data-theme="dark"] .sb-result-item:hover { background: #2a2418; }
[data-theme="dark"] .sb-result-thumb { background: #2a2418; }
[data-theme="dark"] .sb-result-thumb--blank { background: #2a2418; }
[data-theme="dark"] .sb-result-pin { color: #c4a882; }
[data-theme="dark"] .sb-result-name { color: #e8ddd0; }
[data-theme="dark"] .sb-result-meta { color: #7a6a5a; }
[data-theme="dark"] .sb-result-seeall { color: #c4a882; }
[data-theme="dark"] .sb-result-seeall:hover { color: #e0c99a; }
[data-theme="dark"] .sb-result-state { color: #7a6a5a; }
[data-theme="dark"] .sb-search {
  background: #2a2418;
  border-color: #3a3025;
}
[data-theme="dark"] .sb-search-input { color: #e8ddd0; }
[data-theme="dark"] .sb-search-input::placeholder { color: #6a5a4a; }
[data-theme="dark"] .sb-link { color: #c8bdb0; }
[data-theme="dark"] .sb-link:hover {
  background: #2a2418;
  color: #e8ddd0;
}
[data-theme="dark"] .sb-link.is-active {
  background: rgba(196, 168, 130, 0.15);
  color: #c4a882;
}
[data-theme="dark"] .sb-tooltip {
  background: #e8ddd0;
  color: #1e1b14;
}
[data-theme="dark"] .sb-tooltip::before { border-right-color: #e8ddd0; }
[data-theme="dark"] .sidebar-overlay { background: rgba(0, 0, 0, 0.55); }
</style>
