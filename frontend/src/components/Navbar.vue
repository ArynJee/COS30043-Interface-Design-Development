<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MapPin, ShoppingCart, UserCircle, Search, ShoppingBag, LayoutGrid, Sliders, Info, ChevronLeft, ChevronRight, Sun, Moon } from '@lucide/vue'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useCartStore } from '@/stores/cart'

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
  { name: 'About Us', path: '/about', icon: Info },
]

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const profileRoute = computed(() => isLoggedIn.value ? '/profile' : '/login')
const route = useRoute()
const sidebarOpen = ref(false)
const searchQuery = ref('')
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
        <label class="search-pill d-flex align-items-center gap-2 px-2 py-1 rounded-pill mt-2">
          <Search :size="14" class="search-icon-inner" />
          <input v-model="searchQuery" type="text" placeholder="Search…" />
        </label>

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

    <!-- expanded search bar -->
    <div class="sb-search d-flex align-items-center gap-2 rounded-pill mx-2 mt-3 mb-1 px-2 py-1 overflow-hidden">
      <Search :size="14" class="sb-search-icon" />
      <input v-model="searchQuery" type="text" placeholder="Search…" class="sb-search-input border-0 w-100" />
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
  font-size: 0.78rem;
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
  font-size: 0.82rem;
  color: #2c2218;
  width: 130px;
  font-family: 'Times New Roman', Times, serif;
}
.search-pill input::placeholder {
  color: #b8a99a;
}

/* mobile sidebar */
.mobile-sidebar {
  height: 100vh;
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
  font-size: 0.95rem;
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
  font-size: 0.82rem;
  color: #2c2218;
  font-family: 'Times New Roman', Times, serif;
}
.sb-search-input::placeholder {
  color: #b8a99a;
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
  font-size: 0.88rem;
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
  font-size: 0.78rem;
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
