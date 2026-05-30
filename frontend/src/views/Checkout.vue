<script setup>
import { RouterLink } from "vue-router";
import CheckoutSteps from "@/components/CheckoutSteps.vue";
import useCheckout from "@/hooks/useCheckout.js";
import { ArrowLeft } from "@lucide/vue";

const {
  step,
  submitting,
  paymentError,
  form,
  stripeReady,
  selectedItems,
  subtotal,
  formatPrice,
  getItemName,
  proceedToPayment,
  placeOrder,
} = useCheckout();
</script>

<template>
  <div class="checkout-page">
    <CheckoutSteps :current-step="step === 1 ? 'checkout' : 'payment'" />

    <div class="checkout-content">
      <!-- LEFT: Form area -->
      <div class="checkout-left">
        <!-- Step 1: Shipping -->
        <div v-if="step === 1" class="form-section">
          <h2 class="section-title">Shipping Information</h2>

          <div class="field-group">
            <label class="field-label">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="field-input"
              placeholder="Jane Smith"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Delivery Address</label>
            <input
              v-model="form.address"
              type="text"
              class="field-input"
              placeholder="123 Main Street, Apt 4B"
            />
          </div>

          <div class="field-row">
            <div class="field-group">
              <label class="field-label">City</label>
              <input
                v-model="form.city"
                type="text"
                class="field-input"
                placeholder="Kuching"
              />
            </div>
            <div class="field-group field-group-sm">
              <label class="field-label">State</label>
              <input
                v-model="form.state"
                type="text"
                class="field-input"
                placeholder="Sarawak"
              />
            </div>
            <div class="field-group field-group-sm">
              <label class="field-label">ZIP / Post Code</label>
              <input
                v-model="form.zip"
                type="text"
                class="field-input"
                placeholder="93450"
              />
            </div>
          </div>

          <button class="primary-btn" @click="proceedToPayment">
            Continue to Payment
          </button>

          <RouterLink to="/cart" class="back-link"><ArrowLeft size="13"/> Back to Cart</RouterLink>
        </div>

        <!-- Step 2: Payment -->
        <div v-if="step === 2" class="form-section">
          <h2 class="section-title">Payment</h2>

          <!-- Shipping summary -->
          <div class="shipping-summary">
            <div class="shipping-summary-label">Shipping to</div>
            <div class="shipping-summary-value">
              {{ form.name }} — {{ form.address }}, {{ form.city }},
              {{ form.state }} {{ form.zip }}
            </div>
            <button class="edit-link" @click="step = 1">Edit</button>
          </div>

          <!-- Test card hint -->
          <div class="test-hint">
            <strong>Test card:</strong> 4242 4242 4242 4242 · Any future date ·
            Any 3-digit CVC
          </div>

          <div class="field-group">
            <label class="field-label">Card Details</label>
            <div id="stripe-card-element" class="stripe-input"></div>
          </div>

          <div v-if="paymentError" class="payment-error">
            {{ paymentError }}
          </div>

          <button
            class="primary-btn"
            @click="placeOrder"
            :disabled="submitting || !stripeReady"
          >
            {{
              submitting
                ? "Processing…"
                : `Place Order · ${formatPrice(subtotal)}`
            }}
          </button>

          <button class="back-link-btn" @click="step = 1">
            <ArrowLeft size="15"/> Back to Shipping
          </button>
        </div>
      </div>

      <!-- RIGHT: Order summary -->
      <div class="checkout-summary">
        <div class="summary-header">Order Summary</div>

        <div class="summary-items">
          <div
            v-for="item in selectedItems"
            :key="item.id"
            class="summary-item"
          >
            <div class="summary-item-img-wrap">
              <img
                :src="item.preview_image || '/product/placeholder.jpg'"
                :alt="getItemName(item)"
                class="summary-item-img"
              />
              <span class="summary-item-qty">{{ item.quantity }}</span>
            </div>
            <div class="summary-item-details">
              <div class="summary-item-name">{{ getItemName(item) }}</div>
              <div class="summary-item-custom" v-if="item.is_custom">
                Custom
              </div>
            </div>
            <div class="summary-item-price">
              {{ formatPrice(item.unit_price * item.quantity) }}
            </div>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-total-row">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="summary-total-row">
          <span>Shipping</span>
          <span class="free-ship">Free</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-total-row summary-grand-total">
          <span>Total</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.checkout-page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* ── Layout ── */
.checkout-content {
  display: flex;
  gap: 2rem;
  padding: 2.5rem 5rem;
  align-items: flex-start;
}
.checkout-left {
  flex: 1;
  min-width: 0;
}
.checkout-summary {
  width: 320px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 1.5rem;
}

/* ── Form ── */
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}
.field-group {
  margin-bottom: 1.1rem;
  flex: 1;
}
.field-group-sm {
  flex: 0 0 120px;
}
.field-row {
  display: flex;
  gap: 1rem;
}
.field-label {
  display: block;
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 0.4rem;
}
.field-input {
  width: 100%;
  border: 1px solid var(--border-input);
  padding: 0.65rem 0.85rem;
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  color: var(--color-primary);
  background: var(--bg-surface);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.field-input:focus {
  border-color: var(--accent-hover);
}
.field-input::placeholder {
  color: var(--color-muted);
}

.primary-btn {
  width: 100%;
  background: var(--btn-bg);
  color: var(--btn-color);
  border: none;
  padding: 0.9rem 1rem;
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  letter-spacing: 0.07em;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.primary-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
}
.primary-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: var(--fs-sm);
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover {
  color: var(--color-primary);
}
.back-link-btn {
  display: block;
  margin-top: 0.75rem;
  font-size: var(--fs-sm);
  color: var(--color-secondary);
  background: none;
  border: none;
  font-family: var(--font-serif);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.back-link-btn:hover {
  color: var(--color-primary);
}

/* ── Shipping summary (step 2) ── */
.shipping-summary {
  background: var(--bg-page);
  border: 1px solid var(--border);
  padding: 0.9rem 1rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.shipping-summary-label {
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-secondary);
  flex-shrink: 0;
}
.shipping-summary-value {
  font-size: var(--fs-base);
  color: var(--color-primary);
  flex: 1;
}
.edit-link {
  background: none;
  border: none;
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--accent);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── Test hint ── */
.test-hint {
  background: #fff8e8;
  border: 1px solid #e8d8a0;
  padding: 0.65rem 0.9rem;
  font-size: var(--fs-sm);
  color: #5a4a00;
  margin-bottom: 1.25rem;
}

/* ── Stripe card element ── */
.stripe-input {
  border: 1px solid var(--border-input);
  padding: 0.75rem 0.85rem;
  background: var(--bg-surface);
  transition: border-color 0.2s;
}
.stripe-input:focus-within {
  border-color: var(--accent-hover);
}
.payment-error {
  font-size: var(--fs-sm);
  color: var(--color-error-2);
  background: #fff5f5;
  border: 1px solid #f5c6c6;
  padding: 0.6rem 0.9rem;
  margin-bottom: 0.75rem;
}

/* ── Order summary ── */
.summary-header {
  font-size: var(--fs-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}
.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 1rem;
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.summary-item-img-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.summary-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid var(--border);
}
.summary-item-qty {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--btn-bg);
  color: var(--btn-color);
  font-size: var(--fs-2xs);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-item-details {
  flex: 1;
  min-width: 0;
}
.summary-item-name {
  font-size: var(--fs-base);
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.summary-item-custom {
  font-size: var(--fs-2xs);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--accent);
  margin-top: 0.15rem;
}
.summary-item-price {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}
.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 0.75rem 0;
}
.summary-total-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-base);
  color: var(--color-secondary);
  margin-bottom: 0.4rem;
}
.free-ship {
  color: var(--color-free);
}
.summary-grand-total {
  font-size: var(--fs-lg);
  font-weight: 700;
  color: var(--color-primary);
}

/* ── Responsive ── */
@media (max-width: 991px) {
  .checkout-content {
    padding: 1.5rem 2.5rem;
    flex-direction: column;
  }
  .checkout-summary {
    width: 100%;
  }
}
@media (max-width: 767px) {
  .checkout-content {
    padding: 1.25rem;
  }
  .field-row {
    flex-direction: column;
  }
  .field-group-sm {
    flex: 1;
  }
}
</style>
