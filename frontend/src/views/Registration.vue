<script setup>
import { RouterLink } from 'vue-router'
import { Eye, EyeOff, ArrowRight } from '@lucide/vue'
import useRegistration from '@/hooks/useRegistration'

const { form, errors, showPassword, showConfirm, loading, handleRegister } = useRegistration()
</script>

<template>
  <div class="auth-page">
    <!-- background landscape left -->
    <div class="auth-bg">
      <img src="/home/couch.jpg" alt="Interior" class="auth-bg-img" />
      <div class="auth-bg-overlay"></div>

      <div class="auth-brand">
        <span class="auth-brand-eyebrow">ComfyHome</span>
        <h1 class="auth-brand-title">{{ $t('register.tagline1') }}<br />{{ $t('register.tagline2') }}<br />{{ $t('register.tagline3') }}</h1>
        <p class="auth-brand-sub">{{ $t('register.subtitle') }}</p>
      </div>
    </div>

    <!-- right form panel -->
    <div class="auth-panel">
      <div class="auth-form-wrap">
        <div class="auth-form-header">
          <span class="auth-form-eyebrow">{{ $t('register.started') }}</span>
          <h2 class="auth-form-title">{{ $t('register.title') }}</h2>
        </div>

        <div v-if="errors.general" class="auth-error-banner">{{ errors.general }}</div>

        <!-- Name row -->
        <div class="auth-row">
          <div class="auth-field">
            <label class="auth-label">{{ $t('register.firstName') }}</label>
            <input
              v-model="form.firstName"
              type="text"
              class="auth-input"
              :class="{ 'auth-input-error': errors.firstName }"
              placeholder="Jane"
            />
            <span v-if="errors.firstName" class="auth-field-error">{{ errors.firstName }}</span>
          </div>
          <div class="auth-field">
            <label class="auth-label">{{ $t('register.lastName') }}</label>
            <input
              v-model="form.lastName"
              type="text"
              class="auth-input"
              :class="{ 'auth-input-error': errors.lastName }"
              placeholder="Doe"
            />
            <span v-if="errors.lastName" class="auth-field-error">{{ errors.lastName }}</span>
          </div>
        </div>

        <!-- Email -->
        <div class="auth-field">
          <label class="auth-label">{{ $t('register.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            class="auth-input"
            :class="{ 'auth-input-error': errors.email }"
            placeholder="you@example.com"
          />
          <span v-if="errors.email" class="auth-field-error">{{ errors.email }}</span>
        </div>

        <!-- Phone -->
        <div class="auth-field">
          <label class="auth-label">{{ $t('register.phone') }}</label>
          <input
            v-model="form.phone"
            type="tel"
            class="auth-input"
            :class="{ 'auth-input-error': errors.phone }"
            placeholder="+60 12-345 6789"
          />
          <span v-if="errors.phone" class="auth-field-error">{{ errors.phone }}</span>
        </div>

        <!-- Address -->
        <div class="auth-field">
          <label class="auth-label">{{ $t('register.address') }}</label>
          <input
            v-model="form.address"
            type="text"
            class="auth-input"
            :class="{ 'auth-input-error': errors.address }"
            placeholder="123 Jalan Bukit, Kuching, Sarawak"
          />
          <span v-if="errors.address" class="auth-field-error">{{ errors.address }}</span>
        </div>

        <!-- Password row -->
        <div class="auth-row">
          <div class="auth-field">
            <label class="auth-label">{{ $t('register.password') }}</label>
            <div class="auth-input-wrap">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="auth-input auth-input-pw"
                :class="{ 'auth-input-error': errors.password }"
                placeholder="••••••••"
              />
              <button type="button" class="pw-toggle" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="15" /><Eye v-else :size="15" />
              </button>
            </div>
            <span v-if="errors.password" class="auth-field-error">{{ errors.password }}</span>
          </div>
          <div class="auth-field">
            <label class="auth-label">{{ $t('register.confirm') }}</label>
            <div class="auth-input-wrap">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="auth-input auth-input-pw"
                :class="{ 'auth-input-error': errors.confirmPassword }"
                placeholder="••••••••"
                @keyup.enter="handleRegister"
              />
              <button type="button" class="pw-toggle" @click="showConfirm = !showConfirm">
                <EyeOff v-if="showConfirm" :size="15" /><Eye v-else :size="15" />
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="auth-field-error">{{
              errors.confirmPassword
            }}</span>
          </div>
        </div>

        <!-- password hint -->
        <p class="auth-pw-hint">{{ $t('register.passwordHint') }}</p>

        <!-- submit -->
        <button class="auth-submit" :disabled="loading" @click="handleRegister">
          <span v-if="!loading">{{ $t('register.submit') }} <ArrowRight :size="16" class="ms-1" /></span>
          <span v-else class="auth-spinner"></span>
        </button>

        <p class="auth-switch">
          {{ $t('register.hasAccount') }}
          <router-link to="/login" class="auth-switch-link">{{ $t('register.signIn') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/styles/main.css';

/* ── layout ── */
.auth-page {
  display: grid;
  grid-template-columns: 1fr 520px;
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
  filter: brightness(0.72);
}
.auth-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 26, 20, 0.6) 0%,
    rgba(30, 26, 20, 0.15) 60%,
    rgba(30, 26, 20, 0.55) 100%
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
  font-size: clamp(2.5rem, 4.5vw, 4rem);
  font-weight: 700;
  line-height: 1.08;
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
.auth-panel { background: var(--bg-page); display: flex; align-items: center; justify-content: center; padding: 2.5rem 2.5rem; overflow-y: auto; }
.auth-form-wrap { width: 100%; max-width: 420px; padding: 0.5rem 0; }
.auth-form-header { margin-bottom: 1.75rem; }
.auth-form-eyebrow { display: block; font-size: var(--fs-xs); letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem; }
.auth-form-title { font-size: 2rem; font-weight: 700; color: var(--color-primary); margin: 0; }

/* ── fields ── */
.auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
.auth-field { margin-bottom: 1rem; }
.auth-label { display: block; font-size: var(--fs-xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-secondary); margin-bottom: 0.4rem; }
.auth-input { width: 100%; padding: 0.65rem 0.9rem; border: 1px solid var(--border); background: var(--bg-surface); font-family: var(--font-serif); font-size: var(--fs-md); color: var(--color-primary); outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.auth-input::placeholder { color: var(--color-muted); }
.auth-input:focus { border-color: var(--accent); }
.auth-input-error { border-color: var(--color-error) !important; }
.auth-input-wrap { position: relative; }
.auth-input-pw { padding-right: 2.75rem; }
.pw-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--color-secondary); padding: 0; display: flex; align-items: center; }
.pw-toggle:hover { color: var(--color-primary); }
.auth-field-error { display: block; font-size: var(--fs-xs); color: var(--color-error); margin-top: 0.3rem; }
.auth-pw-hint { font-size: var(--fs-xs); color: var(--color-muted); margin: -0.25rem 0 1rem; line-height: 1.5; }

/* ── submit ── */
.auth-submit { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 0.85rem 1.5rem; background: var(--btn-alt-bg); color: #ffffff; font-family: var(--font-serif); font-size: var(--fs-base); letter-spacing: 0.12em; text-transform: uppercase; border: none; cursor: pointer; transition: background 0.25s; margin-top: 0.25rem; }
.auth-submit:hover:not(:disabled) { background: var(--accent); }
.auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
.auth-switch { text-align: center; margin-top: 1.25rem; font-size: var(--fs-base); color: var(--color-secondary); }
.auth-switch-link { color: var(--color-primary); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; text-decoration-color: var(--accent); transition: color 0.2s; }
.auth-switch-link:hover { color: var(--accent); }
.auth-error-banner { background: #fdf0ee; border: 1px solid #e8c4bc; color: var(--color-error); font-size: var(--fs-base); padding: 0.75rem 1rem; margin-bottom: 1.25rem; }

/* ── responsive ── */
@media (max-width: 960px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
  .auth-bg {
    min-height: 220px;
    max-height: 280px;
  }
  .auth-brand {
    bottom: 1.75rem;
    left: 2rem;
  }
  .auth-brand-title {
    font-size: 2rem;
  }
  .auth-panel {
    padding: 2rem 1.5rem;
  }
}
@media (max-width: 480px) {
  .auth-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
