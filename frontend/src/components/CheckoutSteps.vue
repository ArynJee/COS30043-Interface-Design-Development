<script setup>
const props = defineProps({
  currentStep: {
    type: String,
    default: 'cart', // 'cart' | 'checkout' | 'payment' | 'confirmation'
  },
});

const ORDER = { cart: 0, checkout: 1, payment: 2, confirmation: 3 };

function stepClass(step) {
  if (props.currentStep === 'confirmation') return 'step-done';
  const diff = ORDER[step] - ORDER[props.currentStep];
  if (diff < 0) return 'step-done';
  if (diff === 0) return 'step-active';
  return '';
}

function dotClass(step) {
  if (props.currentStep === 'confirmation') return 'done';
  const diff = ORDER[step] - ORDER[props.currentStep];
  if (diff < 0) return 'done';
  if (diff === 0) return 'filled';
  return '';
}

function lineClass(fromStep) {
  if (props.currentStep === 'confirmation') return 'done-line';
  return ORDER[fromStep] < ORDER[props.currentStep] ? 'done-line' : '';
}
</script>

<template>
  <div class="steps-bar">
    <div class="step" :class="stepClass('cart')">
      <div class="step-dot" :class="dotClass('cart')"></div>
      <span class="step-label">Cart</span>
    </div>
    <div class="step-line" :class="lineClass('cart')"></div>
    <div class="step" :class="stepClass('checkout')">
      <div class="step-dot" :class="dotClass('checkout')"></div>
      <span class="step-label">Checkout</span>
    </div>
    <div class="step-line" :class="lineClass('checkout')"></div>
    <div class="step" :class="stepClass('payment')">
      <div class="step-dot" :class="dotClass('payment')"></div>
      <span class="step-label">Payment</span>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.steps-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 2rem 5rem 1.5rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ── Step dot ── */
.step-dot {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-input);
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Active: solid filled square */
.step-dot.filled {
  border-color: var(--color-primary);
}

/* Done: outer border + inner accent square */
.step-dot.done {
  border-color: var(--btn-bg);
  background: var(--bg-surface);
}
.step-dot.done::after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background: var(--btn-bg);
}

/* ── Step label ── */
.step-label {
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-free);
  font-family: var(--font-serif);
}
.step-active .step-label,
.step-done .step-label {
  color: var(--color-primary);
  font-weight: 600;
}

/* ── Progress line with animated fill ── */
.step-line {
  width: 80px;
  height: 1px;
  background: var(--border);
  margin: 0 0.5rem;
  position: relative;
  overflow: hidden;
}
.step-line::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: var(--accent);
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-line.done-line::after {
  width: 100%;
}

/* ── Responsive ── */
@media (max-width: 991px) {
  .steps-bar { padding: 1.5rem 2.5rem; }
}
@media (max-width: 767px) {
  .steps-bar { padding: 1rem 1.25rem; }
  .step-line { width: 40px; }
}
</style>
