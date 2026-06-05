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
        <h1 class="auth-brand-title">{{ $t('login.tagline1') }}<br />{{ $t('login.tagline2') }}<br />{{ $t('login.tagline3') }}</h1>
        <p class="auth-brand-sub">{{ $t('login.subtitle') }}</p>
      </div>
    </div>

    <!-- right form panel -->
    <div class="auth-panel">
      <div class="auth-form-wrap">
        <div class="auth-form-header">
          <span class="auth-form-eyebrow">{{ $t('login.welcome') }}</span>
          <h2 class="auth-form-title">{{ $t('login.title') }}</h2>
        </div>

        <div v-if="errors.general" class="auth-error-banner">
          {{ errors.general }}
        </div>

        <!-- email -->
        <div class="auth-field">
          <label class="auth-label">{{ $t('login.email') }}</label>
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
          <label class="auth-label">{{ $t('login.password') }}</label>
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
          <span v-if="errors.password" class="auth-field-error">{{
            errors.password
          }}</span>
        </div>

        <!-- submit -->
        <button class="auth-submit" :disabled="loading" @click="handleLogin">
          <span v-if="!loading"
            >{{ $t('login.submit') }} <ArrowRight :size="16" class="ms-1"
          /></span>
          <span v-else class="auth-spinner"></span>
        </button>

        <p class="auth-switch">
          {{ $t('login.noAccount') }}
          <router-link to="/registration" class="auth-switch-link"
            >{{ $t('login.createOne') }}</router-link
          >
        </p>
      </div>
    </div>

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
  font-size: var(--fs-xs);
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
  font-size: var(--fs-md);
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
  font-size: var(--fs-xs);
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
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 0.45rem;
}
.auth-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  font-family: var(--font-serif);
  font-size: var(--fs-md);
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
.auth-field-error {
  display: block;
  font-size: var(--fs-xs);
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
  color: var(--btn-color);
  font-family: var(--font-serif);
  font-size: var(--fs-base);
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
  font-size: var(--fs-base);
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
  font-size: var(--fs-base);
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
}

/* ── responsive ── */
@media (max-width: 900px) {
  .auth-page {
    display: flex;
    flex-direction: column;
  }
  .auth-bg {
    height: 300px;
    flex-shrink: 0;
  }
  .auth-panel {
    flex: 1;
    padding: 2.5rem 1.5rem;
  }
  .auth-brand {
    bottom: 2rem;
    left: 2rem;
  }
  .auth-brand-title {
    font-size: 2.2rem;
  }
}
</style>
