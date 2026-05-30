import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProductsApi } from '@/services/productServices.js'
import { getContributionsApi } from '@/services/showcaseServices.js'

export function useSearch() {
  const router = useRouter()
  const query = ref('')
  const products = ref([])
  const allContributions = ref([])
  const loading = ref(false)
  const hasSearched = ref(false)

  const showcaseResults = computed(() => {
    const q = query.value.toLowerCase()
    return allContributions.value
      .filter(
        (c) =>
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
          c.area?.toLowerCase().includes(q) ||
          c.furniture_type?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      )
      .slice(0, 3)
  })

  const hasResults = computed(
    () => products.value.length > 0 || showcaseResults.value.length > 0,
  )

  const formatPrice = (p) =>
    'RM ' +
    parseFloat(p).toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  let timer = null

  watch(query, (q) => {
    clearTimeout(timer)
    if (q.length < 2) {
      products.value = []
      allContributions.value = []
      hasSearched.value = false
      return
    }
    loading.value = true
    hasSearched.value = false
    timer = setTimeout(async () => {
      try {
        const [prodData, showcaseData] = await Promise.all([
          getProductsApi({ search: q, limit: 5 }),
          getContributionsApi('All'),
        ])
        products.value = prodData.products ?? []
        allContributions.value = showcaseData.contributions ?? []
        hasSearched.value = true
      } catch {
        hasSearched.value = true
      } finally {
        loading.value = false
      }
    }, 300)
  })

  function goToProducts() {
    router.push({ path: '/products', query: { search: query.value.trim() } })
    clear()
  }

  function goToShowcase(id) {
    router.push(`/showcase/${id}`)
    clear()
  }

  function goToShowcaseAll() {
    router.push('/showcase')
    clear()
  }

  function clear() {
    query.value = ''
    hasSearched.value = false
    products.value = []
    allContributions.value = []
  }

  return {
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
    clear,
  }
}
