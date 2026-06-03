import { ref, onMounted, onUnmounted } from 'vue'
import { Armchair, PenLine, Rotate3d, Tag, ShoppingCart } from '@lucide/vue'

const SLIDE_DURATION = 5000
let _seenThisLoad    = false

export const ONBOARDING_SLIDES = [
  {
    icon: Armchair,
    step: '01',
    title: 'Choose Your Living Area',
    desc: 'Start by selecting a room: Living Room, Bedroom, Kitchen, Bathroom, Study Room. Each furniture type perfectly suited for the space.',
  },
  {
    icon: PenLine,
    step: '02',
    title: 'Customise Every Detail',
    desc: 'Pick a furniture type, then dial in every configuration: shape, fabric, material, colour, and leg style, all in one streamlined panel.',
  },
  {
    icon: Rotate3d,
    step: '03',
    title: 'Preview in 3D',
    desc: 'Your selections render live in the 3D viewer. Rotate and inspect the model as you tweak options to see exactly how your piece will look.',
  },
  {
    icon: Tag,
    step: '04',
    title: 'Real-Time Price Updates',
    desc: 'The price summary updates instantly with every choice. You always see a transparent breakdown. No surprises when you reach the cart.',
  },
  {
    icon: ShoppingCart,
    step: '05',
    title: 'Add to Cart or Contribute',
    desc: 'Happy with your design? Add it straight to your cart, or share it as a community showcase piece for others to discover and order.',
  },
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
