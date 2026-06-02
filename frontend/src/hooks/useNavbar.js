import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ShoppingBag, LayoutGrid, Sliders } from "@lucide/vue";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useCartStore } from "@/stores/cart";
import { useSearch } from "@/hooks/useSearch";

export default function useNavbar(mobileSearchRef) {
  const route = useRoute();
  const router = useRouter();
  const cartStore = useCartStore();

  onMounted(() => cartStore.fetchCart());

  // dark mode with spin-animation guard
  const { isDark, toggleDark } = useDarkMode();
  const isAnimating = ref(false);
  function handleToggle() {
    if (isAnimating.value) return;
    isAnimating.value = true;
    toggleDark();
    setTimeout(() => {
      isAnimating.value = false;
    }, 360);
  }

  // nav links definition
  const navLinks = [
    { key: "products", path: "/products", icon: ShoppingBag },
    { key: "showcase", path: "/showcase", icon: LayoutGrid },
    { key: "customize", path: "/customize", icon: Sliders },
  ];

  // auth state
  const isLoggedIn = computed(() => !!localStorage.getItem("token"));
  const profileRoute = computed(() =>
    isLoggedIn.value ? "/profile" : "/login",
  );

  // sidebar open/close
  const sidebarOpen = ref(false);

  // desktop search
  const searchQuery = ref("");
  const searchFocused = ref(false);
  const showDropdown = computed(
    () => searchFocused.value && searchQuery.value.length >= 2,
  );

  function onSearchFocus() {
    searchFocused.value = true;
  }
  function onSearchBlur() {
    setTimeout(() => {
      searchFocused.value = false;
    }, 150);
  }
  function onSearchEnter() {
    if (!searchQuery.value.trim()) return;
    router.push({
      path: "/products",
      query: { search: searchQuery.value.trim() },
    });
    searchFocused.value = false;
  }
  function onSearchEscape() {
    searchQuery.value = "";
    searchFocused.value = false;
  }
  function closeSearch() {
    searchQuery.value = "";
    searchFocused.value = false;
  }

  // mobile sidebar search (delegates to useSearch)
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
  } = useSearch();

  watch(searchQuery, (q) => {
    sbQuery.value = q;
  });
  watch(sidebarOpen, (open) => {
    if (!open) closeSearch();
  });

  const sbShowResults = computed(
    () => sidebarOpen.value && searchQuery.value.length >= 2,
  );

  async function openSidebarSearch() {
    sidebarOpen.value = true;
    await nextTick();
    mobileSearchRef.value?.focus();
  }
  function sbHandleGoToProducts() {
    sbGoToProducts();
    sidebarOpen.value = false;
  }
  function sbHandleGoToShowcase(id) {
    sbGoToShowcase(id);
    sidebarOpen.value = false;
  }
  function sbHandleGoToShowcaseAll() {
    sbGoToShowcaseAll();
    sidebarOpen.value = false;
  }
  function sbHandleGoToBranch() {
    sbGoToBranch();
    sidebarOpen.value = false;
  }

  return {
    route,
    cartStore,
    isDark,
    toggleDark,
    isAnimating,
    handleToggle,
    navLinks,
    isLoggedIn,
    profileRoute,
    sidebarOpen,
    searchQuery,
    showDropdown,
    onSearchFocus,
    onSearchBlur,
    onSearchEnter,
    onSearchEscape,
    closeSearch,
    sbProducts,
    sbShowcase,
    sbBranches,
    sbLoading,
    sbHasSearched,
    sbHasResults,
    formatPrice,
    sbShowResults,
    openSidebarSearch,
    sbHandleGoToProducts,
    sbHandleGoToShowcase,
    sbHandleGoToShowcaseAll,
    sbHandleGoToBranch,
  };
}
