import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '@/services/loginServices'

export default function useLogin() {
  const router = useRouter()

  const form = reactive({ email: '', password: '' })
  const showPassword = ref(false)
  const errors = reactive({ email: '', password: '', general: '' })
  const loading = ref(false)

  const validateLogin = () => {
    errors.email = ''
    errors.password = ''
    errors.general = ''
    let valid = true
    if (!form.email) {
      errors.email = 'Email is required.'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email.'
      valid = false
    }
    if (!form.password) {
      errors.password = 'Password is required.'
      valid = false
    }
    return valid
  }

  const handleLogin = async () => {
    if (!validateLogin()) return
    loading.value = true
    try {
      const data = await loginApi(form)
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (err) {
      errors.general = err.response?.data?.message || 'Invalid email or password.'
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    showPassword,
    errors,
    loading,
    validateLogin,
    handleLogin,
  }
}
