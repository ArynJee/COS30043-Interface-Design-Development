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
.steps-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 2rem 5rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e0d5c5;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-dot {
  width: 20px;
  height: 20px;
  border: 2px solid #c8bdb0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-dot.filled {
  background: #2c2218;
  border-color: #2c2218;
}
.step-dot.done {
  background: #c4a882;
  border-color: #c4a882;
}

.step-label {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a09080;
  font-family: "Times New Roman", Times, serif;
}
.step-active .step-label,
.step-done .step-label {
  color: #2c2218;
  font-weight: 600;
}

.step-line {
  width: 80px;
  height: 1px;
  background: #e0d5c5;
  margin: 0 0.5rem;
}
.done-line {
  background: #c4a882;
}

/* ── Dark mode ── */
[data-theme="dark"] .steps-bar {
  background: #1e1b14;
  border-bottom-color: #3a3025;
}
[data-theme="dark"] .step-label { color: #6a5a4a; }
[data-theme="dark"] .step-active .step-label,
[data-theme="dark"] .step-done .step-label { color: #e8ddd0; }
[data-theme="dark"] .step-dot { background: #1a1610; border-color: #4a3a2a; }
[data-theme="dark"] .step-dot.filled { background: #e8ddd0; border-color: #e8ddd0; }
[data-theme="dark"] .step-dot.done { background: #c4a882; border-color: #c4a882; }
[data-theme="dark"] .step-line { background: #3a3025; }
[data-theme="dark"] .done-line { background: #c4a882; }

/* ── Responsive ── */
@media (max-width: 991px) {
  .steps-bar { padding: 1.5rem 2.5rem; }
}
@media (max-width: 767px) {
  .steps-bar { padding: 1rem 1.25rem; }
  .step-line { width: 40px; }
}
</style>
