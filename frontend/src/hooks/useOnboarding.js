import { ref, onMounted, onUnmounted } from 'vue'
import { Armchair, PenLine, Rotate3d, Tag, ShoppingCart } from '@lucide/vue'

const SLIDE_DURATION = 5000
let _seenThisLoad    = false

export const ONBOARDING_SLIDES = [
  { icon: Armchair,     step: '01', key: 's1' },
  { icon: PenLine,      step: '02', key: 's2' },
  { icon: Rotate3d,     step: '03', key: 's3' },
  { icon: Tag,          step: '04', key: 's4' },
  { icon: ShoppingCart, step: '05', key: 's5' },
]

export default function useOnboarding() {
  const visible      = ref(!_seenThisLoad)
  const currentSlide = ref(0)
  let timer          = null

  function prev() {
    if (currentSlide.value > 0) {
      currentSlide.value--
      resetTimer()
    }
  }

  function next() {
    if (currentSlide.value < ONBOARDING_SLIDES.length - 1) {
      currentSlide.value++
      resetTimer()
    } else {
      dismiss()
    }
  }

  function goTo(idx) {
    currentSlide.value = idx
    resetTimer()
  }

  function dismiss() {
    visible.value = false
    _seenThisLoad = true
    clearTimer()
  }

  function resetTimer() {
    clearTimer()
    timer = setInterval(() => {
      if (currentSlide.value < ONBOARDING_SLIDES.length - 1) {
        currentSlide.value++
      } else {
        dismiss()
      }
    }, SLIDE_DURATION)
  }

  function clearTimer() {
    if (timer) { clearInterval(timer); timer = null }
  }

  onMounted(() => { if (visible.value) resetTimer() })
  onUnmounted(clearTimer)

  return { visible, currentSlide, prev, next, goTo, dismiss }
}
