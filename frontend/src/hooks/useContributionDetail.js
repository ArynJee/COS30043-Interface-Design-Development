import { ref, computed, onMounted } from 'vue'
import { getContributionApi, getContributionReviewsApi, addContributionReviewApi } from '@/services/showcaseServices'
import { addToCartApi } from '@/services/customizeServices'
import { FURNITURE_TYPE_MAP } from '@/data/furnitureConfigs'
import { useCartStore } from '@/stores/cart'

export default function useContributionDetail(contributionId) {
  const cartStore = useCartStore()

  const contribution = ref(null)
  const reviews = ref([])
  const loading = ref(true)
  const error = ref(null)
  const addingToCart = ref(false)
  const cartAdded = ref(false)
  const cartError = ref(null)
  const submittingReview = ref(false)
  const reviewError = ref(null)
  const reviewSuccess = ref(false)

  const furnitureMeta = computed(() => {
    if (!contribution.value) return null
    return FURNITURE_TYPE_MAP[contribution.value.furniture_type] || null
  })

  const skeletonType = computed(() => furnitureMeta.value?.skeletonType || '')
  const furnitureTypeId = computed(() => furnitureMeta.value?.id || '')

  const parsedConfig = computed(() => {
    if (!contribution.value) return {}
    const cfg = contribution.value.configuration
    return typeof cfg === 'string' ? JSON.parse(cfg) : cfg || {}
  })

  const configEntries = computed(() =>
    Object.entries(parsedConfig.value).map(([k, v]) => ({
      label: k.charAt(0).toUpperCase() + k.slice(1),
      name: typeof v === 'object' ? v.name : String(v),
      price: typeof v === 'object' ? v.price : null,
    }))
  )

  const formatPrice = (price) =>
    `RM ${parseFloat(price).toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })

  const getInitials = (first, last) =>
    `${first?.[0] ?? '?'}${last?.[0] ?? ''}`.toUpperCase()

  async function fetchContribution() {
    try {
      const data = await getContributionApi(contributionId)
      contribution.value = data.contribution
    } catch {
      error.value = 'Contribution not found.'
    } finally {
      loading.value = false
    }
  }

  async function fetchReviews() {
    try {
      const data = await getContributionReviewsApi(contributionId)
      reviews.value = data.reviews
    } catch {
      // silently ignore
    }
  }

  let cartErrorTimer = null
  function showCartError(msg) {
    cartError.value = msg
    clearTimeout(cartErrorTimer)
    cartErrorTimer = setTimeout(() => { cartError.value = null }, 4000)
  }

  async function addToCart() {
    if (!localStorage.getItem('token')) {
      showCartError('Please log in to add items to your cart.')
      return
    }
    addingToCart.value = true
    try {
      await addToCartApi({
        furniture_type: contribution.value.furniture_type,
        skeleton_type: skeletonType.value,
        configuration: parsedConfig.value,
        unit_price: contribution.value.total_cost,
        preview_image: contribution.value.preview_image_url,
      })
      await cartStore.fetchCart()
      cartAdded.value = true
      setTimeout(() => { cartAdded.value = false }, 2000)
    } catch (err) {
      const msg = err.response?.data?.message
      showCartError(msg || 'Please log in to add items to your cart.')
    } finally {
      addingToCart.value = false
    }
  }

  async function submitReview({ rating, comment }) {
    submittingReview.value = true
    reviewError.value = null
    reviewSuccess.value = false
    try {
      await addContributionReviewApi(contributionId, { rating, comment })
      reviewSuccess.value = true
      await fetchReviews()
      setTimeout(() => { reviewSuccess.value = false }, 3000)
    } catch {
      reviewError.value = 'Failed to submit review. Please try again.'
    } finally {
      submittingReview.value = false
    }
  }

  onMounted(async () => {
    await fetchContribution()
    fetchReviews()
  })

  return {
    contribution, reviews, loading, error,
    skeletonType, furnitureTypeId, parsedConfig, configEntries,
    addingToCart, cartAdded, cartError,
    submittingReview, reviewError, reviewSuccess,
    formatPrice, formatDate, getInitials,
    addToCart, submitReview,
  }
}
