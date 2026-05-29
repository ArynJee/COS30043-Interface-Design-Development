<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, RouterLink } from "vue-router";
import CheckoutSteps from "@/components/CheckoutSteps.vue";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/stores/cart";
import { createPaymentIntentApi, confirmOrderApi } from "@/services/orderServices";
import axios from "axios";

const router = useRouter();
const cartStore = useCartStore();

// Steps: 1 = shipping, 2 = payment
const step = ref(1);
const submitting = ref(false);
const paymentError = ref("");

// Shipping form
const form = ref({
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
});

// Stripe
let stripe = null;
let cardElement = null;
const stripeReady = ref(false);

const formatPrice = (val) => "$" + parseFloat(val || 0).toFixed(2);

const selectedItems = computed(() => cartStore.selectedItems);
const subtotal = computed(() => cartStore.subtotal);
const selectedIds = computed(() => cartStore.selectedIds);

function validateShipping() {
  const { name, address, city, state, zip } = form.value;
  if (!name.trim() || !address.trim() || !city.trim() || !state.trim() || !zip.trim()) {
    return "Please fill in all shipping fields.";
  }
  return null;
}

async function proceedToPayment() {
  const err = validateShipping();
  if (err) { alert(err); return; }
  step.value = 2;
  await nextTick();
  await initStripe();
}

async function initStripe() {
  try {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    const elements = stripe.elements({
      fonts: [{ cssSrc: "" }],
    });
    cardElement = elements.create("card", {
      style: {
        base: {
          fontFamily: "'Times New Roman', serif",
          fontSize: "14px",
          color: "#2c2218",
          "::placeholder": { color: "#b8aaa0" },
        },
        invalid: { color: "#c0392b" },
      },
      hidePostalCode: true,
    });
    cardElement.mount("#stripe-card-element");
    stripeReady.value = true;
  } catch (e) {
    paymentError.value = "Failed to load payment form. Check your Stripe publishable key.";
    console.error(e);
  }
}

async function placeOrder() {
  if (!stripe || !cardElement) return;
  submitting.value = true;
  paymentError.value = "";

  try {
    // 1. Create payment intent on backend
    const piRes = await createPaymentIntentApi(selectedIds.value);
    const { clientSecret, paymentIntentId } = piRes.data;

    // 2. Confirm card payment with Stripe.js
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: form.value.name },
      },
    });

    if (error) {
      paymentError.value = error.message;
      submitting.value = false;
      return;
    }

    if (paymentIntent.status !== "succeeded") {
      paymentError.value = "Payment was not completed. Please try again.";
      submitting.value = false;
      return;
    }

    // 3. Confirm order on backend (creates order record + clears cart items)
    const orderRes = await confirmOrderApi(paymentIntentId, selectedIds.value, form.value);
    const { order } = orderRes.data;

    // Refresh cart store (selected items were removed)
    await cartStore.fetchCart();

    // 4. Redirect to confirmation
    router.push(`/order-confirmation?orderId=${order.id}&total=${order.total}`);
  } catch (err) {
    paymentError.value = err.response?.data?.message || "Something went wrong. Please try again.";
    submitting.value = false;
  }
}

// Pre-fill shipping from user profile
async function prefillFromProfile() {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await axios.get("http://localhost:3000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const u = res.data;
    if (u.first_name) form.value.name = `${u.first_name} ${u.last_name}`.trim();
    if (u.address) form.value.address = u.address;
  } catch (e) {
    // silently ignore
  }
}

function getItemName(item) {
  if (item.is_custom) {
    return (item.furniture_type || "Custom Item")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return item.item_name || "Product";
}

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    router.push("/login");
    return;
  }
  if (cartStore.selectedIds.length === 0) {
    router.push("/cart");
    return;
  }
  await prefillFromProfile();
});
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
            <input v-model="form.name" type="text" class="field-input" placeholder="Jane Smith" />
          </div>

          <div class="field-group">
            <label class="field-label">Delivery Address</label>
            <input v-model="form.address" type="text" class="field-input" placeholder="123 Main Street, Apt 4B" />
          </div>

          <div class="field-row">
            <div class="field-group">
              <label class="field-label">City</label>
              <input v-model="form.city" type="text" class="field-input" placeholder="Melbourne" />
            </div>
            <div class="field-group field-group-sm">
              <label class="field-label">State</label>
              <input v-model="form.state" type="text" class="field-input" placeholder="VIC" />
            </div>
            <div class="field-group field-group-sm">
              <label class="field-label">ZIP / Post Code</label>
              <input v-model="form.zip" type="text" class="field-input" placeholder="3000" />
            </div>
          </div>

          <button class="primary-btn" @click="proceedToPayment">
            Continue to Payment
          </button>

          <RouterLink to="/cart" class="back-link">← Back to Cart</RouterLink>
        </div>

        <!-- Step 2: Payment -->
        <div v-if="step === 2" class="form-section">
          <h2 class="section-title">Payment</h2>

          <!-- Shipping summary -->
          <div class="shipping-summary">
            <div class="shipping-summary-label">Shipping to</div>
            <div class="shipping-summary-value">
              {{ form.name }} — {{ form.address }}, {{ form.city }}, {{ form.state }} {{ form.zip }}
            </div>
            <button class="edit-link" @click="step = 1">Edit</button>
          </div>

          <!-- Test card hint -->
          <div class="test-hint">
            <strong>Test card:</strong> 4242 4242 4242 4242 · Any future date · Any 3-digit CVC
          </div>

          <div class="field-group">
            <label class="field-label">Card Details</label>
            <div id="stripe-card-element" class="stripe-input"></div>
          </div>

          <div v-if="paymentError" class="payment-error">{{ paymentError }}</div>

          <button class="primary-btn" @click="placeOrder" :disabled="submitting || !stripeReady">
            {{ submitting ? "Processing…" : `Place Order · ${formatPrice(subtotal)}` }}
          </button>

          <button class="back-link-btn" @click="step = 1">← Back to Shipping</button>
        </div>
      </div>

      <!-- RIGHT: Order summary -->
      <div class="checkout-summary">
        <div class="summary-header">Order Summary</div>

        <div class="summary-items">
          <div v-for="item in selectedItems" :key="item.id" class="summary-item">
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
              <div class="summary-item-custom" v-if="item.is_custom">Custom</div>
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
.checkout-page {
  font-family: "Times New Roman", Times, serif;
  background: #faf7f2;
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
  background: #fff;
  border: 1px solid #e0d5c5;
  padding: 1.5rem;
}

/* ── Form ── */
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c2218;
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
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7a6a58;
  margin-bottom: 0.4rem;
}
.field-input {
  width: 100%;
  border: 1px solid #d0c5b5;
  padding: 0.65rem 0.85rem;
  font-family: "Times New Roman", serif;
  font-size: 0.88rem;
  color: #2c2218;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.field-input:focus {
  border-color: #b09070;
}
.field-input::placeholder {
  color: #b8aaa0;
}

.primary-btn {
  width: 100%;
  background: #2c2218;
  color: #fff;
  border: none;
  padding: 0.9rem 1rem;
  font-family: "Times New Roman", serif;
  font-size: 0.88rem;
  letter-spacing: 0.07em;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.primary-btn:hover:not(:disabled) {
  background: #4a3828;
}
.primary-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #7a6a58;
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: #2c2218; }

.back-link-btn {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #7a6a58;
  background: none;
  border: none;
  font-family: "Times New Roman", serif;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.back-link-btn:hover { color: #2c2218; }

/* ── Shipping summary (step 2) ── */
.shipping-summary {
  background: #faf7f2;
  border: 1px solid #e0d5c5;
  padding: 0.9rem 1rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.shipping-summary-label {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7a6a58;
  flex-shrink: 0;
}
.shipping-summary-value {
  font-size: 0.83rem;
  color: #2c2218;
  flex: 1;
}
.edit-link {
  background: none;
  border: none;
  font-family: "Times New Roman", serif;
  font-size: 0.75rem;
  color: #c4a882;
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
  font-size: 0.75rem;
  color: #5a4a00;
  margin-bottom: 1.25rem;
}

/* ── Stripe card element ── */
.stripe-input {
  border: 1px solid #d0c5b5;
  padding: 0.75rem 0.85rem;
  background: #fff;
  transition: border-color 0.2s;
}
.stripe-input:focus-within {
  border-color: #b09070;
}

.payment-error {
  font-size: 0.8rem;
  color: #c0392b;
  background: #fff5f5;
  border: 1px solid #f5c6c6;
  padding: 0.6rem 0.9rem;
  margin-bottom: 0.75rem;
}

/* ── Order summary ── */
.summary-header {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a6a58;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0d5c5;
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
  border: 1px solid #e0d5c5;
}
.summary-item-qty {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #2c2218;
  color: #fff;
  font-size: 0.65rem;
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
  font-size: 0.82rem;
  color: #2c2218;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.summary-item-custom {
  font-size: 0.62rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #c4a882;
  margin-top: 0.15rem;
}
.summary-item-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c2218;
  white-space: nowrap;
}
.summary-divider {
  height: 1px;
  background: #e0d5c5;
  margin: 0.75rem 0;
}
.summary-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.83rem;
  color: #7a6a58;
  margin-bottom: 0.4rem;
}
.free-ship { color: #3a6b3a; }
.summary-grand-total {
  font-size: 1rem;
  font-weight: 700;
  color: #2c2218;
}

/* ── Dark mode ── */
[data-theme="dark"] .checkout-page { background: #1a1610; }
[data-theme="dark"] .section-title { color: #e8ddd0; }
[data-theme="dark"] .field-label { color: #9a8875; }
[data-theme="dark"] .field-input { background: #2a2418; border-color: #3a3025; color: #e8ddd0; }
[data-theme="dark"] .field-input::placeholder { color: #6a5a4a; }
[data-theme="dark"] .field-input:focus { border-color: #c4a882; }
[data-theme="dark"] .primary-btn { background: #e8ddd0; color: #1a1610; }
[data-theme="dark"] .primary-btn:hover:not(:disabled) { background: #c4a882; }
[data-theme="dark"] .back-link,
[data-theme="dark"] .back-link-btn { color: #9a8875; }
[data-theme="dark"] .back-link:hover,
[data-theme="dark"] .back-link-btn:hover { color: #e8ddd0; }
[data-theme="dark"] .shipping-summary { background: #2a2418; border-color: #3a3025; }
[data-theme="dark"] .shipping-summary-label { color: #9a8875; }
[data-theme="dark"] .shipping-summary-value { color: #e8ddd0; }
[data-theme="dark"] .test-hint { background: #2a2200; border-color: #4a3800; color: #c8a860; }
[data-theme="dark"] .stripe-input { background: #2a2418; border-color: #3a3025; }
[data-theme="dark"] .payment-error { background: #2a1010; border-color: #5a2020; color: #e08080; }
[data-theme="dark"] .checkout-summary { background: #1e1b14; border-color: #3a3025; }
[data-theme="dark"] .summary-header { color: #9a8875; border-bottom-color: #3a3025; }
[data-theme="dark"] .summary-item-name { color: #e8ddd0; }
[data-theme="dark"] .summary-item-img { border-color: #3a3025; }
[data-theme="dark"] .summary-divider { background: #3a3025; }
[data-theme="dark"] .summary-total-row { color: #9a8875; }
[data-theme="dark"] .summary-grand-total { color: #e8ddd0; }

/* ── Responsive ── */
@media (max-width: 991px) {
  .checkout-content { padding: 1.5rem 2.5rem; flex-direction: column; }
  .checkout-summary { width: 100%; }
}
@media (max-width: 767px) {
  .checkout-content { padding: 1.25rem; }
  .field-row { flex-direction: column; }
  .field-group-sm { flex: 1; }
}
</style>
