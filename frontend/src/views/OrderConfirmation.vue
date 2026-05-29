<script setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();
const orderId = ref(route.query.orderId || "");
const total = ref(parseFloat(route.query.total || 0));

const formatPrice = (val) => "$" + parseFloat(val || 0).toFixed(2);

const now = new Date();
const orderDate = now.toLocaleDateString("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
</script>

<template>
  <div class="confirmation-page">

    <!-- Steps indicator — all done -->
    <div class="steps-bar">
      <div class="step step-done">
        <div class="step-dot done"></div>
        <span class="step-label">Cart</span>
      </div>
      <div class="step-line done-line"></div>
      <div class="step step-done">
        <div class="step-dot done"></div>
        <span class="step-label">Checkout</span>
      </div>
      <div class="step-line done-line"></div>
      <div class="step step-done">
        <div class="step-dot done"></div>
        <span class="step-label">Payment</span>
      </div>
    </div>

    <div class="confirmation-content">

      <!-- Success icon -->
      <div class="success-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="23" stroke="#c4a882" stroke-width="2"/>
          <path d="M14 24l7 7 13-13" stroke="#c4a882" stroke-width="2.5" stroke-linecap="square"/>
        </svg>
      </div>

      <h1 class="confirmation-title">Order Confirmed</h1>
      <p class="confirmation-sub">Thank you for your purchase. Your order has been placed successfully.</p>

      <!-- Order card -->
      <div class="order-card">
        <div class="order-row">
          <span class="order-label">Order Number</span>
          <span class="order-value">#{{ orderId }}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row">
          <span class="order-label">Date</span>
          <span class="order-value">{{ orderDate }}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row">
          <span class="order-label">Total Paid</span>
          <span class="order-value order-total">{{ formatPrice(total) }}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row">
          <span class="order-label">Status</span>
          <span class="order-value order-status">Paid</span>
        </div>
      </div>

      <p class="delivery-note">
        Your order is being processed. You can view your order history in your
        <RouterLink to="/profile" class="profile-link">profile</RouterLink>.
      </p>

      <div class="cta-actions">
        <RouterLink to="/products" class="btn-primary">Continue Shopping</RouterLink>
        <RouterLink to="/profile" class="btn-secondary">View My Orders</RouterLink>
      </div>
    </div>

    <!-- Bottom CTA banner -->
    <div class="cta-banner">
      <div class="cta-text">
        <p class="cta-eyebrow">What's next?</p>
        <h3 class="cta-heading">Customize your own furniture</h3>
        <p class="cta-sub">Design a unique piece tailored to your space</p>
        <RouterLink to="/customize" class="cta-btn">Start Designing</RouterLink>
      </div>
      <div class="cta-img-wrap">
        <img src="/product/product-hero.png" alt="" class="cta-img" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.confirmation-page {
  font-family: "Times New Roman", Times, serif;
  background: #faf7f2;
  min-height: 100vh;
}

/* ── Steps ── */
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
}
.step-done .step-label { color: #2c2218; font-weight: 600; }
.step-line {
  width: 80px;
  height: 1px;
  background: #e0d5c5;
  margin: 0 0.5rem;
}
.done-line { background: #c4a882; }

/* ── Content ── */
.confirmation-content {
  max-width: 560px;
  margin: 0 auto;
  padding: 3.5rem 2rem 4rem;
  text-align: center;
}
.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.confirmation-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c2218;
  margin-bottom: 0.5rem;
}
.confirmation-sub {
  font-size: 0.9rem;
  color: #7a6a58;
  margin-bottom: 2rem;
}

/* ── Order card ── */
.order-card {
  background: #fff;
  border: 1px solid #e0d5c5;
  padding: 1.5rem;
  text-align: left;
  margin-bottom: 1.5rem;
}
.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}
.order-label {
  font-size: 0.78rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #7a6a58;
}
.order-value {
  font-size: 0.9rem;
  color: #2c2218;
}
.order-total {
  font-weight: 700;
  font-size: 1rem;
}
.order-status {
  color: #3a6b3a;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}
.order-divider {
  height: 1px;
  background: #f0ebe2;
}

.delivery-note {
  font-size: 0.82rem;
  color: #7a6a58;
  margin-bottom: 2rem;
  line-height: 1.6;
}
.profile-link {
  color: #c4a882;
  text-decoration: none;
}
.profile-link:hover { text-decoration: underline; }

/* ── CTA actions ── */
.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.btn-primary {
  display: inline-block;
  background: #2c2218;
  color: #fff;
  font-family: "Times New Roman", serif;
  font-size: 0.82rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.75rem 1.75rem;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover { background: #4a3828; }
.btn-secondary {
  display: inline-block;
  background: transparent;
  border: 1px solid #2c2218;
  color: #2c2218;
  font-family: "Times New Roman", serif;
  font-size: 0.82rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.75rem 1.75rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover { background: #2c2218; color: #fff; }

/* ── CTA Banner ── */
.cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c2218;
  margin: 0 5rem 4rem;
  overflow: hidden;
  min-height: 140px;
}
.cta-text { padding: 2rem 2.5rem; flex: 1; }
.cta-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #c4a882;
  margin-bottom: 0.35rem;
}
.cta-heading {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f0e1cc;
  margin-bottom: 0.3rem;
  line-height: 1.25;
}
.cta-sub {
  font-size: 0.75rem;
  color: #a09080;
  margin-bottom: 0.9rem;
}
.cta-btn {
  display: inline-block;
  background: #c4a882;
  color: #fff;
  font-family: "Times New Roman", serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 1.3rem;
  text-decoration: none;
  transition: background 0.2s;
}
.cta-btn:hover { background: #b8966e; }
.cta-img-wrap {
  width: 240px;
  height: 140px;
  flex-shrink: 0;
  overflow: hidden;
}
.cta-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

/* ── Dark mode ── */
[data-theme="dark"] .confirmation-page { background: #1a1610; }
[data-theme="dark"] .steps-bar { background: #1e1b14; border-bottom-color: #3a3025; }
[data-theme="dark"] .step-label { color: #6a5a4a; }
[data-theme="dark"] .step-done .step-label { color: #e8ddd0; }
[data-theme="dark"] .step-dot { background: #1a1610; border-color: #4a3a2a; }
[data-theme="dark"] .step-dot.done { background: #c4a882; border-color: #c4a882; }
[data-theme="dark"] .step-line { background: #3a3025; }
[data-theme="dark"] .done-line { background: #c4a882; }
[data-theme="dark"] .confirmation-title { color: #e8ddd0; }
[data-theme="dark"] .confirmation-sub,
[data-theme="dark"] .delivery-note { color: #9a8875; }
[data-theme="dark"] .order-card { background: #1e1b14; border-color: #3a3025; }
[data-theme="dark"] .order-label { color: #9a8875; }
[data-theme="dark"] .order-value { color: #e8ddd0; }
[data-theme="dark"] .order-divider { background: #2e2820; }
[data-theme="dark"] .btn-primary { background: #e8ddd0; color: #1a1610; }
[data-theme="dark"] .btn-primary:hover { background: #c4a882; }
[data-theme="dark"] .btn-secondary { border-color: #e8ddd0; color: #e8ddd0; }
[data-theme="dark"] .btn-secondary:hover { background: #e8ddd0; color: #1a1610; }

/* ── Responsive ── */
@media (max-width: 767px) {
  .steps-bar { padding: 1rem 1.25rem; }
  .step-line { width: 40px; }
  .confirmation-content { padding: 2.5rem 1.25rem; }
  .cta-banner { margin: 0 1.25rem 3rem; flex-direction: column; }
  .cta-img-wrap { width: 100%; height: 100px; }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .btn-primary, .btn-secondary { text-align: center; }
}
</style>
