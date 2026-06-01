import { ref, onMounted } from 'vue'
import { getProductsApi } from '@/services/productServices'
import { getContributionsApi } from '@/services/showcaseServices'

export default function useHome() {
  const productCount = ref('-')
  const projectCount = ref('-')

  const productCategories = ref([
    { id: 1, name: 'Living Room', category: 'living-room', size: 'tall', img: '/home/living-room.jpg' },
    { id: 2, name: 'Study Room', category: 'study-room', size: 'wide', img: '/home/study-room.png' },
    { id: 3, name: 'Kitchen', category: 'kitchen', size: 'small', img: '/home/kitchen-counter.jpeg' },
    { id: 4, name: 'Bathroom', category: 'bathroom', size: 'tall', img: '/home/bathroom.jpeg' },
    { id: 5, name: 'Bedroom', category: 'bedroom', size: 'wide', img: '/home/bed.jpeg' },
  ])

  onMounted(async () => {
    const [pRes, scRes] = await Promise.allSettled([
      getProductsApi({ limit: 1 }),
      getContributionsApi(),
    ])

    if (pRes.status === 'fulfilled') {
      productCount.value = pRes.value.total ?? pRes.value.products?.length ?? 0
    }

    if (scRes.status === 'fulfilled') {
      projectCount.value = scRes.value.contributions?.length ?? 0
    }
  })

  return { productCount, projectCount, productCategories }
}
