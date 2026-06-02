<script setup>
import { RouterLink } from "vue-router";
import { X, Truck, ArrowRight } from "@lucide/vue";
import CheckoutSteps from "@/components/CheckoutSteps.vue";
import CtaBanner from "@/components/CtaBanner.vue";
import useCart from "@/hooks/useCart.js";

const {
  cartStore,
  items,
  loading,
  selectedIds,
  allSelected,
  subtotal,
  SHIPPING_OPTIONS,
  FREE_THRESHOLD,
  selectedShipping,
  shippingOption,
  shippingFee,
  freeShippingThreshold,
  amountToFreeShipping,
  freeShippingProgress,
  freeShippingUnlocked,
  taxAmount,
  orderTotal,
  formatPrice,
  getItemName,
  getItemVariant,
  getItemImage,
  handleClearCart,
  goToCheckout,
} = useCart();
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
            {{ $t('cart.title') }}
            <span class="cart-count"
              >({{ cartStore.itemCount }} {{ cartStore.itemCount !== 1 ? $t('cart.product_other') : $t('cart.product_one') }})</span
            >
          </h2>
          <button class="clear-btn" @click="handleClearCart">
            <X :size="13" class="me-1" />{{ $t('cart.clear') }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-msg">{{ $t('cart.loading') }}</div>

        <!-- Empty -->
        <div v-else-if="items.length === 0" class="empty-cart">
          <p>{{ $t('cart.empty') }}</p>
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
              <th class="th-product">{{ $t('cart.product') }}</th>
              <th class="th-count">{{ $t('cart.count') }}</th>
              <th class="th-price">{{ $t('cart.price') }}</th>
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
                      :src="getItemImage(item)"
                      :alt="getItemName(item)"
                      class="product-img"
                    />
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ getItemName(item) }}</div>
                    <div class="product-variant" v-if="getItemVariant(item)">
                      {{ getItemVariant(item) }}
                    </div>
                    <div class="product-custom-badge" v-if="item.is_custom">
                      {{ $t('cart.custom') }}
                    </div>
                    <div class="product-mobile-price">{{ formatPrice(item.unit_price * item.quantity) }}</div>
                  </div>
                </div>
              </td>

              <td class="td-count">
                <div class="qty-controls">
                  <button
                    class="qty-btn"
                    @click="
                      cartStore.updateQuantity(item.id, item.quantity - 1)
                    "
                    :disabled="item.quantity <= 1"
                  >
                    −
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    class="qty-btn"
                    @click="
                      cartStore.updateQuantity(item.id, item.quantity + 1)
                    "
                  >
                    +
                  </button>
                </div>
              </td>

              <td class="td-price">
                {{ formatPrice(item.unit_price * item.quantity) }}
              </td>

              <td class="td-remove">
                <button
                  class="remove-btn"
                  @click="cartStore.removeItem(item.id)"
                >
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
            {{ $t('cart.freeShipping') }}
          </div>
          <div v-else class="fs-progress-msg">
            {{ $t('cart.spendMore', { amount: formatPrice(amountToFreeShipping), method: shippingOption.label.toLowerCase() }) }}
          </div>
          <div class="fs-track">
            <div
              class="fs-fill"
              :style="{ width: freeShippingProgress + '%' }"
            ></div>
            <div class="fs-truck" :style="{ left: freeShippingProgress + '%' }">
              <Truck size="23" />
            </div>
          </div>
          <div class="fs-labels">
            <span>RM 0</span>
            <span>RM {{ freeShippingThreshold }}</span>
          </div>
        </div>

        <!-- Shipping method -->
        <div class="shipping-section">
          <p class="shipping-title">{{ $t('cart.shippingMethod') }}</p>
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
            <span
              class="shipping-price"
              :class="{ 'shipping-free': subtotal >= FREE_THRESHOLD[opt.id] }"
            >
              {{
                subtotal >= FREE_THRESHOLD[opt.id]
                  ? $t('cart.free')
                  : formatPrice(opt.fee)
              }}
            </span>
          </label>
        </div>

        <!-- Order breakdown -->
        <div class="summary-section">
          <div class="total-row">
            <span class="total-label">{{ $t('cart.subtotal') }}</span>
            <span class="total-value">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">{{ $t('cart.shipping') }}</span>
            <span
              class="total-value"
              :class="{ 'free-tag': shippingFee === 0 }"
            >
              {{ shippingFee === 0 ? $t('cart.free') : formatPrice(shippingFee) }}
            </span>
          </div>
          <div class="total-row">
            <span class="total-label">{{ $t('cart.sst') }}</span>
            <span class="total-value">{{ formatPrice(taxAmount) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="total-row total-final">
            <span class="total-label">{{ $t('cart.total') }}</span>
            <span class="total-value">{{ formatPrice(orderTotal) }}</span>
          </div>
        </div>

        <button
          class="checkout-btn"
          @click="goToCheckout"
          :disabled="selectedIds.length === 0"
        >
          {{ $t('cart.checkout') }}
        </button>

        <div
          class="selection-hint"
          v-if="selectedIds.length < items.length && items.length > 0"
        >
          {{ $t('cart.selected', { selected: selectedIds.length, total: items.length }) }}
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
@import "@/styles/main.css";

.cart-page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* ── Cart content layout ── */
.cart-content {
  display: flex;
  gap: 2rem;
  padding: 2.5rem clamp(1.25rem, 5vw, 5rem);
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
  color: var(--color-primary);
  margin: 0;
}
.cart-count {
  font-size: var(--fs-md);
  font-weight: 400;
  color: var(--color-secondary);
  margin-left: 0.4rem;
}
.clear-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-error-2);
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
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
  border: 1px solid var(--border);
}
.cart-table thead th {
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-secondary);
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--border);
  font-weight: 400;
  background: var(--bg-surface);
}
.th-check {
  width: 36px;
}
.th-product {
  text-align: left;
}
.th-count {
  text-align: center;
  width: 120px;
}
.th-price {
  text-align: right;
  width: 100px;
}
.th-remove {
  width: 40px;
}

.cart-row {
  border-bottom: 1px solid var(--border-light);
  transition: background 0.15s;
}
.cart-row:hover {
  background: var(--bg-elevated);
}
.row-selected {
  background: var(--bg-elevated);
}

.cart-table tbody td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
}
.td-check {
  width: 36px;
}
.td-price {
  text-align: right;
  font-size: var(--fs-md);
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}

/* ── Checkbox ── */
.row-check {
  accent-color: var(--accent);
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
  border: 1px solid var(--border);
  background: var(--bg-alt);
  flex-shrink: 0;
  overflow: hidden;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-name {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.2rem;
}
.product-variant {
  font-size: var(--fs-xs);
  color: var(--color-secondary);
  margin-top: 0.15rem;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-custom-badge {
  display: inline-block;
  font-size: var(--fs-2xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--accent);
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
  border: 1px solid var(--border-input);
  background: var(--bg-surface);
  color: var(--color-primary);
  font-size: var(--fs-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    border-color 0.15s;
  font-family: var(--font-serif);
}
.qty-btn:hover:not(:disabled) {
  background: var(--btn-bg);
  color: var(--btn-color);
  border-color: var(--btn-bg);
}
.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.qty-value {
  min-width: 24px;
  text-align: center;
  font-size: var(--fs-base);
  color: var(--color-primary);
}

/* ── Remove button ── */
.remove-btn {
  background: none;
  border: none;
  color: var(--color-error-2);
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
  background: var(--bg-surface);
  border: 1px solid var(--border);
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
  font-size: var(--fs-sm);
  color: var(--color-secondary);
  margin-bottom: 0.55rem;
  line-height: 1.4;
}
.fs-unlocked-msg {
  color: var(--color-free);
}
.fs-progress-msg strong {
  color: var(--color-primary);
}
.fs-track {
  position: relative;
  height: 6px;
  background: var(--bg-alt);
  border-radius: 3px;
  overflow: visible;
}
.fs-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.fs-truck {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--accent-dk);
  pointer-events: none;
}
[data-theme="dark"] .fs-truck {
  color: var(--color-primary);
}
.truck-icon {
  width: 22px;
  height: 22px;
  display: block;
  filter: drop-shadow(0 1px 3px rgba(44, 34, 24, 0.18));
}
.fs-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-2xs);
  color: var(--color-subtle);
  margin-top: 0.3rem;
}

/* ── Shipping method ── */
.shipping-section {
  margin-bottom: 1.1rem;
  padding-bottom: 1.1rem;
  border-bottom: 1px solid var(--border);
}
.shipping-title {
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin: 0 0 0.6rem;
}
.shipping-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--border);
  cursor: pointer;
  margin-bottom: 0.45rem;
  transition:
    border-color 0.18s,
    background 0.18s;
  user-select: none;
}
.shipping-option:last-child {
  margin-bottom: 0;
}
.shipping-option--active {
  border-color: var(--accent);
  background: var(--bg-elevated);
}
.shipping-radio {
  accent-color: var(--accent);
  flex-shrink: 0;
}
.shipping-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.shipping-name {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--color-primary);
}
.shipping-days {
  font-size: var(--fs-xs);
  color: var(--color-muted);
  margin-top: 0.1rem;
}
.shipping-price {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}
.shipping-free {
  color: var(--color-free);
}

/* ── Order breakdown ── */
.summary-section {
  margin-bottom: 1rem;
}
.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 0.85rem 0;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
}
.total-label {
  font-size: var(--fs-base);
  color: var(--color-secondary);
}
.total-value {
  font-size: var(--fs-base);
  color: var(--color-primary);
}
.total-final .total-label,
.total-final .total-value {
  font-size: var(--fs-lg);
  font-weight: 700;
  color: var(--color-primary);
}
.free-tag {
  color: var(--color-free);
  font-weight: 600;
}

.checkout-btn {
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
.checkout-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
}
.checkout-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.selection-hint {
  font-size: var(--fs-base);
  color: var(--color-secondary);
  text-align: center;
  margin-top: 0.5rem;
}

/* ── Empty / loading ── */
.state-msg {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-secondary);
  font-size: var(--fs-md);
}
.empty-cart {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-secondary);
}
.empty-cart p {
  font-size: var(--fs-lg);
  margin-bottom: 0.75rem;
}
.continue-link {
  color: var(--accent);
  text-decoration: none;
  font-size: var(--fs-base);
}
.continue-link:hover {
  text-decoration: underline;
}
.cb-bridge {
  background: var(--bg-page);
  height: 5rem;
}

/* ── Responsive ── */
@media (max-width: 1066px) {
  .cart-content {
    padding: 1.5rem 2.5rem;
    flex-direction: column;
  }
  .cart-summary {
    width: 100%;
  }
}
@media (max-width: 767px) {
  .cart-content {
    padding: 1.25rem;
  }
  .th-count,
  .td-count {
    display: none;
  }
}

.product-mobile-price { display: none; }

@media (max-width: 440px) {
  .th-price,
  .td-price {
    display: none;
  }
  .product-mobile-price {
    display: block;
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--color-primary);
    margin-top: 0.3rem;
  }
  .product-img-wrap {
    width: 56px;
    height: 56px;
  }
  .product-variant {
    max-width: 140px;
  }
}

@media (max-width: 400px) {
  .cart-content {
    padding: 0.75rem;
  }
  .cart-table thead th,
  .cart-table tbody td {
    padding: 0.6rem 0.35rem;
  }
  .th-check,
  .td-check {
    width: 24px;
  }
  .th-remove,
  .td-remove {
    width: 28px;
  }
  .product-info {
    gap: 0.5rem;
  }
  .product-img-wrap {
    width: 52px;
    height: 52px;
  }
  .product-name {
    font-size: var(--fs-sm);
  }
  .product-variant {
    max-width: 120px;
    white-space: normal;
  }
}
</style>
