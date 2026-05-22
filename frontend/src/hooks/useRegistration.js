import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { registerApi } from '@/services/registrationServices'

export default function useRegistration() {
  const router = useRouter()

  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })

  const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    general: '',
  })

  const showPassword = ref(false)
  const showConfirm = ref(false)
  const loading = ref(false)

  const validate = () => {
    let valid = true
    Object.keys(errors).forEach((k) => (errors[k] = ''))

    if (!form.firstName.trim()) {
      errors.firstName = 'First name is required.'
      valid = false
    }
    if (!form.lastName.trim()) {
      errors.lastName = 'Last name is required.'
      valid = false
    }

    if (!form.email) {
      errors.email = 'Email is required.'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email.'
      valid = false
    }

    if (!form.phone) {
      errors.phone = 'Phone number is required.'
      valid = false
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) {
      errors.phone = 'Enter a valid phone number.'
      valid = false
    }

    if (!form.address.trim()) {
      errors.address = 'Address is required.'
      valid = false
    }

    if (!form.password) {
      errors.password = 'Password is required.'
      valid = false
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.'
      valid = false
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errors.password = 'Include at least one uppercase letter and one number.'
      valid = false
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.'
      valid = false
    } else if (form.confirmPassword !== form.password) {
      errors.confirmPassword = 'Passwords do not match.'
      valid = false
    }

    return valid
  }

  const handleRegister = async () => {
    if (!validate()) return
    loading.value = true
    try {
      await registerApi({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
      })
      router.push('/login')
    } catch (err) {
      errors.general = err.response?.data?.message || 'Registration failed. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    errors,
    showPassword,
    showConfirm,
    loading,
    validate,
    handleRegister,
  }
}
