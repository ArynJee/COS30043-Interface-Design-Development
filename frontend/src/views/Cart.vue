<script setup>
import { onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { X } from "@lucide/vue";
import { useCartStore } from "@/stores/cart";

const router = useRouter();
const cartStore = useCartStore();

const { items, loading, selectedIds, allSelected, subtotal } = cartStore;

const formatPrice = (val) =>
  "$" + parseFloat(val || 0).toFixed(2);

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
    const cfg = item.configuration || {};
    const parts = Object.entries(cfg)
      .slice(0, 2)
      .map(([k, v]) => `${k}: ${v}`);
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
  if (selectedIds.length === 0) return;
  router.push("/checkout");
}

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<template>
  <div class="cart-page">

    <!-- Steps indicator -->
    <div class="steps-bar">
      <div class="step step-active">
        <div class="step-dot filled"></div>
        <span class="step-label">Cart</span>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-dot"></div>
        <span class="step-label">Checkout</span>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-dot"></div>
        <span class="step-label">Payment</span>
      </div>
    </div>

    <!-- Main layout -->
    <div class="cart-content">

      <!-- LEFT: Cart items -->
      <div class="cart-main">

        <!-- Header -->
        <div class="cart-header">
          <h2 class="cart-title">
            Cart
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
        <table v-else class="cart-table">
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

        <!-- Totals -->
        <div class="summary-section">
          <div class="total-row">
            <span class="total-label">Subtotal</span>
            <span class="total-value">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="total-row total-final">
            <span class="total-label">Total</span>
            <span class="total-value">{{ formatPrice(subtotal) }}</span>
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

    <!-- CTA Banner -->
    <div class="cta-banner">
      <div class="cta-text">
        <p class="cta-eyebrow">Discover more</p>
        <h3 class="cta-heading">Design your perfect space</h3>
        <p class="cta-sub">Explore our curated collection of handcrafted furniture</p>
        <div class="cta-actions">
          <RouterLink to="/products" class="cta-btn-primary">Shop Now</RouterLink>
          <RouterLink to="/customize" class="cta-btn-secondary">Customize</RouterLink>
        </div>
      </div>
      <div class="cta-img-wrap">
        <img src="/product/product-hero.png" alt="Furniture collection" class="cta-img" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.cart-page {
  font-family: "Times New Roman", Times, serif;
  background: #faf7f2;
  min-height: 100vh;
}

/* ── Steps bar ── */
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
.step-label {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a09080;
}
.step-active .step-label {
  color: #2c2218;
  font-weight: 600;
}
.step-line {
  width: 80px;
  height: 1px;
  background: #e0d5c5;
  margin: 0 0.5rem;
}

/* ── Cart content layout ── */
.cart-content {
  display: flex;
  gap: 2rem;
  padding: 2.5rem 5rem;
  align-items: flex-start;
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
  width: 100%;
  border-collapse: collapse;
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
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e0d5c5;
  padding: 1.5rem;
}

.summary-section {
  margin-bottom: 1rem;
}

.summary-divider {
  height: 1px;
  background: #e0d5c5;
  margin: 1rem 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.55rem;
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

/* ── CTA Banner ── */
.cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c2218;
  margin: 0 5rem 4rem;
  overflow: hidden;
  min-height: 160px;
}
.cta-text {
  padding: 2rem 2.5rem;
  flex: 1;
}
.cta-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #c4a882;
  margin-bottom: 0.4rem;
}
.cta-heading {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f0e1cc;
  margin-bottom: 0.35rem;
  line-height: 1.25;
}
.cta-sub {
  font-size: 0.75rem;
  color: #a09080;
  margin-bottom: 1rem;
}
.cta-actions {
  display: flex;
  gap: 0.75rem;
}
.cta-btn-primary {
  display: inline-block;
  background: #c4a882;
  color: #fff;
  font-family: "Times New Roman", serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.55rem 1.4rem;
  text-decoration: none;
  transition: background 0.2s;
}
.cta-btn-primary:hover {
  background: #b8966e;
}
.cta-btn-secondary {
  display: inline-block;
  background: transparent;
  border: 1px solid #c4a882;
  color: #c4a882;
  font-family: "Times New Roman", serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.55rem 1.4rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.cta-btn-secondary:hover {
  background: #c4a882;
  color: #fff;
}
.cta-img-wrap {
  width: 260px;
  height: 160px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}
.cta-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  opacity: 0.45;
}

/* ── Dark mode ── */
[data-theme="dark"] .cart-page {
  background: #1a1610;
}
[data-theme="dark"] .steps-bar {
  background: #1e1b14;
  border-bottom-color: #3a3025;
}
[data-theme="dark"] .step-label { color: #6a5a4a; }
[data-theme="dark"] .step-active .step-label { color: #e8ddd0; }
[data-theme="dark"] .step-dot { border-color: #4a3a2a; background: #1a1610; }
[data-theme="dark"] .step-dot.filled { background: #e8ddd0; border-color: #e8ddd0; }
[data-theme="dark"] .step-line { background: #3a3025; }
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
[data-theme="dark"] .summary-divider { background: #3a3025; }
[data-theme="dark"] .total-label { color: #9a8875; }
[data-theme="dark"] .total-value { color: #e8ddd0; }
[data-theme="dark"] .total-final .total-label,
[data-theme="dark"] .total-final .total-value { color: #e8ddd0; }
[data-theme="dark"] .checkout-btn { background: #e8ddd0; color: #1a1610; }
[data-theme="dark"] .checkout-btn:hover:not(:disabled) { background: #c4a882; }
[data-theme="dark"] .selection-hint { color: #6a5a4a; }
[data-theme="dark"] .empty-cart { color: #9a8875; }
[data-theme="dark"] .state-msg { color: #9a8875; }

/* ── Responsive ── */
@media (max-width: 991px) {
  .cart-content { padding: 1.5rem 2.5rem; flex-direction: column; }
  .cart-summary { width: 100%; }
  .steps-bar { padding: 1.5rem 2.5rem; }
  .cta-banner { margin: 0 2.5rem 3rem; }
}
@media (max-width: 767px) {
  .cart-content { padding: 1.25rem; }
  .steps-bar { padding: 1rem 1.25rem; }
  .step-line { width: 40px; }
  .cta-banner { margin: 0 1.25rem 3rem; flex-direction: column; }
  .cta-img-wrap { width: 100%; height: 120px; }
  .th-count, .td-count { display: none; }
}
</style>
