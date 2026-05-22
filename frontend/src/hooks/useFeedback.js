import { ref, onMounted, computed} from 'vue'
import { getFeedbacksApi, createFeedbackApi } from '@/services/feedbackServices'

export default function useFeedback() {
  // set state
  const feedbacks = ref([])
  const feedbackCount = ref(0)
  const showFeedbackModal = ref(false)
  const feedbackSubmitted = ref(false)
  const userFeedback = ref({ name: '', rating: 5, comment: '',})

  // GET: fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const data = await getFeedbacksApi()
      feedbacks.value = data.reviews
      feedbackCount.value = data.totalSatisfied
    } catch (err) {
      console.error('Fetch feedback failed:', err)
    }
  }

  // POST: submit feedbacks
  const submitFeedback = async () => {
    try {
      await createFeedbackApi(userFeedback.value)

      feedbackSubmitted.value = true

      // refresh latest feedbacks
      await fetchFeedbacks()

      // reset form
      userFeedback.value = {
        name: '',
        rating: 5,
        comment: '',
      }

      setTimeout(() => {
        showFeedbackModal.value = false
        feedbackSubmitted.value = false
      }, 1500)

    } catch (err) {
      console.error('Submit feedback failed:', err)
    }
  }

  // initialize
  onMounted(() => {
    fetchFeedbacks()
  })

  return {
    feedbacks,
    feedbackCount,
    showFeedbackModal,
    feedbackSubmitted,
    userFeedback,
    fetchFeedbacks,
    submitFeedback,
  }
}