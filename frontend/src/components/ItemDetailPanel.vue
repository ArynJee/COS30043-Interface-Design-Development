<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ShoppingCart, Check, Box, User } from "@lucide/vue";
import FurnitureViewer from "@/components/FurnitureViewer.vue";
import FeedbackModal from "@/components/FeedbackModal.vue";

const { t } = useI18n();

const props = defineProps({
  item: { type: Object, default: null },
  reviews: { type: Array, default: () => [] },
  addingToCart: Boolean,
  cartAdded: Boolean,
  cartError: { type: String, default: null },
  submittingReview: Boolean,
  reviewError: { type: String, default: null },
  reviewSuccess: Boolean,
  skeletonType: { type: String, default: "" },
  furnitureTypeId: { type: String, default: "" },
  parsedConfig: { type: Object, default: () => ({}) },
  configEntries: { type: Array, default: () => [] },
});

const emit = defineEmits(["add-to-cart", "submit-review"]);

// local UI state
const show3D = ref(false);
const isLoggedIn = computed(() => !!localStorage.getItem("token"));

// review modal state
const showReviewModal = ref(false);
const modalSubmitted = ref(false);
const reviewData = ref({ rating: 5, comment: "" });

watch(
  () => props.reviewSuccess,
  (val) => {
    if (val) {
      modalSubmitted.value = true;
      setTimeout(() => {
        showReviewModal.value = false;
        modalSubmitted.value = false;
      }, 1500);
    }
  },
);

function openReviewModal() {
  reviewData.value = { rating: 5, comment: "" };
  modalSubmitted.value = false;
  showReviewModal.value = true;
}

function handleModalSubmit() {
  if (!reviewData.value.rating) return;
  emit("submit-review", {
    rating: reviewData.value.rating,
    comment: reviewData.value.comment,
  });
}

// reviews computed
const avgRating = computed(() => {
  if (!props.reviews.length) return 0;
  return props.reviews.reduce((s, r) => s + r.rating, 0) / props.reviews.length;
});

function starsFor(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    const val = i + 1;
    if (rating >= val) return "full";
    if (rating >= val - 0.5) return "half";
    return "empty";
  });
}

const avgStars = computed(() => starsFor(avgRating.value));

// helpers 
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatPrice = (p) =>
  `RM ${parseFloat(p).toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const getInitials = (f, l) => `${f?.[0] ?? "?"}${l?.[0] ?? ""}`.toUpperCase();

// actions 
function handleAddToCart() {
  emit("add-to-cart");
}


</script>

<template>
  <div v-if="item" class="idp-wrap">
    <div class="idp-top">
      <!-- left side: picture -->
      <div class="idp-visual">
        <div class="contrib-visual-wrap position-relative overflow-hidden">
          <template v-if="show3D && skeletonType">
            <FurnitureViewer
              :skeletonType="skeletonType"
              :furnitureType="furnitureTypeId"
              :configuration="parsedConfig"
              class="contrib-viewer"
            />
          </template>
          <template v-else>
            <img
              :src="item.preview_image_url"
              :alt="item.furniture_type"
              class="w-100 h-100 object-fit-cover"
            />
          </template>
        </div>

        <button
          v-if="skeletonType"
          class="view3d-btn d-inline-flex align-items-center gap-2 mt-3"
          @click="show3D = !show3D"
        >
          <Box :size="15" />
          {{ show3D ? $t('components.itemDetail.viewPhoto') : $t('components.itemDetail.view3D') }}
        </button>
      </div>

      <!-- right side: info -->
      <div class="idp-info">
        <!-- area badge -->
        <div class="info-badges mb-3">
          <span class="badge-area text-uppercase">{{ item.area }}</span>
        </div>

        <!-- furniture type (name) -->
        <h1 class="info-name mb-2">{{ item.furniture_type }}</h1>

        <!-- rating -->
        <div class="info-rating d-flex align-items-center gap-2 mb-4">
          <span class="stars-row d-inline-flex gap-1">
            <span
              v-for="(s, i) in avgStars"
              :key="i"
              class="star-icon"
              :class="`star-${s}`"
              >★</span
            >
          </span>
          <span class="rating-val">{{
            avgRating > 0 ? avgRating.toFixed(1) : "—"
          }}</span>
          <span class="rating-count"
            >({{ reviews.length }}
            {{ reviews.length === 1 ? $t('components.itemDetail.review_one') : $t('components.itemDetail.review_other') }})</span
          >
        </div>

        <!-- description -->
        <p class="info-desc mb-4">{{ item.description }}</p>

        <!-- price -->
        <div class="info-price-row mb-4">
          <span class="info-price">{{ formatPrice(item.total_cost) }}</span>
        </div>

        <!-- add to Cart -->
        <button
          class="add-cart-btn d-inline-flex align-items-center gap-2"
          :class="{ 'btn-added': cartAdded }"
          :disabled="addingToCart"
          @click="handleAddToCart"
        >
          <Check v-if="cartAdded" :size="16" />
          <ShoppingCart v-else :size="16" />
          {{
            addingToCart
              ? $t('components.itemDetail.adding')
              : cartAdded
                ? $t('components.itemDetail.added')
                : $t('components.itemDetail.addToCart')
          }}
        </button>

        <Transition name="cart-err">
          <p v-if="cartError" class="cart-error-msg mb-5">
            {{ cartError }}
            <a href="/login" class="cart-error-link">{{ $t('components.itemDetail.login') }}</a>
          </p>
          <div v-else class="mb-5" />
        </Transition>

        <div class="info-divider mb-4"></div>

        <!-- configuration chips -->
        <p class="spec-section-title mb-2">{{ $t('components.itemDetail.specification') }}</p>
        <div class="cfg-chips d-flex flex-wrap gap-2 mb-4">
          <span
            v-for="entry in configEntries"
            :key="entry.label"
            class="cfg-chip"
          >
            <span class="cfg-key">{{ entry.label }}</span>
            <span class="cfg-sep">·</span>
            <span class="cfg-val">{{ entry.name }}</span>
            <span v-if="entry.price" class="cfg-price"
              >+RM{{ entry.price }}</span
            >
          </span>
        </div>

        <!-- contributor -->
        <div class="contributor-row d-flex align-items-center gap-3">
          <div
            class="contrib-avatar d-flex align-items-center justify-content-center flex-shrink-0"
          >
            {{ getInitials(item.first_name, item.last_name) }}
          </div>
          <div>
            <div class="contrib-name">
              {{
                item.first_name
                  ? `${item.first_name} ${item.last_name}`
                  : "Anonymous"
              }}
            </div>
            <div class="contrib-date">
              {{ $t('components.itemDetail.designed') }} {{ formatDate(item.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--reviews section -->
    <div class="reviews-section">
      <div class="rev-header d-flex align-items-center gap-3 mb-5">
        <h2 class="rev-title mb-0">{{ $t('components.itemDetail.reviews') }}</h2>
        <div
          v-if="reviews.length"
          class="rev-avg d-flex align-items-center gap-2"
        >
          <span class="rev-avg-num">{{ avgRating.toFixed(1) }}</span>
          <span class="stars-row d-inline-flex gap-1">
            <span
              v-for="(s, i) in avgStars"
              :key="i"
              class="star-icon star-lg"
              :class="`star-${s}`"
              >★</span
            >
          </span>
          <span class="rev-count"
            >{{ reviews.length }}
            {{ reviews.length === 1 ? $t('components.itemDetail.review_one') : $t('components.itemDetail.review_other') }}</span
          >
        </div>
      </div>

      <div v-if="reviews.length" class="rev-list mb-6">
        <div v-for="r in reviews" :key="r.id" class="rev-card">
          <div class="rev-card-top d-flex align-items-start gap-3">
            <div
              class="rev-avatar d-flex align-items-center justify-content-center flex-shrink-0"
            >
              <User :size="14" />
            </div>
            <div class="rev-meta flex-grow-1">
              <div class="rev-author">
                {{
                  r.first_name ? `${r.first_name} ${r.last_name}` : "Anonymous"
                }}
              </div>
              <div class="rev-date">{{ formatDate(r.created_at) }}</div>
            </div>
            <div class="rev-stars d-flex gap-1">
              <span
                v-for="(s, i) in starsFor(r.rating)"
                :key="i"
                class="star-icon"
                :class="`star-${s}`"
                >★</span
              >
            </div>
          </div>
          <p v-if="r.comment" class="rev-comment mt-2 mb-0">{{ r.comment }}</p>
        </div>
      </div>
      <p v-else class="rev-empty">{{ $t('components.itemDetail.noReviews') }}</p>

      <!-- write review button -->
      <div v-if="isLoggedIn" class="rev-cta-wrap text-center">
        <button class="rev-write-btn" @click="openReviewModal">
          {{ $t('components.itemDetail.writeReview') }}
        </button>
      </div>
      <p v-else class="rev-login-prompt">
        <a href="/login">{{ $t('components.itemDetail.signIn') }}</a> {{ $t('components.itemDetail.toLeaveReview') }}
      </p>
    </div>
  </div>

  <!-- review modal -->
  <FeedbackModal
    :show="showReviewModal"
    :userFeedback="reviewData"
    :feedbackSubmitted="modalSubmitted"
    :title="t('components.itemDetail.reviewTitle')"
    :submitLabel="t('components.itemDetail.submitReview')"
    :successMessage="t('components.itemDetail.reviewThanks')"
    :showNameField="false"
    @close="showReviewModal = false"
    @submit="handleModalSubmit"
    @update:userFeedback="reviewData = $event"
  />
</template>

<style scoped>
@import "@/styles/main.css";

.idp-wrap {
  background: var(--bg-page);
  min-height: 60vh;
}

/* ── TOP LAYOUT ── */
.idp-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 5rem;
  align-items: start;
}

/* ── VISUAL COLUMN ── */
.idp-visual {
  position: sticky;
  top: 100px;
}

.contrib-visual-wrap {
  aspect-ratio: 4 / 3;
  background: var(--bg-alt);
  border: 1px solid var(--border);
}
.contrib-viewer {
  width: 100%;
  height: 100%;
}
.view3d-btn {
  background: transparent;
  border: 1px solid var(--border-input);
  color: var(--color-secondary);
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  padding: 0.45rem 1rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.view3d-btn:hover {
  border-color: var(--accent-dk);
  color: var(--color-primary);
}

/* ── INFO COLUMN ── */
.badge-area {
  font-size: var(--fs-2xs);
  letter-spacing: 0.16em;
  background: var(--accent);
  color: #fff;
  padding: 0.18rem 0.6rem;
}
[data-theme="dark"] .badge-area {
  color: #1e1a14;
}

.info-name {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  color: var(--color-primary);
  line-height: 1.15;
  font-weight: 700;
}

.stars-row {
  gap: 2px;
}
.star-icon {
  font-size: 1rem;
  line-height: 1;
}
.star-full {
  color: #c4a050;
}
.star-half {
  color: #c4a050;
  opacity: 0.6;
}
.star-empty {
  color: var(--border-input);
}
.star-lg {
  font-size: 1.15rem;
}

.rating-val {
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--fs-base);
}
.rating-count {
  font-size: var(--fs-sm);
  color: var(--color-secondary);
}

.info-desc {
  font-size: var(--fs-base);
  color: var(--accent-dk);
  line-height: 1.7;
  max-width: 480px;
}
[data-theme="dark"] .info-desc {
  color: var(--color-cream);
}

.info-price-row {
  display: flex;
  align-items: baseline;
}
.info-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.01em;
}

.add-cart-btn {
  background: var(--btn-bg);
  color: var(--btn-color);
  border: none;
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  letter-spacing: 0.08em;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  max-width: 320px;
  justify-content: center;
}
.add-cart-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
}
.add-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cart-error-msg {
  margin-top: 0.5rem;
  font-size: var(--fs-sm);
  color: #8b2020;
}
[data-theme="dark"] .cart-error-msg {
  color: #f0a0a0;
}
.cart-error-link {
  color: #8b2020;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  margin-left: 0.3rem;
}
[data-theme="dark"] .cart-error-link {
  color: #f0a0a0;
}

.cart-err-enter-active { transition: opacity 0.2s ease; }
.cart-err-leave-active { transition: opacity 0.15s ease; }
.cart-err-enter-from,
.cart-err-leave-to { opacity: 0; }
/* .add-cart-btn.btn-added {
  background: #5a8a5a;
} */

.info-divider {
  height: 1px;
  background: var(--border);
}

.spec-section-title {
  font-size: var(--fs-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-secondary);
}

.cfg-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid var(--border-input);
  padding: 0.2rem 0.65rem;
  font-size: var(--fs-xs);
  border-radius: 2px;
}
.cfg-key {
  font-weight: 600;
  color: var(--color-primary);
}
.cfg-sep {
  color: var(--accent);
}
.cfg-val {
  color: var(--color-secondary);
}
.cfg-price {
  color: var(--color-subtle);
  margin-left: 2px;
}

.contrib-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #c4a882;
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.contrib-name {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--color-primary);
}
.contrib-date {
  font-size: var(--fs-sm);
  color: var(--color-secondary);
}

/* ── REVIEWS SECTION ── */
.reviews-section {
  border-top: 1px solid var(--border);
  padding: 4rem 5rem 5rem;
}

.rev-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
}
.rev-avg-num {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}
.rev-count {
  font-size: var(--fs-sm);
  color: var(--color-secondary);
}

.rev-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}
.rev-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 1.25rem;
}
.rev-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--bg-alt);
  color: var(--color-secondary);
  flex-shrink: 0;
}
.rev-author {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--color-primary);
}
.rev-date {
  font-size: var(--fs-xs);
  color: var(--color-secondary);
}
.rev-stars {
  flex-shrink: 0;
}
.rev-comment {
  font-size: var(--fs-base);
  color: var(--accent-dk);
  line-height: 1.6;
}
[data-theme="dark"] .rev-comment {
  color: var(--color-cream);
}
.rev-empty {
  font-size: var(--fs-base);
  color: var(--color-secondary);
  margin-bottom: 3rem;
}

.rev-cta-wrap {
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}
.rev-write-btn {
  background: var(--btn-bg);
  color: var(--btn-color);
  border: none;
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
  padding: 0.65rem 2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.rev-write-btn:hover {
  background: var(--btn-bg-hover);
}

.rev-login-prompt {
  font-size: var(--fs-base);
  color: var(--color-secondary);
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}
.rev-login-prompt a {
  color: var(--accent-dk);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── RESPONSIVE ── */
@media (max-width: 1199px) {
  .idp-top {
    padding: 3rem 2.5rem;
    gap: 3rem;
  }
  .reviews-section {
    padding: 3rem 2.5rem 4rem;
  }
}
@media (max-width: 991px) {
  .idp-top {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 2.5rem;
  }
  .idp-visual {
    position: static;
  }
  .reviews-section {
    padding: 2.5rem 2.5rem 3.5rem;
  }
}
@media (max-width: 767px) {
  .idp-top {
    padding: 1.5rem 1.25rem;
  }
  .reviews-section {
    padding: 2rem 1.25rem 3rem;
  }
  .rev-list {
    grid-template-columns: 1fr;
  }
  .add-cart-btn {
    max-width: 100%;
  }
  .contrib-visual-wrap :deep(.fv-wrap) {
    min-height: 0;
    height: 100%;
  }
}
@media (max-width: 390px) {
  .rev-header {
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  .rev-avg {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem 0.5rem;
  }
  .rev-count {
    flex: 0 0 100%;
    text-align: center;
  }
}
</style>
