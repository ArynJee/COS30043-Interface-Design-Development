import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProductsApi, getFiltersApi } from '@/services/productServices.js'

export default function useProducts() {
  const route = useRoute()

  // ── state ──────────────────────────────────────────────
  const products    = ref([])
  const total       = ref(0)
  const totalPages  = ref(0)
  const currentPage = ref(1)
  const loading     = ref(false)

  const categories          = ref([])
  const tags                = ref([])
  const selectedCategories  = ref([])
  const selectedTags        = ref([])
  const sortBy              = ref('default')
  const sidebarOpen         = ref(true)
  const searchQuery         = ref('')
  let   searchTimer         = null

  // ── slug → category name (from home page ?type= links) ─
  const slugToName = {
    'living-room': 'Living Room',
    'study-room':  'Study Room',
    'kitchen':     'Kitchen',
    'bathroom':    'Bathroom',
    'bedroom':     'Bedroom',
  }

  // ── computed ───────────────────────────────────────────
  const hasActiveFilters = computed(
    () => selectedCategories.value.length > 0 || selectedTags.value.length > 0 || searchQuery.value.trim() !== ''
  )

  // show only tags belonging to selected categories (or all if none selected)
  const visibleTags = computed(() => {
    if (selectedCategories.value.length === 0) return tags.value
    return tags.value.filter(t => selectedCategories.value.includes(t.category_id))
  })

  // smart ellipsis page list
  const visiblePages = computed(() => {
    const tp  = totalPages.value
    const cur = currentPage.value
    if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
    const pages = [1]
    if (cur > 3) pages.push('…')
    for (let i = Math.max(2, cur - 1); i <= Math.min(tp - 1, cur + 1); i++) pages.push(i)
    if (cur < tp - 2) pages.push('…')
    pages.push(tp)
    return pages
  })

  // ── helpers ────────────────────────────────────────────
  const formatPrice = (price) =>
    'RM ' + parseFloat(price).toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const formatMeasurements = (p) => {
    const h = p.height_cm != null ? Math.round(p.height_cm) : null
    const w = p.width_cm  != null ? Math.round(p.width_cm)  : null
    const d = p.depth_cm  != null ? Math.round(p.depth_cm)  : null
    if (!h || !w) return null
    return d ? `${h}H × ${w}W × ${d}D cm` : `${h}H × ${w}W cm`
  }

  // ── fetch ──────────────────────────────────────────────
  const fetchProducts = async () => {
    loading.value = true
    try {
      const params = { page: currentPage.value, limit: 12, sort: sortBy.value }
      if (selectedCategories.value.length) params.category_ids = selectedCategories.value.join(',')
      if (selectedTags.value.length)       params.tag_ids      = selectedTags.value.join(',')
      if (searchQuery.value.trim())        params.search       = searchQuery.value.trim()

      const data = await getProductsApi(params)
      products.value   = data.products
      total.value      = data.total
      totalPages.value = data.totalPages
    } finally {
      loading.value = false
    }
  }

  // reset to page 1 and re-fetch when filters or sort change
  watch([selectedCategories, selectedTags, sortBy], () => {
    currentPage.value = 1
    fetchProducts()
  }, { deep: true })

  // debounced re-fetch when search query changes
  watch(searchQuery, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      currentPage.value = 1
      fetchProducts()
    }, 350)
  })

  // deselect tags that no longer belong to selected categories
  watch(selectedCategories, (cats) => {
    if (cats.length > 0) {
      selectedTags.value = selectedTags.value.filter(id => {
        const tag = tags.value.find(t => t.id === id)
        return tag && cats.includes(tag.category_id)
      })
    }
  })

  // ── actions ────────────────────────────────────────────
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
    searchQuery.value = ''
  }

  // ── init ───────────────────────────────────────────────
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

  return {
    // state
    products,
    total,
    totalPages,
    currentPage,
    loading,
    categories,
    tags,
    selectedCategories,
    selectedTags,
    sortBy,
    sidebarOpen,
    searchQuery,
    // computed
    hasActiveFilters,
    visibleTags,
    visiblePages,
    // helpers
    formatPrice,
    formatMeasurements,
    // actions
    goToPage,
    toggleCategory,
    toggleTag,
    clearFilters,
  }
}
