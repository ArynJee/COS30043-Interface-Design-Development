<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, RouterLink } from "vue-router";
import { X, Truck} from "@lucide/vue";
import { useCartStore } from "@/stores/cart";
import CheckoutSteps from "@/components/CheckoutSteps.vue";
import CtaBanner from "@/components/CtaBanner.vue";

const router = useRouter();
const cartStore = useCartStore();

const { items, loading, selectedIds, allSelected, subtotal } = storeToRefs(cartStore);

// ── Shipping ────────────────────────────────────────────────────────────────
const SHIPPING_OPTIONS = [
  { id: "sea", label: "Sea Shipping", days: "14–21 days", fee: 10 },
  { id: "air", label: "Air Shipping",  days: "3–7 days",   fee: 15 },
];
const FREE_THRESHOLD = { sea: 300, air: 1000 };

const selectedShipping = ref("sea");

const shippingOption = computed(() =>
  SHIPPING_OPTIONS.find((o) => o.id === selectedShipping.value)
);

const shippingFee = computed(() => {
  const threshold = FREE_THRESHOLD[selectedShipping.value];
  return subtotal.value >= threshold ? 0 : shippingOption.value.fee;
});

const freeShippingThreshold = computed(() => FREE_THRESHOLD[selectedShipping.value]);

const amountToFreeShipping = computed(() =>
  Math.max(0, freeShippingThreshold.value - subtotal.value)
);

const freeShippingProgress = computed(() =>
  Math.min(100, (subtotal.value / freeShippingThreshold.value) * 100)
);

const freeShippingUnlocked = computed(() => subtotal.value >= freeShippingThreshold.value);

// ── Tax & totals ────────────────────────────────────────────────────────────
const TAX_RATE = 0.06; // 6% SST

const taxAmount = computed(() =>
  (subtotal.value + shippingFee.value) * TAX_RATE
);

const orderTotal = computed(() =>
  subtotal.value + shippingFee.value + taxAmount.value
);

// ── Formatting ──────────────────────────────────────────────────────────────
const formatPrice = (val) => "RM " + parseFloat(val || 0).toFixed(2);

// ── Item helpers ────────────────────────────────────────────────────────────
function getItemName(item) {
  if (item.is_custom) {
    return (item.furniture_type || "Custom Item")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return item.item_name || "Product";
}

function getItemVariant(item) {
  if (item.is_custom) {
    const raw = item.configuration;
    const cfg = typeof raw === "string" ? JSON.parse(raw) : (raw || {});
    const parts = Object.entries(cfg)
      .slice(0, 2)
      .map(([k, v]) => {
        const label = typeof v === "object" && v !== null ? (v.name ?? String(v)) : v;
        return `${k}: ${label}`;
      });
    return parts.join(" · ") || "Custom Configuration";
  }
  return "";
}

async function handleClearCart() {
  if (!confirm("Remove all items from your cart?")) return;
  await cartStore.clearCart();
}

function goToCheckout() {
  if (!localStorage.getItem("token")) {
    router.push("/login");
    return;
  }
  if (selectedIds.value.length === 0) return;
  router.push("/checkout");
}

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<template>
  <div class="cart-page">

    <CheckoutSteps current-step="cart" />

    <!-- Main layout -->
    <div class="cart-content">

      <!-- LEFT: Cart items -->
      <div class="cart-main">

        <!-- Header -->
        <div class="cart-header">
          <h2 class="cart-title">
            My  Cart
            <span class="cart-count">({{ cartStore.itemCount }} product{{ cartStore.itemCount !== 1 ? "s" : "" }})</span>
          </h2>
          <button class="clear-btn" @click="handleClearCart">
            <X :size="13" class="me-1" />Clear cart
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-msg">Loading cart…</div>

        <!-- Empty -->
        <div v-else-if="items.length === 0" class="empty-cart">
          <p>Your cart is empty.</p>
          <RouterLink to="/products" class="continue-link">Continue shopping →</RouterLink>
        </div>

        <!-- Table -->
        <table v-else class="cart-table w-100">
          <thead>
            <tr>
              <th class="th-check">
                <input
                  type="checkbox"
                  class="row-check"
                  :checked="allSelected"
                  @change="cartStore.toggleSelectAll()"
                />
              </th>
              <th class="th-product">Product</th>
              <th class="th-count">Count</th>
              <th class="th-price">Price</th>
              <th class="th-remove"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              class="cart-row"
              :class="{ 'row-selected': selectedIds.includes(item.id) }"
            >
              <td class="td-check">
                <input
                  type="checkbox"
                  class="row-check"
                  :checked="selectedIds.includes(item.id)"
                  @change="cartStore.toggleSelect(item.id)"
                />
              </td>

              <td class="td-product">
                <div class="product-info">
                  <div class="product-img-wrap">
                    <img
                      :src="item.preview_image || '/product/placeholder.jpg'"
                      :alt="getItemName(item)"
                      class="product-img"
                    />
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ getItemName(item) }}</div>
                    <div class="product-variant" v-if="getItemVariant(item)">
                      {{ getItemVariant(item) }}
                    </div>
                    <div class="product-custom-badge" v-if="item.is_custom">Custom</div>
                  </div>
                </div>
              </td>

              <td class="td-count">
                <div class="qty-controls">
                  <button
                    class="qty-btn"
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >−</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    class="qty-btn"
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  >+</button>
                </div>
              </td>

              <td class="td-price">{{ formatPrice(item.unit_price * item.quantity) }}</td>

              <td class="td-remove">
                <button class="remove-btn" @click="cartStore.removeItem(item.id)">
                  <X :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- RIGHT: Summary -->
      <div class="cart-summary" v-if="items.length > 0 || loading">

        <!-- Free-shipping progress slider -->
        <div class="fs-slider-wrap">
          <div v-if="freeShippingUnlocked" class="fs-unlocked-msg">
            Free shipping unlocked!
          </div>
          <div v-else class="fs-progress-msg">
            Spend <strong>{{ formatPrice(amountToFreeShipping) }}</strong> more for free
            {{ shippingOption.label.toLowerCase() }}
          </div>
          <div class="fs-track">
            <div class="fs-fill" :style="{ width: freeShippingProgress + '%' }"></div>
            <div class="fs-truck" :style="{ left: freeShippingProgress + '%' }">
              <Truck size="23"/>
            </div>
          </div>
          <div class="fs-labels">
            <span>RM 0</span>
            <span>RM {{ freeShippingThreshold }}</span>
          </div>
        </div>

        <!-- Shipping method -->
        <div class="shipping-section">
          <p class="shipping-title">Shipping Method</p>
          <label
            v-for="opt in SHIPPING_OPTIONS"
            :key="opt.id"
            class="shipping-option"
            :class="{ 'shipping-option--active': selectedShipping === opt.id }"
          >
            <input
              type="radio"
              :value="opt.id"
              v-model="selectedShipping"
              class="shipping-radio"
            />
            <span class="shipping-info">
              <span class="shipping-name">{{ opt.label }}</span>
              <span class="shipping-days">{{ opt.days }}</span>
            </span>
            <span class="shipping-price" :class="{ 'shipping-free': subtotal >= FREE_THRESHOLD[opt.id] }">
              {{ subtotal >= FREE_THRESHOLD[opt.id] ? 'FREE' : formatPrice(opt.fee) }}
            </span>
          </label>
        </div>

        <!-- Order breakdown -->
        <div class="summary-section">
          <div class="total-row">
            <span class="total-label">Subtotal</span>
            <span class="total-value">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Shipping</span>
            <span class="total-value" :class="{ 'free-tag': shippingFee === 0 }">
              {{ shippingFee === 0 ? 'FREE' : formatPrice(shippingFee) }}
            </span>
          </div>
          <div class="total-row">
            <span class="total-label">SST (6%)</span>
            <span class="total-value">{{ formatPrice(taxAmount) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="total-row total-final">
            <span class="total-label">Total</span>
            <span class="total-value">{{ formatPrice(orderTotal) }}</span>
          </div>
        </div>

        <button
          class="checkout-btn"
          @click="goToCheckout"
          :disabled="selectedIds.length === 0"
        >
          Continue to checkout
        </button>

        <div class="selection-hint" v-if="selectedIds.length < items.length && items.length > 0">
          {{ selectedIds.length }} of {{ items.length }} items selected
        </div>
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
.cart-page {
  font-family: "Times New Roman", Times, serif;
  background: #faf7f2;
  min-height: 100vh;
}

/* ── Cart content layout ── */
.cart-content {
  display: flex;
  gap: 2rem;
  padding: 2.5rem 5rem;
  align-items: stretch;
}

/* ── LEFT: cart main ── */
.cart-main {
  flex: 1;
  min-width: 0;
}
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.cart-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c2218;
  margin: 0;
}
.cart-count {
  font-size: 0.95rem;
  font-weight: 400;
  color: #7a6a58;
  margin-left: 0.4rem;
}
.clear-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #c0392b;
  font-family: "Times New Roman", serif;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}
.clear-btn:hover {
  opacity: 0.7;
}

/* ── Cart table ── */
.cart-table {
  border-collapse: collapse;
  border: 1px solid #e0d5c5;
}
.cart-table thead th {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a6a58;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #e0d5c5;
  font-weight: 400;
  background: #fff;
}
.th-check { width: 36px; }
.th-product { text-align: left; }
.th-count { text-align: center; width: 120px; }
.th-price { text-align: right; width: 100px; }
.th-remove { width: 40px; }

.cart-row {
  border-bottom: 1px solid #f0ebe2;
  transition: background 0.15s;
}
.cart-row:hover {
  background: #fdf9f5;
}
.row-selected {
  background: #fffdf8;
}

.cart-table tbody td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
}
.td-check { width: 36px; }
.td-price {
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c2218;
  white-space: nowrap;
}

/* ── Checkbox ── */
.row-check {
  accent-color: #c4a882;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

/* ── Product cell ── */
.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.product-img-wrap {
  width: 72px;
  height: 72px;
  border: 1px solid #e0d5c5;
  background: #f5f2ee;
  flex-shrink: 0;
  overflow: hidden;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #2c2218;
  margin-bottom: 0.2rem;
}
.product-variant {
  font-size: 0.73rem;
  color: #7a6a58;
  margin-top: 0.15rem;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-custom-badge {
  display: inline-block;
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: #c4a882;
  color: #fff;
  padding: 0.1rem 0.45rem;
  margin-top: 0.3rem;
}

/* ── Qty controls ── */
.qty-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d0c5b5;
  background: #fff;
  color: #2c2218;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
  font-family: "Times New Roman", serif;
}
.qty-btn:hover:not(:disabled) {
  background: #2c2218;
  color: #fff;
  border-color: #2c2218;
}
.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.qty-value {
  min-width: 24px;
  text-align: center;
  font-size: 0.88rem;
  color: #2c2218;
}

/* ── Remove button ── */
.remove-btn {
  background: none;
  border: none;
  color: #c0392b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: opacity 0.2s;
}
.remove-btn:hover {
  opacity: 0.6;
}

/* ── RIGHT: Summary panel ── */
.cart-summary {
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e0d5c5;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.cart-summary .summary-section:last-of-type {
  margin-top: auto;
}

/* ── Free-shipping slider ── */
.fs-slider-wrap {
  margin-bottom: 1.25rem;
}
.fs-progress-msg,
.fs-unlocked-msg {
  font-size: 0.75rem;
  color: #7a6a58;
  margin-bottom: 0.55rem;
  line-height: 1.4;
}
.fs-unlocked-msg {
  color: #2c2218;
}
.fs-progress-msg strong {
  color: #2c2218;
}
.fs-track {
  position: relative;
  height: 6px;
  background: #ede6da;
  border-radius: 3px;
  overflow: visible;
}
.fs-fill {
  height: 100%;
  background: #c4a882;
  border-radius: 3px;
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.fs-truck {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  color: #8b6f47;
  pointer-events: none;
}
.truck-icon {
  width: 22px;
  height: 22px;
  display: block;
  filter: drop-shadow(0 1px 3px rgba(44,34,24,0.18));
}
.fs-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #b0a090;
  margin-top: 0.3rem;
}

/* ── Shipping method ── */
.shipping-section {
  margin-bottom: 1.1rem;
  padding-bottom: 1.1rem;
  border-bottom: 1px solid #e0d5c5;
}
.shipping-title {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a6a58;
  margin: 0 0 0.6rem;
}
.shipping-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid #e0d5c5;
  cursor: pointer;
  margin-bottom: 0.45rem;
  transition: border-color 0.18s, background 0.18s;
  user-select: none;
}
.shipping-option:last-child { margin-bottom: 0; }
.shipping-option--active {
  border-color: #c4a882;
  background: #fdf9f4;
}
.shipping-radio {
  accent-color: #c4a882;
  flex-shrink: 0;
}
.shipping-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.shipping-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c2218;
}
.shipping-days {
  font-size: 0.68rem;
  color: #9a8875;
  margin-top: 0.1rem;
}
.shipping-price {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c2218;
  white-space: nowrap;
}
.shipping-free {
  color: #2c2218;
}

/* ── Order breakdown ── */
.summary-section {
  margin-bottom: 1rem;
}
.summary-divider {
  height: 1px;
  background: #e0d5c5;
  margin: 0.85rem 0;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
}
.total-label {
  font-size: 0.82rem;
  color: #7a6a58;
}
.total-value {
  font-size: 0.88rem;
  color: #2c2218;
}
.total-final .total-label,
.total-final .total-value {
  font-size: 1rem;
  font-weight: 700;
  color: #2c2218;
}
.free-tag {
  color: #2c2218;
  font-weight: 600;
}

.checkout-btn {
  width: 100%;
  background: #2c2218;
  color: #fff;
  border: none;
  padding: 0.9rem 1rem;
  font-family: "Times New Roman", serif;
  font-size: 0.85rem;
  letter-spacing: 0.07em;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.checkout-btn:hover:not(:disabled) {
  background: #4a3828;
}
.checkout-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.selection-hint {
  font-size: 0.72rem;
  color: #9a8875;
  text-align: center;
  margin-top: 0.5rem;
}

/* ── Empty / loading ── */
.state-msg {
  padding: 3rem 1rem;
  text-align: center;
  color: #7a6a58;
  font-size: 0.9rem;
}
.empty-cart {
  padding: 3rem 1rem;
  text-align: center;
  color: #7a6a58;
}
.empty-cart p {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
.continue-link {
  color: #c4a882;
  text-decoration: none;
  font-size: 0.85rem;
}
.continue-link:hover {
  text-decoration: underline;
}

.cb-bridge {
  background: #faf7f2;
  height: 5rem;
}

/* ── Dark mode ── */
[data-theme="dark"] .cart-page {
  background: #1a1610;
}
[data-theme="dark"] .cart-title { color: #e8ddd0; }
[data-theme="dark"] .cart-count { color: #9a8875; }
[data-theme="dark"] .cart-table thead th {
  color: #9a8875;
  border-bottom-color: #3a3025;
  background: #1a1610;
}
[data-theme="dark"] .cart-row { border-bottom-color: #2e2820; }
[data-theme="dark"] .cart-row:hover { background: #221e17; }
[data-theme="dark"] .row-selected { background: #1e1b15; }
[data-theme="dark"] .product-img-wrap { border-color: #3a3025; background: #2a2418; }
[data-theme="dark"] .product-name { color: #e8ddd0; }
[data-theme="dark"] .product-variant { color: #9a8875; }
[data-theme="dark"] .td-price { color: #e8ddd0; }
[data-theme="dark"] .qty-btn {
  background: #2a2418;
  border-color: #3a3025;
  color: #e8ddd0;
}
[data-theme="dark"] .qty-btn:hover:not(:disabled) {
  background: #e8ddd0;
  color: #1a1610;
  border-color: #e8ddd0;
}
[data-theme="dark"] .qty-value { color: #e8ddd0; }
[data-theme="dark"] .cart-summary {
  background: #1e1b14;
  border-color: #3a3025;
}
[data-theme="dark"] .fs-track { background: #2e2820; }
[data-theme="dark"] .fs-fill { background: #8b6f47; }
[data-theme="dark"] .fs-truck { color: #c4a882; }
[data-theme="dark"] .fs-progress-msg { color: #9a8875; }
[data-theme="dark"] .fs-progress-msg strong { color: #e8ddd0; }
[data-theme="dark"] .fs-unlocked-msg { color: #6dbf8a; }
[data-theme="dark"] .fs-labels { color: #5a4a3a; }
[data-theme="dark"] .shipping-title { color: #9a8875; }
[data-theme="dark"] .shipping-section { border-bottom-color: #3a3025; }
[data-theme="dark"] .shipping-option { border-color: #3a3025; }
[data-theme="dark"] .shipping-option--active { border-color: #8b6f47; background: #221e17; }
[data-theme="dark"] .shipping-name { color: #e8ddd0; }
[data-theme="dark"] .shipping-days { color: #6a5a4a; }
[data-theme="dark"] .shipping-price { color: #e8ddd0; }
[data-theme="dark"] .shipping-free { color: #6dbf8a; }
[data-theme="dark"] .summary-divider { background: #3a3025; }
[data-theme="dark"] .total-label { color: #9a8875; }
[data-theme="dark"] .total-value { color: #e8ddd0; }
[data-theme="dark"] .total-final .total-label,
[data-theme="dark"] .total-final .total-value { color: #e8ddd0; }
[data-theme="dark"] .free-tag { color: #6dbf8a; }
[data-theme="dark"] .checkout-btn { background: #e8ddd0; color: #1a1610; }
[data-theme="dark"] .checkout-btn:hover:not(:disabled) { background: #c4a882; }
[data-theme="dark"] .selection-hint { color: #6a5a4a; }
[data-theme="dark"] .empty-cart { color: #9a8875; }
[data-theme="dark"] .state-msg { color: #9a8875; }

/* ── Responsive ── */
@media (max-width: 991px) {
  .cart-content { padding: 1.5rem 2.5rem; flex-direction: column; }
  .cart-summary { width: 100%; }
}
@media (max-width: 767px) {
  .cart-content { padding: 1.25rem; }
  .th-count, .td-count { display: none; }
}
</style>
