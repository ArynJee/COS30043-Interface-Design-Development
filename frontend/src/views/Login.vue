<script setup>
import { RouterLink } from "vue-router";
import { Eye, EyeOff, ArrowRight } from "@lucide/vue";
import useLogin from "@/hooks/useLogin";

const {
  form,
  showPassword,
  errors,
  loading,
  handleLogin,
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
} = useLogin();
</script>

<template>
  <div class="auth-page">
    <!-- background landscape -->
    <div class="auth-bg">
      <img src="/home/living-room.jpg" alt="Interior" class="auth-bg-img" />
      <div class="auth-bg-overlay"></div>

      <!-- left branding text -->
      <div class="auth-brand">
        <span class="auth-brand-eyebrow">ComfyHome</span>
        <h1 class="auth-brand-title">Beautiful<br />Creations<br />Await.</h1>
        <p class="auth-brand-sub">
          Sign in to manage your projects,<br />
          explore collections, and craft<br />
          the furniture you've always imagined.
        </p>
      </div>
    </div>

    <!-- right form panel -->
    <div class="auth-panel">
      <div class="auth-form-wrap">
        <div class="auth-form-header">
          <span class="auth-form-eyebrow">Welcome back</span>
          <h2 class="auth-form-title">Sign In</h2>
        </div>

        <div v-if="errors.general" class="auth-error-banner">
          {{ errors.general }}
        </div>

        <!-- email -->
        <div class="auth-field">
          <label class="auth-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="auth-input"
            :class="{ 'auth-input-error': errors.email }"
            placeholder="you@example.com"
            @keyup.enter="handleLogin"
          />
          <span v-if="errors.email" class="auth-field-error">{{
            errors.email
          }}</span>
        </div>

        <!-- password -->
        <div class="auth-field">
          <div class="auth-label-row">
            <label class="auth-label">Password</label>
          </div>
          <div class="auth-input-wrap">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="auth-input auth-input-pw"
              :class="{ 'auth-input-error': errors.password }"
              placeholder="••••••••"
              @keyup.enter="handleLogin"
            />
            <button
              type="button"
              class="pw-toggle"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
          <div class="auth-forgot-row">
            <button
              type="button"
              class="auth-forgot-link"
              @click="openForgotPassword"
            >
              Forgot password?
            </button>
          </div>
          <span v-if="errors.password" class="auth-field-error">{{
            errors.password
          }}</span>
        </div>

        <!-- submit -->
        <button class="auth-submit" :disabled="loading" @click="handleLogin">
          <span v-if="!loading"
            >Sign In <ArrowRight :size="16" class="ms-1"
          /></span>
          <span v-else class="auth-spinner"></span>
        </button>

        <p class="auth-switch">
          Don't have an account?
          <router-link to="/registration" class="auth-switch-link"
            >Create one</router-link
          >
        </p>
      </div>
    </div>

    <!-- ── Forgot Password Modals ── -->
    <Teleport to="body">
      <Transition name="fp-fade">
        <div v-if="fpStep" class="fp-backdrop" @click.self="closeFpModal">
          <div class="fp-modal">
            <!-- close -->
            <button class="fp-close" @click="closeFpModal">✕</button>

            <!-- STEP 1: Email -->
            <template v-if="fpStep === 'email'">
              <span class="fp-eyebrow">Reset Password</span>
              <h3 class="fp-title">Enter Your Email</h3>
              <p class="fp-body">
                We'll send a one-time code to your registered email address.
              </p>
              <div class="auth-field">
                <label class="auth-label">Email</label>
                <input
                  v-model="fpEmail"
                  type="email"
                  class="auth-input"
                  :class="{ 'auth-input-error': fpEmailError }"
                  placeholder="you@example.com"
                  @keyup.enter="sendOtp"
                />
                <span v-if="fpEmailError" class="auth-field-error">{{
                  fpEmailError
                }}</span>
              </div>
              <button
                class="auth-submit"
                :disabled="fpLoading"
                @click="sendOtp"
              >
                <span v-if="!fpLoading"
                  >Send OTP <ArrowRight :size="15" class="ms-1"
                /></span>
                <span v-else class="auth-spinner"></span>
              </button>
            </template>

            <!-- STEP 2: OTP -->
            <template v-if="fpStep === 'otp'">
              <span class="fp-eyebrow">Verify OTP</span>
              <h3 class="fp-title">Enter OTP Code</h3>
              <p class="fp-body">
                A code was sent to <strong>{{ fpEmail }}</strong
                >. Please check your inbox.
              </p>
              <div class="auth-field">
                <label class="auth-label">OTP Code</label>
                <input
                  v-model="fpOtp"
                  type="text"
                  inputmode="numeric"
                  maxlength="6"
                  class="auth-input otp-input"
                  :class="{ 'auth-input-error': fpOtpError }"
                  placeholder="• • • • • •"
                  @keyup.enter="verifyOtp"
                />
                <span v-if="fpOtpError" class="auth-field-error">{{
                  fpOtpError
                }}</span>
              </div>
              <button
                class="auth-submit"
                :disabled="fpLoading"
                @click="verifyOtp"
              >
                <span v-if="!fpLoading"
                  >Verify <ArrowRight :size="15" class="ms-1"
                /></span>
                <span v-else class="auth-spinner"></span>
              </button>
              <div class="fp-resend">
                <button
                  class="fp-resend-link"
                  :disabled="resendCooldown > 0 || fpLoading"
                  @click="resendOtp"
                >
                  {{
                    resendCooldown > 0
                      ? `Resend OTP (${resendCooldown}s)`
                      : "Resend OTP"
                  }}
                </button>
              </div>
            </template>

            <!-- STEP 3: New Password -->
            <template v-if="fpStep === 'reset'">
              <span class="fp-eyebrow">New Password</span>
              <h3 class="fp-title">Set New Password</h3>
              <p class="fp-body">Choose a strong password for your account.</p>
              <div class="auth-field">
                <label class="auth-label">New Password</label>
                <div class="auth-input-wrap">
                  <input
                    v-model="fpNewPassword"
                    :type="showNewPw ? 'text' : 'password'"
                    class="auth-input auth-input-pw"
                    :class="{ 'auth-input-error': fpPasswordError }"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    class="pw-toggle"
                    @click="showNewPw = !showNewPw"
                  >
                    <EyeOff v-if="showNewPw" :size="16" /><Eye
                      v-else
                      :size="16"
                    />
                  </button>
                </div>
                <span v-if="fpPasswordError" class="auth-field-error">{{
                  fpPasswordError
                }}</span>
              </div>
              <div class="auth-field">
                <label class="auth-label">Confirm Password</label>
                <div class="auth-input-wrap">
                  <input
                    v-model="fpConfirmPassword"
                    :type="showConfirmPw ? 'text' : 'password'"
                    class="auth-input auth-input-pw"
                    :class="{ 'auth-input-error': fpConfirmError }"
                    placeholder="••••••••"
                    @keyup.enter="resetPassword"
                  />
                  <button
                    type="button"
                    class="pw-toggle"
                    @click="showConfirmPw = !showConfirmPw"
                  >
                    <EyeOff v-if="showConfirmPw" :size="16" /><Eye
                      v-else
                      :size="16"
                    />
                  </button>
                </div>
                <span v-if="fpConfirmError" class="auth-field-error">{{
                  fpConfirmError
                }}</span>
              </div>
              <button
                class="auth-submit"
                :disabled="fpLoading"
                @click="resetPassword"
              >
                <span v-if="!fpLoading"
                  >Reset Password <ArrowRight :size="15" class="ms-1"
                /></span>
                <span v-else class="auth-spinner"></span>
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

/* ── layout ── */
.auth-page {
  display: grid;
  grid-template-columns: 1fr 480px;
  min-height: 100vh;
  background: #1e1a14;
}

/* ── background left ── */
.auth-bg {
  position: relative;
  overflow: hidden;
}
.auth-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.75);
}
.auth-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 26, 20, 0.6) 0%,
    rgba(30, 26, 20, 0.15) 60%,
    rgba(30, 26, 20, 0.5) 100%
  );
}
.auth-brand {
  position: absolute;
  bottom: 3.5rem;
  left: 3.5rem;
  z-index: 2;
  color: #fff;
}
.auth-brand-eyebrow {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #c4a882;
  margin-bottom: 1rem;
}
.auth-brand-title {
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: 1.25rem;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.3);
}
.auth-brand-sub {
  font-size: 0.92rem;
  line-height: 1.75;
  opacity: 0.78;
  margin: 0;
}

/* ── right form panel ── */
.auth-panel {
  background: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
}
.auth-form-wrap {
  width: 100%;
  max-width: 360px;
}
.auth-form-header {
  margin-bottom: 2rem;
}
.auth-form-eyebrow {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
}
.auth-form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

/* ── fields ── */
.auth-field {
  margin-bottom: 1.25rem;
}
.auth-label {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 0.45rem;
}
.auth-label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.45rem;
}
.auth-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  font-family: var(--font-serif);
  font-size: 0.92rem;
  color: var(--color-primary);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.auth-input::placeholder {
  color: var(--color-muted);
}
.auth-input:focus {
  border-color: var(--accent);
}
.auth-input-error {
  border-color: var(--color-error) !important;
}

.auth-input-wrap {
  position: relative;
}
.auth-input-pw {
  padding-right: 2.75rem;
}
.pw-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  padding: 0;
  display: flex;
  align-items: center;
}
.pw-toggle:hover {
  color: var(--color-primary);
}
.auth-forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.4rem;
}
.auth-forgot-link {
  background: none;
  border: none;
  font-family: var(--font-serif);
  font-size: 0.78rem;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.auth-forgot-link:hover {
  color: var(--accent);
}
.auth-field-error {
  display: block;
  font-size: 0.74rem;
  color: var(--color-error);
  margin-top: 0.35rem;
}

/* ── submit ── */
.auth-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: var(--btn-alt-bg);
  color: #ffffff;
  font-family: var(--font-serif);
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 0.25s;
  margin-top: 0.5rem;
}
.auth-submit:hover:not(:disabled) {
  background: var(--accent);
}
.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* spinner */
.auth-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── switch link ── */
.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.82rem;
  color: var(--color-secondary);
}
.auth-switch-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--accent);
  transition: color 0.2s;
}
.auth-switch-link:hover {
  color: var(--accent);
}

/* error banner */
.auth-error-banner {
  background: #fdf0ee;
  border: 1px solid #e8c4bc;
  color: var(--color-error);
  font-size: 0.82rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
}

/* ── Forgot Password Modal ── */
.fp-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 26, 20, 0.65);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.fp-modal {
  background: var(--bg-page);
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  position: relative;
}
.fp-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--color-secondary);
  cursor: pointer;
  transition: color 0.2s;
  font-family: var(--font-serif);
}
.fp-close:hover {
  color: var(--color-primary);
}
.fp-eyebrow {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.4rem;
}
.fp-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 0.75rem;
}
.fp-body {
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
}
.fp-resend {
  text-align: center;
  margin-top: 1rem;
}
.fp-resend-link {
  background: none;
  border: none;
  font-family: "Times New Roman", serif;
  font-size: 0.8rem;
  color: #7a6a58;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  padding: 0;
}
.fp-resend-link:hover:not(:disabled) {
  color: #c4a882;
}
.fp-resend-link:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.otp-input {
  font-size: 1.3rem;
  letter-spacing: 0.4em;
  text-align: center;
}

/* modal transition */
.fp-fade-enter-active,
.fp-fade-leave-active {
  transition: opacity 0.25s ease;
}
.fp-fade-enter-from,
.fp-fade-leave-to {
  opacity: 0;
}

/* ── responsive ── */
@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
  .auth-bg {
    min-height: 260px;
    max-height: 320px;
  }
  .auth-brand {
    bottom: 2rem;
    left: 2rem;
  }
  .auth-brand-title {
    font-size: 2.2rem;
  }
  .auth-panel {
    padding: 2.5rem 1.5rem;
  }
}
</style>
