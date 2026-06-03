import { ref, onMounted, onUnmounted } from 'vue'
import { Armchair, PenLine, RotateCcw, Tag, ShoppingCart } from '@lucide/vue'

const STORAGE_KEY = 'cu-onboarding-done'
const SLIDE_DURATION = 5000

export const ONBOARDING_SLIDES = [
  {
    icon: Armchair,
    step: '01',
    title: 'Choose Your Living Area',
    desc: 'Start by selecting a room — Living Room, Bedroom, Kitchen, Bathroom, or Office. Each area surfaces furniture types perfectly suited for the space.',
  },
  {
    icon: PenLine,
    step: '02',
    title: 'Customise Every Detail',
    desc: 'Pick a furniture type, then dial in every configuration: shape, fabric, material, colour, and leg style — all in one streamlined panel.',
  },
  {
    icon: RotateCcw,
    step: '03',
    title: 'Preview in 3D',
    desc: 'Your selections render live in the 3D viewer. Rotate and inspect the model as you tweak options to see exactly how your piece will look.',
  },
  {
    icon: Tag,
    step: '04',
    title: 'Real-Time Price Updates',
    desc: 'The price summary updates instantly with every choice. You always see a transparent breakdown — no surprises when you reach the cart.',
  },
  {
    icon: ShoppingCart,
    step: '05',
    title: 'Add to Cart or Contribute',
    desc: 'Happy with your design? Add it straight to your cart, or share it as a community showcase piece for others to discover and order.',
  },
]

export default function useOnboarding() {
  const visible      = ref(!localStorage.getItem(STORAGE_KEY))
  const currentSlide = ref(0)
  let timer          = null

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
    localStorage.setItem(STORAGE_KEY, '1')
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

  return { visible, currentSlide, next, goTo, dismiss }
}
