import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi, sendOtpApi, verifyOtpApi, resetPasswordApi } from '@/services/loginServices'

export default function useLogin() {
  const router = useRouter()

  // ── Login Form State ──
  const form = reactive({ email: '', password: '' })
  const showPassword = ref(false)
  const errors = reactive({ email: '', password: '', general: '' })
  const loading = ref(false)

  // ── Login Validation & Handler ──
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
      router.push('/')
    } catch (err) {
      errors.general = err.response?.data?.message || 'Invalid email or password.'
    } finally {
      loading.value = false
    }
  }

  // ── Forgot Password Modal State ──
  const fpStep = ref(null) // 'email' | 'otp' | 'reset' | null
  const fpEmail = ref('')
  const fpEmailError = ref('')
  const fpOtp = ref('')
  const fpOtpError = ref('')
  const fpNewPassword = ref('')
  const fpConfirmPassword = ref('')
  const fpPasswordError = ref('')
  const fpConfirmError = ref('')
  const showNewPw = ref(false)
  const showConfirmPw = ref(false)
  const fpLoading = ref(false)
  const resendCooldown = ref(0)

  // ── Forgot Password Handlers ──
  const openForgotPassword = () => {
    fpStep.value = 'email'
    fpEmail.value = ''
    fpEmailError.value = ''
  }

  const closeFpModal = () => {
    fpStep.value = null
  }

  const startResendCooldown = () => {
    resendCooldown.value = 60
    const t = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) clearInterval(t)
    }, 1000)
  }

  const sendOtp = async () => {
    fpEmailError.value = ''
    if (!fpEmail.value) {
      fpEmailError.value = 'Email is required.'
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail.value)) {
      fpEmailError.value = 'Enter a valid email.'
      return
    }
    fpLoading.value = true
    try {
      await sendOtpApi(fpEmail.value)
      fpStep.value = 'otp'
      fpOtp.value = ''
      fpOtpError.value = ''
      startResendCooldown()
    } catch (err) {
      fpEmailError.value = err.response?.data?.message || 'Failed to send OTP.'
    } finally {
      fpLoading.value = false
    }
  }

  const resendOtp = async () => {
    if (resendCooldown.value > 0) return
    fpLoading.value = true
    try {
      await sendOtpApi(fpEmail.value)
      startResendCooldown()
      fpOtpError.value = ''
    } catch (err) {
      fpOtpError.value = 'Failed to resend OTP.'
    } finally {
      fpLoading.value = false
    }
  }

  const verifyOtp = async () => {
    fpOtpError.value = ''
    if (!fpOtp.value || fpOtp.value.length < 4) {
      fpOtpError.value = 'Please enter the OTP code.'
      return
    }
    fpLoading.value = true
    try {
      await verifyOtpApi(fpEmail.value, fpOtp.value)
      fpStep.value = 'reset'
      fpNewPassword.value = ''
      fpConfirmPassword.value = ''
    } catch (err) {
      fpOtpError.value = 'OTP code is wrong. Please request for a new OTP code.'
    } finally {
      fpLoading.value = false
    }
  }

  const resetPassword = async () => {
    fpPasswordError.value = ''
    fpConfirmError.value = ''
    let valid = true
    if (!fpNewPassword.value || fpNewPassword.value.length < 8) {
      fpPasswordError.value = 'Password must be at least 8 characters.'
      valid = false
    }
    if (fpConfirmPassword.value !== fpNewPassword.value) {
      fpConfirmError.value = 'Passwords do not match.'
      valid = false
    }
    if (!valid) return
    fpLoading.value = true
    try {
      await resetPasswordApi(fpEmail.value, fpOtp.value, fpNewPassword.value)
      fpStep.value = null
    } catch (err) {
      fpPasswordError.value = err.response?.data?.message || 'Failed to reset password.'
    } finally {
      fpLoading.value = false
    }
  }

  return {
    // Login
    form,
    showPassword,
    errors,
    loading,
    validateLogin,
    handleLogin,
    // Forgot Password
    fpStep,
    fpEmail,
    fpEmailError,
    fpOtp,
    fpOtpError,
    fpNewPassword,
    fpConfirmPassword,
    fpPasswordError,
    fpConfirmError,
    showNewPw,
    showConfirmPw,
    fpLoading,
    resendCooldown,
    openForgotPassword,
    closeFpModal,
    sendOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
  }
}
