<script setup>
import { ref, computed } from "vue";
import {
  MapPin, ShoppingCart, UserCircle, Search,
  ChevronLeft, ChevronRight, Sun, Moon, ArrowRight, X, Languages, ChevronDown,
} from "@lucide/vue";
import SearchDropdown from "@/components/SearchDropdown.vue";
import useNavbar from "@/hooks/useNavbar";
import { useLanguage, LOCALES } from "@/hooks/useLanguage";

const mobileSearchRef = ref(null);
const langDropdownOpen = ref(false);
const langBtnRef = ref(null);

const sbLangPanelStyle = computed(() => {
  if (!langBtnRef.value) return {};
  const rect = langBtnRef.value.getBoundingClientRect();
  const isSmall = window.innerWidth <= 420;
  const collapsedW = isSmall ? 48 : 62;
  const openW = isSmall ? 160 : 220;
  const left = (sidebarOpen.value ? openW : collapsedW) + 6;
  return {
    bottom: `${window.innerHeight - rect.bottom}px`,
    left: `${left}px`,
  };
});

const {
  route, cartStore, isDark, toggleDark, isAnimating, handleToggle,
  navLinks, isLoggedIn, profileRoute, sidebarOpen,
  searchQuery, showDropdown,
  onSearchFocus, onSearchBlur, onSearchEnter, onSearchEscape, closeSearch,
  sbProducts, sbShowcase, sbBranches, sbLoading, sbHasSearched, sbHasResults,
  formatPrice, sbShowResults,
  openSidebarSearch, sbHandleGoToProducts, sbHandleGoToShowcase,
  sbHandleGoToShowcaseAll, sbHandleGoToBranch,
} = useNavbar(mobileSearchRef);

const { currentLocale, setLocale } = useLanguage();

function selectLocale(code) {
  setLocale(code);
  langDropdownOpen.value = false;
}
</script>

<template>
  <!-- desktop nav -->
  <nav class="top-navbar d-none d-lg-flex position-sticky top-0">
    <div class="container-fluid px-5 d-flex align-items-center h-100">
      <!-- logo -->
      <router-link
        to="/"
        class="brand fw-bold text-uppercase text-decoration-none"
        >ComfyHome</router-link
      >

      <!-- nav links -->
      <ul class="nav-links p-0 gap-3 d-flex mt-3 ms-3">
        <li v-for="link in navLinks" :key="link.key">
          <router-link
            :to="link.path"
            class="nav-item d-inline-block text-uppercase text-decoration-none position-relative px-2 py-1 rounded-2"
            :class="{ 'is-active': route.path.startsWith(link.path) }"
          >
            {{ $t('nav.links.' + link.key) }}
          </router-link>
        </li>
      </ul>

      <!-- utility icons -->
      <div class="utility-icons d-flex align-items-center gap-3 ms-auto">
        <!-- search -->
        <div class="search-wrap position-relative">
          <label
            class="search-pill d-flex align-items-center gap-2 px-2 py-1 rounded-pill mt-2"
          >
            <Search :size="14" class="search-icon-inner" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('nav.search')"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
              @keydown.enter="onSearchEnter"
              @keydown.escape="onSearchEscape"
            />
          </label>
          <SearchDropdown
            v-if="showDropdown"
            :query="searchQuery"
            @close="closeSearch"
          />
        </div>

        <router-link
          :title="$t('nav.locations')"
          to="/locations"
          class="icon-btn d-flex align-items-center justify-content-center text-decoration-none p-1 rounded-2"
        >
          <MapPin :size="19" />
        </router-link>

        <router-link
          :title="$t('nav.cart')"
          to="/cart"
          class="icon-btn cart-icon-btn d-flex align-items-center justify-content-center text-decoration-none p-1 rounded-2 position-relative"
        >
          <ShoppingCart :size="19" />
          <span v-if="cartStore.itemCount > 0" class="cart-badge position-absolute d-flex align-items-center justify-content-center">{{
            cartStore.itemCount > 99 ? "99+" : cartStore.itemCount
          }}</span>
        </router-link>

        <router-link
          :title="$t('nav.profile')"
          :to="profileRoute"
          class="icon-btn d-flex align-items-center justify-content-center text-decoration-none p-1 rounded-2"
        >
          <UserCircle :size="21" />
        </router-link>

        <button
          class="icon-btn theme-toggle border-0 d-flex align-items-center justify-content-center"
          :class="{ 'is-spinning': isAnimating }"
          @click="handleToggle"
          :title="isDark ? $t('nav.darkMode') : $t('nav.lightMode')"
        >
          <Moon v-if="isDark" :size="19" />
          <Sun v-else :size="19" />
        </button>

        <!-- language switcher -->
        <div class="lang-wrap position-relative">
          <button
            class="icon-btn lang-btn border-0 d-flex align-items-center justify-content-center gap-1 px-1 py-2"
            :title="$t('nav.language')"
            @click="langDropdownOpen = !langDropdownOpen"
          >
            <Languages :size="19" />
            <span class="lang-code">{{ currentLocale.code.toUpperCase() }}</span>
            <ChevronDown :size="12" class="lang-chevron" :class="{ 'is-open': langDropdownOpen }" />
          </button>

          <Transition name="drop">
            <div v-if="langDropdownOpen" class="lang-panel position-absolute">
              <button
                v-for="loc in LOCALES"
                :key="loc.code"
                class="lang-option d-flex align-items-center gap-2 w-100 border-0 px-3 py-2 text-start"
                :class="{ 'is-active': currentLocale.code === loc.code }"
                @click="selectLocale(loc.code)"
              >
                {{ loc.label }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>

  <!-- mobile sidebar -->
  <aside
    class="mobile-sidebar d-lg-none top-0 bottom-0 left-0 position-fixed d-flex flex-column"
    :class="{ 'is-open': sidebarOpen }"
  >
    <!-- header -->
    <div class="sb-header justify-content-between align-items-center d-flex ps-3 py-2">
      <router-link
        to="/"
        class="sb-brand d-flex align-items-center text-decoration-none"
      >
        <span class="sb-brand-label fw-bold text-uppercase">ComfyHome</span>
      </router-link>
      <button
        class="sb-toggle d-flex align-items-center justify-content-center rounded-2"
        @click="sidebarOpen = !sidebarOpen"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft v-if="sidebarOpen" :size="16" />
        <ChevronRight v-else :size="16" />
      </button>
    </div>

    <!-- search icon trigger (collapsed state only) -->
    <button
      class="sb-search-trigger position-relative d-flex align-items-center justify-content-center rounded-2 border-0 mx-auto my-2"
      @click="openSidebarSearch"
      :title="$t('nav.search')"
    >
      <Search :size="19" class="sb-icon" />
    </button>

    <!-- expanded search bar -->
    <div
      class="sb-search d-flex align-items-center gap-2 rounded-pill overflow-hidden"
    >
      <Search :size="14" class="sb-search-icon" />
      <input
        ref="mobileSearchRef"
        v-model="searchQuery"
        type="text"
        :placeholder="$t('nav.search')"
        class="sb-search-input border-0 w-100"
        @keydown.enter="onSearchEnter"
        @keydown.escape="onSearchEscape"
      />
    </div>

    <!-- nav links -->
    <nav class="sb-nav d-flex flex-column gap-1 overflow-y-auto px-2 py-3">
      <router-link
        v-for="link in navLinks"
        :key="link.key"
        :to="link.path"
        class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 my-1 text-decoration-none"
        :class="{ 'is-active': route.path.startsWith(link.path) }"
        :title="$t('nav.links.' + link.key)"
      >
        <component :is="link.icon" :size="19" class="sb-icon" />
        <span class="sb-label pe-none">{{ $t('nav.links.' + link.key) }}</span>
      </router-link>
    </nav>

    <!-- bottom utility links -->
    <div class="sb-bottom d-flex flex-column gap-1 p-2">
      <router-link
        to="/locations"
        class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 text-decoration-none"
        :title="$t('nav.locations')"
      >
        <MapPin :size="19" class="sb-icon" />
        <span class="sb-label pe-none">{{ $t('nav.locations') }}</span>
      </router-link>

      <router-link
        to="/cart"
        class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 text-decoration-none"
        :title="$t('nav.cart')"
      >
        <div class="sb-cart-wrap d-flex position-relative flex-shrink-0">
          <ShoppingCart :size="19" class="sb-icon" />
          <span v-if="cartStore.itemCount > 0" class="sb-cart-badge position-absolute d-flex align-items-center justify-content-center">{{
            cartStore.itemCount > 99 ? "99+" : cartStore.itemCount
          }}</span>
        </div>
        <span class="sb-label pe-none"
          >{{ $t('nav.cart') }}{{
            cartStore.itemCount > 0 ? ` (${cartStore.itemCount})` : ""
          }}</span
        >
      </router-link>

      <router-link
        :to="profileRoute"
        class="sb-link position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 text-decoration-none"
        :title="$t('nav.profile')"
      >
        <UserCircle :size="19" class="sb-icon" />
        <span class="sb-label">{{ $t('nav.profile') }}</span>
      </router-link>

      <!-- theme toggle -->
      <button
        class="sb-link sb-theme-btn position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 border-0 w-100"
        :title="isDark ? $t('nav.darkMode') : $t('nav.lightMode')"
        @click="toggleDark"
      >
        <component :is="isDark ? Moon : Sun" :size="19" class="sb-icon" />
        <span class="sb-label pe-none">{{
          isDark ? $t('nav.darkMode') : $t('nav.lightMode')
        }}</span>
      </button>

      <!-- language switcher (sidebar) -->
      <div class="sb-lang-wrap">
        <button
          ref="langBtnRef"
          class="sb-link sb-lang-trigger position-relative d-flex align-items-center gap-3 rounded-2 px-2 py-2 border-0 w-100 text-left"
          @click="langDropdownOpen = !langDropdownOpen"
        >
          <Languages :size="19" class="sb-icon" />
          <span class="sb-label pe-none">{{ currentLocale.label }}</span>
        </button>
      </div>

      <Teleport to="body">
        <div
          v-if="langDropdownOpen"
          class="sb-lang-backdrop"
          @click="langDropdownOpen = false"
        />
        <Transition name="sb-slide">
          <div
            v-if="langDropdownOpen"
            class="sb-lang-panel"
            :style="sbLangPanelStyle"
          >
            <button
              v-for="loc in LOCALES"
              :key="loc.code"
              class="sb-lang-option d-flex align-items-center gap-2 w-100 border-0 px-3 py-2 text-start"
              :class="{ 'is-active': currentLocale.code === loc.code }"
              @click="selectLocale(loc.code)"
            >
              {{ loc.label }}
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>
  </aside>

  <!-- overlay when sidebar is expanded -->
  <div
    class="sidebar-overlay d-lg-none position-fixed inset-0 position-fixed"
    :class="{ visible: sidebarOpen }"
    @click="sidebarOpen = false"
  ></div>

  <!-- mobile search results panel -->
  <div
    class="sb-result-panel d-lg-none position-fixed d-flex flex-column top-0 bottom-0 pe-none"
    :class="{ 'is-visible': sbShowResults }"
  >
    <!-- header -->
    <div
      class="sb-rp-header d-flex align-items-center justify-content-between px-3 flex-shrink-0 gap-2"
    >
      <p class="sb-rp-title mb-0 overflow-hidden">{{ $t('nav.resultsFor', { query: searchQuery }) }}</p>
      <button
        class="sb-rp-close d-flex align-items-center justify-content-center border-0 rounded-2"
        @click="closeSearch"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- scrollable body -->
    <div class="sb-rp-body overflow-y-auto">
      <div v-if="sbLoading" class="sb-result-state px-3 py-3">{{ $t('nav.searching') }}</div>
      <template v-else-if="sbHasSearched">
        <!-- products -->
        <div v-if="sbProducts.length > 0" class="sb-result-section">
          <p class="sb-result-label text-uppercase px-3 pt-3 pb-1 mb-0">{{ $t('nav.products') }}</p>
          <button
            v-for="p in sbProducts"
            :key="p.id"
            class="sb-result-item d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-start"
            @click="sbHandleGoToProducts"
          >
            <img
              :src="p.images?.[0]"
              :alt="p.name"
              class="sb-result-thumb object-fit-cover flex-shrink-0"
            />
            <div class="flex-fill overflow-hidden">
              <p class="sb-result-name mb-0 text-truncate">{{ p.name }}</p>
              <p class="sb-result-meta mb-0">{{ formatPrice(p.base_price) }}</p>
            </div>
          </button>
          <button
            class="sb-result-seeall d-flex align-items-center gap-1 w-100 px-3 py-2 border-0 text-start"
            @click="sbHandleGoToProducts"
          >
            {{ $t('nav.allProducts') }} <ArrowRight :size="11" />
          </button>
        </div>

        <!-- branches -->
        <div v-if="sbBranches.length > 0" class="sb-result-section">
          <p class="sb-result-label text-uppercase px-3 pt-3 pb-1 mb-0">{{ $t('nav.branches') }}</p>
          <button
            v-for="b in sbBranches"
            :key="b.id"
            class="sb-result-item d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-start"
            @click="sbHandleGoToBranch"
          >
            <div
              class="sb-result-thumb sb-result-thumb--branch d-flex align-items-center justify-content-center flex-shrink-0"
            >
              <MapPin :size="15" class="sb-result-pin" />
            </div>
            <div class="flex-fill overflow-hidden">
              <p class="sb-result-name mb-0 text-truncate">{{ b.name }}</p>
              <p class="sb-result-meta mb-0 text-truncate">{{ b.state }}</p>
            </div>
          </button>
          <button
            class="sb-result-seeall d-flex align-items-center gap-1 w-100 px-3 py-2 border-0 text-start"
            @click="sbHandleGoToBranch"
          >
            {{ $t('nav.allBranches') }} <ArrowRight :size="11" />
          </button>
        </div>

        <!-- showcase -->
        <div v-if="sbShowcase.length > 0" class="sb-result-section">
          <p class="sb-result-label text-uppercase px-3 pt-3 pb-1 mb-0">{{ $t('nav.showcase') }}</p>
          <button
            v-for="c in sbShowcase"
            :key="c.id"
            class="sb-result-item d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-start"
            @click="sbHandleGoToShowcase(c.id)"
          >
            <img
              v-if="c.preview_image_url"
              :src="c.preview_image_url"
              :alt="c.area"
              class="sb-result-thumb object-fit-cover flex-shrink-0"
            />
            <div
              v-else
              class="sb-result-thumb sb-result-thumb--blank flex-shrink-0"
            />
            <div class="flex-fill overflow-hidden">
              <p class="sb-result-name mb-0 text-truncate">
                {{ c.first_name }} {{ c.last_name }}
              </p>
              <p class="sb-result-meta mb-0 text-truncate">{{ c.area }}</p>
            </div>
          </button>
          <button
            class="sb-result-seeall d-flex align-items-center gap-1 w-100 px-3 py-2 border-0 text-start"
            @click="sbHandleGoToShowcaseAll"
          >
            {{ $t('nav.browseShowcase') }} <ArrowRight :size="11" />
          </button>
        </div>

        <!-- empty state -->
        <div v-if="!sbHasResults" class="sb-result-state px-3 py-4 text-center">
          {{ $t('nav.noResults', { query: searchQuery }) }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.top-navbar {
  z-index: 900;
  height: 80px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  font-family: var(--font-serif);
}

.brand {
  font-size: 1.25rem;
  letter-spacing: 1.5px;
  color: var(--color-primary);
  white-space: nowrap;
}

.nav-links {
  list-style: none;
}

.nav-item {
  font-size: var(--fs-sm);
  letter-spacing: 1px;
  color: var(--color-primary);
  transition: color 0.25s ease;
}
.nav-item::after {
  content: "";
  position: absolute;
  bottom: 1px;
  left: 10px;
  right: 10px;
  height: 2px;
  background: var(--accent-dk);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0, 0, 0.01, 1);
}
.nav-item:hover,
.nav-item.is-active {
  color: var(--accent-dk);
}
.nav-item:hover::after,
.nav-item.is-active::after {
  transform: scaleX(1);
}

.icon-btn {
  color: var(--color-primary);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.icon-btn:hover {
  color: var(--accent-dk);
  transform: translateY(-1px);
}
.search-pill {
  background: var(--bg-alt);
  border: 1px solid var(--border-input);
  cursor: text;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 180px;
}
.search-pill:focus-within {
  border-color: var(--accent-dk);
  box-shadow: 0 0 0 2px rgba(139, 111, 71, 0.12);
}
.search-icon-inner {
  color: var(--color-muted);
  flex-shrink: 0;
}
.search-pill input {
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--fs-base);
  color: var(--color-primary);
  width: 130px;
  font-family: var(--font-serif);
}
.search-pill input::placeholder {
  color: var(--color-subtle);
}

/* language switcher */
.lang-btn {
  background: none;
  cursor: pointer;
}
.lang-code {
  font-size: var(--fs-2xs);
  font-family: var(--font-serif);
  letter-spacing: 0.05em;
}
.lang-chevron {
  transition: transform 0.2s ease;
  opacity: 0.7;
}
.lang-chevron.is-open {
  transform: rotate(180deg);
}
.lang-panel {
  top: calc(100% + 6px);
  min-width: 110px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: 0 8px 24px rgba(30, 26, 20, 0.1);
  z-index: 300;
}
.lang-option {
  background: none;
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--color-primary);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.lang-option:hover {
  background: var(--bg-alt);
}
.lang-option.is-active {
  font-weight: 700;
  color: var(--accent-dk);
}

/* mobile sidebar */
.mobile-sidebar {
  width: 62px;
  overflow: hidden;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  z-index: 1100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-serif);
}
.mobile-sidebar.is-open {
  width: 220px;
  box-shadow: 4px 0 24px rgba(44, 34, 24, 0.12);
}

.sb-header {
  padding: 16px 12px;
  min-height: 62px;
  border-bottom: 1px solid var(--border-light);
}
.sb-brand {
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}
.sb-brand-label {
  font-size: var(--fs-md);
  letter-spacing: 1px;
  color: var(--color-primary);
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.mobile-sidebar.is-open .sb-brand-label {
  opacity: 1;
  max-width: 200px;
}

.sb-toggle {
  width: 26px;
  height: 26px;
  border: 1px solid var(--border-input);
  background: var(--bg-surface);
  color: var(--color-secondary);
  cursor: pointer;
  flex-shrink: 0;
  flex-grow: 0;
  transition: background 0.2s ease;
}
.sb-toggle:hover {
  background: var(--bg-alt);
}

/* search icon trigger (collapsed state only) */
.sb-search-trigger {
  width: 38px;
  height: 38px;
  background: none;
  cursor: pointer;
  color: var(--color-primary);
  transition: background 0.2s ease, color 0.2s ease;
}
.sb-search-trigger:hover {
  background: var(--bg-alt);
}
.mobile-sidebar.is-open .sb-search-trigger {
  display: none !important;
}

/* expanded search bar */
.sb-search {
  background: var(--bg-alt);
  border: 1px solid var(--border-input);
  transition: opacity 0.2s ease, max-height 0.3s ease;
  max-height: 0;
  opacity: 0;
}
.mobile-sidebar.is-open .sb-search {
  max-height: 44px;
  opacity: 1;
  margin: 10px 10px 6px;
  padding: 7px 10px;
}
.sb-search-icon {
  color: var(--color-muted);
  flex-shrink: 0;
}
.sb-search-input {
  background: transparent;
  outline: none;
  font-size: var(--fs-base);
  color: var(--color-primary);
  font-family: var(--font-serif);
}
.sb-search-input::placeholder {
  color: var(--color-subtle);
}

/* sidebar nav links */
.sb-nav {
  flex: 1;
}
.sb-bottom {
  border-top: 1px solid var(--border-light);
}
.sb-link {
  color: var(--color-primary);
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}
.sb-link:hover {
  background: var(--bg-alt);
  color: var(--color-primary);
}
.sb-link.is-active {
  background: rgba(139, 111, 71, 0.1);
  color: var(--accent-dk);
  font-weight: 700;
}
.sb-icon {
  flex-shrink: 0;
}
.sb-label {
  font-size: var(--fs-base);
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.mobile-sidebar.is-open .sb-label {
  opacity: 1;
  max-width: 200px;
}

/* sidebar language */
.sb-lang-trigger {
  background: none;
  cursor: pointer;
}
.sb-lang-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1199;
}
.sb-lang-panel {
  position: fixed;
  min-width: 140px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: 4px 4px 20px rgba(30, 26, 20, 0.15);
  z-index: 1200;
  border-radius: 6px;
  overflow: hidden;
}
.sb-lang-option {
  background: none;
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--color-primary);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.sb-lang-option:hover {
  background: var(--bg-alt);
}
.sb-lang-option.is-active {
  font-weight: 700;
  color: var(--accent-dk);
}

/* overlay */
.sidebar-overlay {
  display: none;
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

/* cart badge */
.cart-badge {
  top: -4px;
  right: -4px;
  background: var(--accent);
  color: #fff;
  font-size: 0.55rem;
  font-family: var(--font-serif);
  min-width: 16px;
  height: 16px;
  padding: 0 2px;
  line-height: 1;
}
.sb-cart-badge {
  top: -4px;
  right: -4px;
  background: var(--accent);
  color: #fff;
  font-size: 0.5rem;
  min-width: 14px;
  height: 14px;
  padding: 0 2px;
}

/* theme toggle button */
.theme-toggle {
  background: none;
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

/* mobile search results panel */
.sb-result-panel {
  right: 0;
  left: 220px;
  background: var(--bg-surface);
  border-left: 1px solid var(--border);
  box-shadow: 4px 0 20px rgba(44, 34, 24, 0.08);
  z-index: 1099;
  transform: translateX(16px);
  opacity: 0;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  font-family: var(--font-serif);
}
.sb-result-panel.is-visible {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}
.sb-rp-header {
  min-height: 62px;
  border-bottom: 1px solid var(--border-light);
}
.sb-rp-title {
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  color: var(--color-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sb-rp-close {
  width: 26px;
  height: 26px;
  background: none;
  color: var(--color-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.sb-rp-close:hover {
  background: var(--bg-alt);
}

.sb-result-section + .sb-result-section {
  border-top: 1px solid var(--border-light);
}
.sb-result-label {
  font-size: var(--fs-2xs);
  letter-spacing: 0.14em;
  color: var(--accent);
  font-family: var(--font-serif);
}
.sb-result-item {
  background: none;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.sb-result-item:hover {
  background: var(--bg-alt);
}
.sb-result-thumb {
  width: 32px;
  height: 32px;
  background: var(--bg-alt);
}
.sb-result-thumb--blank {
  background: var(--bg-alt);
}
.sb-result-pin {
  color: var(--accent-dk);
}
.sb-result-name {
  font-size: var(--fs-sm);
  color: var(--color-primary);
  font-family: var(--font-serif);
}
.sb-result-meta {
  font-size: 0.7rem;
  color: var(--color-muted);
  font-family: var(--font-serif);
}
.sb-result-seeall {
  background: none;
  cursor: pointer;
  font-size: 0.7rem;
  color: var(--accent-dk);
  font-family: var(--font-serif);
  padding-bottom: 6px;
  transition: color 0.15s;
}
.sb-result-seeall:hover {
  color: var(--color-primary);
}
.sb-result-state {
  font-size: var(--fs-sm);
  color: var(--color-muted);
  font-family: var(--font-serif);
}

/* search bars: more visible border + placeholder in dark */
[data-theme="dark"] .search-pill {
  background: var(--bg-elevated);
  border-color: var(--color-muted);
}
[data-theme="dark"] .search-pill:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(196, 168, 130, 0.2);
}
[data-theme="dark"] .search-pill input::placeholder,
[data-theme="dark"] .sb-search-input::placeholder {
  color: var(--color-muted);
}
[data-theme="dark"] .sb-search {
  background: var(--bg-elevated);
  border-color: var(--color-muted);
}

/* navbar/sidebar/results panel use bg-alt (darker) instead of bg-surface in dark */
[data-theme="dark"] .top-navbar,
[data-theme="dark"] .mobile-sidebar,
[data-theme="dark"] .sb-result-panel {
  background: var(--bg-alt);
}

/* toggle hover uses border shade in dark (bg-alt would be too dark) */
[data-theme="dark"] .sb-toggle:hover {
  background: var(--border);
}

/* active/hover links use accent (lighter) in dark for better contrast */
[data-theme="dark"] .nav-item:hover,
[data-theme="dark"] .nav-item.is-active {
  color: var(--accent);
}
[data-theme="dark"] .icon-btn:hover {
  color: var(--accent);
}
[data-theme="dark"] .sb-link:hover {
  background: rgba(196, 168, 130, 0.08);
  color: var(--accent);
}
[data-theme="dark"] .sb-link.is-active {
  background: rgba(196, 168, 130, 0.15);
  color: var(--accent);
}
[data-theme="dark"] .sb-result-pin,
[data-theme="dark"] .sb-result-seeall {
  color: var(--accent);
}
[data-theme="dark"] .sb-result-seeall:hover {
  color: #e0c99a;
}

/* sidebar overlay is fully opaque in dark */
[data-theme="dark"] .sidebar-overlay {
  background: rgba(0, 0, 0, 0.55);
}

/* lang panel dark */
[data-theme="dark"] .lang-panel {
  background: var(--bg-alt);
  border-color: var(--color-muted);
}
[data-theme="dark"] .lang-option:hover {
  background: var(--bg-elevated);
}
[data-theme="dark"] .lang-option.is-active {
  color: var(--accent);
}
[data-theme="dark"] .sb-lang-panel {
  background: var(--bg-alt);
  border-color: var(--color-muted);
}
[data-theme="dark"] .sb-lang-option:hover {
  background: var(--bg-elevated);
}
[data-theme="dark"] .sb-lang-option.is-active {
  color: var(--accent);
}

/* sidebar lang panel slide-in from left */
.sb-slide-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.sb-slide-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.sb-slide-enter-from,
.sb-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* ── dropdown slide-down animation ── */
.drop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.drop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.drop-enter-from {
  opacity: 0;
  transform: translateY(-7px);
}
.drop-leave-to {
  opacity: 0;
  transform: translateY(-7px);
}

/* responsive */
@media (max-width: 420px) {
  .sb-brand-label {
    font-size: var(--fs-sm);
  }
  .mobile-sidebar {
    width: 48px;
  }
  .mobile-sidebar.is-open {
    width: 160px;
  }
  .sb-result-panel {
    left: 160px;
  }
  .mobile-sidebar.is-open .sb-search {
    margin: 8px 6px 4px;
  }
}
</style>
