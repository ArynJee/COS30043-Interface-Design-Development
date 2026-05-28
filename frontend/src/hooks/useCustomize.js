import { ref, computed, watch } from 'vue'
import {
  FURNITURE_TYPES,
  FURNITURE_BY_ID,
  FURNITURE_BY_AREA,
  AREAS,
  formatPrice,
} from '@/data/furnitureConfigs.js'
import { addToCartApi, contributeDesignApi } from '@/services/customizeServices.js'

export default function useCustomize(viewerRef) {
  // ── selection state ─────────────────────────────────────────────────────────
  const selectedArea    = ref(AREAS[0])
  const selectedTypeId  = ref(null)
  const selectedConfig  = ref({})   // { shape: {...}, material: {...}, color: {...}, ... }

  // ── derived ─────────────────────────────────────────────────────────────────
  const furnitureInArea = computed(() => FURNITURE_BY_AREA[selectedArea.value] || [])

  const currentType = computed(() =>
    selectedTypeId.value ? FURNITURE_BY_ID[selectedTypeId.value] : null
  )

  const configKeys = computed(() => {
    if (!currentType.value) return []
    return Object.keys(currentType.value.configs)
  })

  const totalPrice = computed(() => {
    if (!currentType.value) return 0
    let total = currentType.value.basePrice
    for (const key of configKeys.value) {
      const chosen = selectedConfig.value[key]
      if (chosen) total += chosen.price || 0
    }
    return total
  })

  // default selections when type changes
  watch(currentType, (type) => {
    if (!type) { selectedConfig.value = {}; return }
    const defaults = {}
    for (const [key, opts] of Object.entries(type.configs)) {
      if (opts.length) defaults[key] = opts[0]
    }
    selectedConfig.value = defaults
  })

  // ── actions ─────────────────────────────────────────────────────────────────
  function selectArea(area) {
    selectedArea.value  = area
    selectedTypeId.value = null
    selectedConfig.value = {}
  }

  function selectType(id) {
    selectedTypeId.value = id
  }

  function selectOption(configKey, option) {
    selectedConfig.value = { ...selectedConfig.value, [configKey]: option }
  }

  // ── cart ────────────────────────────────────────────────────────────────────
  const cartLoading = ref(false)
  const cartSuccess = ref(false)
  const cartError   = ref('')

  async function addToCart() {
    if (!currentType.value) return
    if (!localStorage.getItem('token')) {
      cartError.value = 'Please log in to add items to cart.'
      return
    }
    cartLoading.value = true
    cartSuccess.value = false
    cartError.value   = ''
    try {
      const preview = viewerRef?.value?.captureScreenshot?.() || null
      await addToCartApi({
        furniture_type: currentType.value.id,
        skeleton_type:  currentType.value.skeletonType,
        configuration:  selectedConfig.value,
        unit_price:     totalPrice.value,
        preview_image:  preview,
      })
      cartSuccess.value = true
      setTimeout(() => { cartSuccess.value = false }, 3000)
    } catch (e) {
      cartError.value = e?.response?.data?.message || 'Failed to add to cart.'
    } finally {
      cartLoading.value = false
    }
  }

  // ── contribution ─────────────────────────────────────────────────────────────
  const contribOpen       = ref(false)
  const contribSubmitting = ref(false)
  const contribError      = ref('')
  const contribSuccess    = ref(false)
  const contribPreview    = ref('')

  function openContribModal() {
    if (!currentType.value) return
    const token = localStorage.getItem('token')
    console.log('[contribute] openContribModal — token in localStorage:', token)
    console.log('[contribute] all localStorage keys:', Object.keys(localStorage))
    if (!token) {
      cartError.value = 'Please log in to contribute a design.'
      return
    }
    contribPreview.value = viewerRef?.value?.captureScreenshot?.() || ''
    contribError.value   = ''
    contribOpen.value    = true
  }

  async function submitContribution(description) {
    if (!currentType.value) return
    const token = localStorage.getItem('token')
    console.log('[contribute] submitContribution — token at submit time:', token)
    contribSubmitting.value = true
    contribError.value      = ''
    try {
      const payload = {
        area:           currentType.value.area,
        furniture_type: currentType.value.name,
        description,
        configuration:  selectedConfig.value,
        total_cost:     totalPrice.value,
        preview_image:  contribPreview.value,
      }
      console.log('[contribute] sending payload:', payload)
      await contributeDesignApi(payload)
      contribOpen.value    = false
      contribSuccess.value = true
      setTimeout(() => { contribSuccess.value = false }, 4000)
    } catch (e) {
      console.error('[contribute] API error:', e)
      console.error('[contribute] response status:', e?.response?.status)
      console.error('[contribute] response data:', e?.response?.data)
      contribError.value = e?.response?.data?.message || 'Submission failed.'
    } finally {
      contribSubmitting.value = false
    }
  }

  return {
    // state
    selectedArea,
    selectedTypeId,
    selectedConfig,
    // derived
    AREAS,
    furnitureInArea,
    currentType,
    configKeys,
    totalPrice,
    // actions
    selectArea,
    selectType,
    selectOption,
    // cart
    cartLoading,
    cartSuccess,
    cartError,
    addToCart,
    // contribution
    contribOpen,
    contribSubmitting,
    contribError,
    contribSuccess,
    contribPreview,
    openContribModal,
    submitContribution,
    // helpers
    formatPrice,
  }
}
