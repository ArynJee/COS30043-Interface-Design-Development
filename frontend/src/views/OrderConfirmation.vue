<script setup>
import { RouterLink } from "vue-router";
import CheckoutSteps from "@/components/CheckoutSteps.vue";
import CtaBanner from "@/components/CtaBanner.vue";
import useOrderConfirmation from "@/hooks/useOrderConfirmation.js";
import { CircleCheckBig } from "@lucide/vue";

const { orderId, total, formatPrice, orderDate } = useOrderConfirmation();
</script>

<template>
  <div class="confirmation-page">
    <CheckoutSteps current-step="confirmation" />

    <div class="confirmation-content mx-auto my-0 py-5 px-3 text-center">
      <!-- success icon -->
      <div class="success-icon d-flex justify-content-center mb-4">
        <CircleCheckBig size="50" />
      </div>

      <h1 class="confirmation-title fw-bold mb-2 fs-2">Order Confirmed</h1>
      <p class="confirmation-sub mb-4">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      <!-- order card -->
      <div class="order-card p-3 text-left mb-3">
        <div class="order-row d-flex justify-content-between align-items-center px-2 py-2">
          <span class="order-label text-uppercase">Order Number</span>
          <span class="order-value">#{{ orderId }}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row  d-flex justify-content-between align-items-center px-2 py-2">
          <span class="order-label text-uppercase">Date</span>
          <span class="order-value">{{ orderDate }}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row  d-flex justify-content-between align-items-center px-2 py-2">
          <span class="order-label text-uppercase">Total Paid</span>
          <span class="order-value order-total fw-bold">{{ formatPrice(total) }}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row  d-flex justify-content-between align-items-center px-2 py-2">
          <span class="order-label text-uppercase">Status</span>
          <span class="order-value order-status fw-bold text-uppercase">Paid</span>
        </div>
      </div>

      <p class="delivery-note my-4">
        Your order is being processed. You can view your order history in your
        <RouterLink to="/profile" class="profile-link text-decoration-none">profile</RouterLink>.
      </p>

      <div class="cta-actions d-flex justify-content-center gap-3">
        <RouterLink to="/products" class="btn-primary d-inline-block text-uppercase text-decoration-none px-4 py-3"
          >Continue Shopping</RouterLink
        >
        <RouterLink to="/profile" class="btn-secondary d-inline-block text-uppercase text-decoration-none px-4 py-3"
          >View My Orders</RouterLink
        >
      </div>
    </div>

    <CtaBanner
      eyebrow="Keep Exploring"
      title="Discover our full<br>collection"
      body="Browse hundreds of handcrafted furniture pieces for every room — or design something entirely your own."
      pill="Shop Now!"
      link-to="/products"
      aria-label="Go to Products"
    />

    <div class="cb-bridge"></div>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.confirmation-page {
  background: var(--bg-page);
  min-height: 100vh;
}
.confirmation-content {
  max-width: 560px;
}
.success-icon{
  color: var(--accent-dk);
}
.confirmation-title {
  color: var(--color-primary);
}
.confirmation-sub {
  font-size: var(--fs-md);
  color: var(--color-secondary);
}
.order-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
}
.order-label {
  font-size: var(--fs-sm);
  letter-spacing: 0.07em;
  color: var(--color-secondary);
}
.order-value {
  font-size: var(--fs-md);
  color: var(--color-primary);
}
.order-total {
  font-size: var(--fs-lg);
}
.order-status {
  color: var(--color-secondary);
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
}
.order-divider {
  height: 1px;
  background: var(--border-light);
}

.delivery-note {
  font-size: var(--fs-base);
  color: var(--color-secondary);
  line-height: 1.6;
}
.profile-link {
  color: var(--accent);
}
.profile-link:hover {
  text-decoration: underline !important;
}

/* CTA actions — styled to match Customize page buttons */
.btn-primary {
  background: #2c2218;
  color: #f0ebe2;
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  letter-spacing: 0.07em;
  transition: background 0.18s;
}
.btn-primary:hover {
  background: #3d3024;
}
[data-theme="dark"] .btn-primary {
  background: var(--btn-bg);
  color: var(--btn-color);
}
[data-theme="dark"] .btn-primary:hover {
  background: var(--btn-bg-hover);
}

.btn-secondary {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  letter-spacing: 0.07em;
  transition: background 0.18s, border-color 0.18s;
}

[data-theme="dark"] .btn-secondary {
  border-color: var(--color-subtle);
  background: var(--bg-alt);
}

.btn-secondary:hover {
  background: var(--cu-hover);
  border-color: var(--cu-accent);
}

.cb-bridge {
  background: var(--bg-page);
  height: 5rem;
}

/* ── responsive ── */
@media (max-width: 767px) {
  .confirmation-content {
    padding: 2.5rem 1.25rem;
  }
  .cta-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-primary,
  .btn-secondary {
    text-align: center;
  }
}
</style>
