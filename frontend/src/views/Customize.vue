<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  Sofa as SofaIcon,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Armchair,
  BookOpen,
  BedDouble,
  Shirt,
  Lamp,
  ChefHat,
  GlassWater,
  UtensilsCrossed,
  CookingPot,
  Droplets,
  ShowerHead,
  Glasses,
  PenLine,
  Briefcase,
  GraduationCap,
  Archive,
} from "@lucide/vue";
import FurnitureViewer from "@/components/FurnitureViewer.vue";
import ContributionModal from "@/components/ContributionModal.vue";
import Onboarding from "@/components/Onboarding.vue";
import useCustomize from "@/hooks/useCustomize.js";

const { t } = useI18n();
const viewerRef = ref(null);

const isNarrow = ref(window.innerWidth <= 992);
function syncNarrow() {
  isNarrow.value = window.innerWidth <= 992;
}
onMounted(() => window.addEventListener("resize", syncNarrow));
onUnmounted(() => window.removeEventListener("resize", syncNarrow));

const {
  selectedArea,
  selectedTypeId,
  selectedConfig,
  AREAS,
  furnitureInArea,
  currentType,
  configKeys,
  totalPrice,
  selectArea,
  selectType,
  selectOption,
  cartLoading,
  cartSuccess,
  cartError,
  addToCart,
  contribOpen,
  contribSubmitting,
  contribError,
  contribSuccess,
  contribPreview,
  openContribModal,
  submitContribution,
  formatPrice,
} = useCustomize(viewerRef);

const FURNITURE_ICONS = {
  sofa: SofaIcon,
  armchair: Armchair,
  coffee_table: Coffee,
  dining_table: UtensilsCrossed,
  bookshelf: BookOpen,
  study_shelf: GraduationCap,
  bathroom_shelf: ShowerHead,
  bed_frame: BedDouble,
  wardrobe: Shirt,
  nightstand: Lamp,
  kitchen_counter: ChefHat,
  kitchen_cabinet: CookingPot,
  sink: Droplets,
  vanity_cabinet: Glasses,
  bar_stool: GlassWater,
  desk: PenLine,
  office_chair: Briefcase,
  drawer_cabinet: Archive,
};

// friendly label map for config section headings
const CONFIG_LABEL_KEYS = {
  shape: "customize.options.shape",
  fabric: "customize.options.fabric",
  material: "customize.options.material",
  color: "customize.options.colour",
  legs: "customize.options.legStyle",
  headboard: "customize.options.headboard",
  countertop: "customize.options.countertop",
};

const configLabel = (key) =>
  CONFIG_LABEL_KEYS[key] ? t(CONFIG_LABEL_KEYS[key]) : key.charAt(0).toUpperCase() + key.slice(1);

// price breakdown lines (skip base — shown separately)
const priceBreakdown = computed(() => {
  if (!currentType.value) return [];
  return configKeys.value
    .filter((k) => selectedConfig.value[k]?.price != null)
    .map((k) => ({
      label: configLabel(k),
      name: selectedConfig.value[k].name,
      price: selectedConfig.value[k].price,
    }));
});
</script>

<template>
  <div class="cu-page">
    <!-- hero -->
    <section
      class="cu-hero d-flex align-items-center overflow-hidden position-relative"
    >
      <img
        src="/showcase/customize-hero.jpg"
        alt=""
        class="cu-hero-img position-absolute inset-0 w-100 h-100 object-fit-cover"
      />

      <div class="cu-hero-inner position-relative z-1">
        <p class="cu-crumb mb-4">
          <RouterLink to="/">{{ $t('customize.breadcrumb.home') }}</RouterLink>&ensp;<ChevronRight
            size="10"
          />&ensp;
          <RouterLink to="/showcase">{{ $t('customize.breadcrumb.showcase') }}</RouterLink>&ensp;<ChevronRight
            size="10"
          />&ensp;
          <span>{{ $t('customize.breadcrumb.customize') }}</span>
        </p>

        <h1 class="cu-hero-title fw-bold pb-4">{{ $t('customize.title') }}</h1>
        <p class="cu-hero-sub">{{ $t('customize.subtitle') }}</p>
      </div>
    </section>

    <!-- workspace -->
    <div
      class="cu-workspace container-fluid mt-5 d-grid align-items-start gap-4"
      :class="{ 'cu-workspace--mobile': isNarrow }"
    >
      <!--configuration panel -->
      <aside
        class="cu-panel cu-panel--left overflow-hidden overflow-y-auto"
        :class="{
          'position-sticky': !isNarrow,
          'cu-panel--left-mobile': isNarrow,
        }"
      >
        <!-- STEP 1: furniture type -->
        <div class="cu-step p-4">
          <h2 class="cu-step-title mb-4 d-flex align-items-center gap-2">
            <span
              class="cu-step-num rounded-pill d-inline-flex align-items-center justify-content-center"
              >1</span
            >
            {{ $t('customize.step1') }}
          </h2>

          <!-- area tabs -->
          <div class="cu-area-tabs d-flex gap-2 mb-4" role="tablist">
            <button
              v-for="area in AREAS"
              :key="area"
              class="cu-area-tab px-3 py-1 rounded-pill"
              :class="{ active: selectedArea === area }"
              @click="selectArea(area)"
              role="tab"
            >
              {{ area }}
            </button>
          </div>

          <!-- furniture type grid -->
          <div class="cu-type-grid d-grid gap-3">
            <button
              v-for="ft in furnitureInArea"
              :key="ft.id"
              class="cu-type-card d-flex flex-column align-items-center gap-1 p-3 border-1 rounded-4 text-center"
              :class="{ active: selectedTypeId === ft.id }"
              @click="selectType(ft.id)"
            >
              <div class="cu-type-icon">
                <component
                  :is="FURNITURE_ICONS[ft.id] || SofaIcon"
                  :size="22"
                />
              </div>
              <span class="cu-type-name">{{ ft.name }}</span>
              <span class="cu-type-price"
                >from {{ formatPrice(ft.basePrice) }}</span
              >
            </button>
          </div>
        </div>

        <!-- STEP 2: customisation options -->
        <template v-if="currentType">
          <div class="cu-step cu-step--config p-4 border-0">
            <h2 class="cu-step-title mb-4 d-flex align-items-center gap-2">
              <span
                class="cu-step-num rounded-pill d-inline-flex align-items-center justify-content-center"
                >2</span
              >
              {{ $t('customize.step2') }}
              <span class="cu-step-sub">{{ currentType.name }}</span>
            </h2>

            <div
              v-for="key in configKeys"
              :key="key"
              class="cu-config-section mb-4"
            >
              <h3 class="cu-config-heading fw-bold text-uppercase mb-2">
                {{ configLabel(key) }}
              </h3>

              <!-- colour swatches -->
              <div
                v-if="key === 'color'"
                class="cu-color-grid d-flex flex-wrap gap-2"
              >
                <button
                  v-for="opt in currentType.configs[key]"
                  :key="opt.id"
                  class="cu-swatch d-flex align-items-center gap-1 px-2 py-1 border-1 rounded-pill"
                  :class="{ active: selectedConfig[key]?.id === opt.id }"
                  :title="
                    opt.name +
                    (opt.price ? ' +' + formatPrice(opt.price) : ' ' + $t('customize.options.included'))
                  "
                  @click="selectOption(key, opt)"
                >
                  <span
                    class="cu-swatch-dot rounded-pill"
                    :style="{ background: opt.hex }"
                  ></span>
                  <span class="cu-swatch-label d-flex align-items-center gap-1">
                    {{ opt.name }}
                    <span v-if="opt.price" class="cu-opt-price ms-auto"
                      >+{{ formatPrice(opt.price) }}</span
                    >
                  </span>
                  <CheckCircle2
                    v-if="selectedConfig[key]?.id === opt.id"
                    :size="12"
                    class="cu-swatch-check"
                  />
                </button>
              </div>

              <!-- regular option cards -->
              <div v-else class="cu-opt-grid d-flex flex-column gap-2">
                <button
                  v-for="opt in currentType.configs[key]"
                  :key="opt.id"
                  class="cu-opt-card d-flex align-items-center gap-2 px-3 py-2 border-1 rounded-4 text-left w-100 justify-content-between"
                  :class="{ active: selectedConfig[key]?.id === opt.id }"
                  @click="selectOption(key, opt)"
                >
                  <span class="cu-opt-name">{{ opt.name }}</span>
                  <span class="cu-opt-price ms-auto">
                    {{
                      opt.price === 0
                        ? $t('customize.options.includedBare')
                        : opt.price < 0
                          ? "− " + formatPrice(Math.abs(opt.price))
                          : "+ " + formatPrice(opt.price)
                    }}
                  </span>
                  <CheckCircle2
                    v-if="selectedConfig[key]?.id === opt.id"
                    :size="12"
                    class="cu-opt-check"
                  />
                </button>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="cu-empty-hint px-2 py-5 text-center">
          <SofaIcon :size="40" stroke-width="1" class="cu-empty-icon mb-2" />
          <p>{{ $t('customize.selectPrompt') }}</p>
        </div>
      </aside>

      <!-- 3d viewer -->
      <main class="cu-panel cu-panel--right d-flex flex-column gap-2">
        <!-- 3D viewer -->
        <div class="cu-viewer-wrap position-relative overflow-hidden">
          <!-- call FurnitureViewer.vue -->
          <FurnitureViewer
            ref="viewerRef"
            :skeleton-type="currentType?.skeletonType || ''"
            :furniture-type="currentType?.id || ''"
            :configuration="selectedConfig"
            class="cu-viewer w-100 h-100"
          />

          <!-- no-selection overlay -->
          <div
            v-if="!currentType"
            class="cu-viewer-placeholder position-absolute d-flex flex-column align-items-center justify-content-center gap-2 text-center p-4"
          >
            <SofaIcon :size="56" stroke-width="1" class="cu-ph-icon mb-2" />
            <p class="cu-ph-text m-0 fs-5">{{ $t('customize.previewTitle') }}</p>
            <p class="cu-ph-sub m-0">{{ $t('customize.previewSub') }}</p>
          </div>
        </div>

        <!-- price summary -->
        <div v-if="currentType" class="cu-price-card p-4">
          <h3 class="cu-price-title mb-4 fw-semibold border-bottom fs-5">
            {{ $t('customize.price.summary') }}
          </h3>
          <div class="cu-price-rows d-flex flex-column gap-2">
            <div class="cu-price-row d-flex justify-content-between">
              <span>{{ $t('customize.price.base', { name: currentType.name }) }}</span>
              <span>{{ formatPrice(currentType.basePrice) }}</span>
            </div>
            <div
              v-for="line in priceBreakdown"
              :key="line.label"
              class="cu-price-row d-flex justify-content-between"
            >
              <span>{{ line.label }}: {{ line.name }}</span>
              <span
                :class="line.price < 0 ? 'cu-price--deduct' : 'cu-price--add'"
              >
                {{
                  line.price === 0
                    ? "—"
                    : line.price < 0
                      ? "− " + formatPrice(Math.abs(line.price))
                      : "+ " + formatPrice(line.price)
                }}
              </span>
            </div>
          </div>
          <div class="cu-price-divider"></div>
          <div
            class="cu-price-total d-flex justify-content-between align-items-baseline mb-2"
          >
            <span>{{ $t('customize.price.total') }}</span>
            <span class="cu-price-amount fw-bold">{{
              formatPrice(totalPrice)
            }}</span>
          </div>

          <!-- toast messages -->
          <Transition name="toast">
            <div v-if="cartSuccess" class="cu-toast cu-toast--success d-flex align-items-center gap-1 px-3 py-2 rounded-3 mb-2">
              <CheckCircle2 :size="16" />
              {{ $t('customize.toast.cartSuccess') }}
            </div>
            <div v-else-if="cartError" class="cu-toast cu-toast--error d-flex align-items-center gap-1 px-3 py-2 rounded-3 mb-2">
              <AlertCircle :size="16" />
              {{ cartError }}
            </div>
            <div v-else-if="contribSuccess" class="cu-toast cu-toast--success d-flex align-items-center gap-1 px-3 py-2 rounded-3 mb-2">
              <CheckCircle2 :size="16" />
              {{ $t('customize.toast.contribSuccess') }}
            </div>
          </Transition>

          <!-- CTA buttons -->
          <div class="cu-cta d-grid gap-2">
            <button
              class="cu-btn cu-btn--cart d-flex align-items-center justify-content-center gap-2   py-3 border-0"
              @click="addToCart"
              :disabled="cartLoading"
            >
              <span v-if="cartLoading" class="cu-btn-spinner"></span>
              <ShoppingCart v-else :size="17" />
              {{ cartLoading ? $t('customize.adding') : $t('customize.addToCart') }}
            </button>
            <button class="cu-btn cu-btn--contrib d-flex align-items-center justify-content-center gap-2   py-3" @click="openContribModal">
              <Sparkles :size="17" />
              {{ $t('customize.contribute') }}
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- contribution modal -->
    <ContributionModal
      v-model="contribOpen"
      :preview-image="contribPreview"
      :furniture-name="currentType?.name || ''"
      :area="currentType?.area || ''"
      :total-price="totalPrice"
      :submitting="contribSubmitting"
      :submit-error="contribError"
      @submit="submitContribution"
    />
  </div>

  <Onboarding />
</template>

<style scoped>
@import "@/styles/main.css";

.cu-page {
  --cu-bg: var(--bg-page);
  --cu-card: var(--bg-surface);
  --cu-border: var(--border);
  --cu-text: var(--color-primary);
  --cu-text-2: var(--color-secondary);
  --cu-muted: var(--accent-dk);
  --cu-accent: var(--accent);
  --cu-accent-dk: var(--btn-bg);
  --cu-hover: var(--bg-elevated);
  min-height: 100vh;
  background: var(--cu-bg);
}
.cu-hero {
  height: 400px;
  background: #1e1a14;
}

.cu-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(30, 26, 20, 0.88) 0%,
    rgba(30, 26, 20, 0) 70%
  );
  pointer-events: none;
  z-index: 0;
}

.cu-hero-img {
  object-position: right center;
}

.cu-hero-inner {
  font-family: "Times New Roman", serif;
  padding: 0 5rem;
  max-width: 700px;
}

.cu-crumb {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-sm);
  letter-spacing: 0.04em;
  color: #f0e1cc;
}

.cu-crumb a {
  color: #f0e1cc;
  text-decoration: none;
  transition: color 0.2s;
}
.cu-crumb a:hover {
  color: #dbbea0;
}

.cu-hero-title {
  font-family: "Times New Roman", serif;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #f0e1cc;
  line-height: 1.1;
}

.cu-hero-sub {
  font-size: var(--fs-base);
  color: #f0e1cc;
  letter-spacing: 0.04em;
  max-width: 380px;
  line-height: 1.6;
}

/* workspace layout */
.cu-workspace {
  padding: 0 1.25rem 4rem;
  grid-template-columns: 380px 1fr;
}

@media (min-width: 1200px) {
  .cu-workspace {
    padding: 0 3rem 4rem;
  }
}

/* left panel */
.cu-panel--left {
  background: var(--cu-card);
  border: 1px solid var(--cu-border);
  top: 80px;
  max-height: calc(100vh - 100px);
  scrollbar-width: thin;
  scrollbar-color: #e0d8cc transparent;
}

.cu-step {
  border-bottom: 1px solid var(--cu-border);
}

.cu-step-title {
  font-family: "Times New Roman", serif;
  font-size: 1.05rem;
  color: var(--cu-text);
}

.cu-step-num {
  width: 22px;
  height: 22px;
  background: var(--cu-accent-dk);
  color: #f0ebe2;
  font-size: var(--fs-xs);
  font-family: sans-serif;
  flex-shrink: 0;
}

.cu-step-sub {
  font-size: var(--fs-base);
  color: var(--cu-muted);
  font-style: italic;
  font-family: "Times New Roman", serif;
}

/* area tabs */
.cu-area-tabs {
  font-family: "Times New Roman", serif;
  flex-wrap: wrap;
}

.cu-area-tab {
  font-size: var(--fs-sm);
  border: 1px solid var(--color-secondary);
  background: transparent;
  color: var(--cu-text-2);
  cursor: pointer;
  transition: all 0.15s;
}

.cu-area-tab.active,
.cu-area-tab:hover {
  background: var(--cu-accent-dk);
  color: #f0ebe2;
  border-color: var(--cu-accent-dk);
}

/* furniture type grid */
.cu-type-grid {
  grid-template-columns: 1fr 1fr;
}

.cu-type-card {
  border: 1.5px solid var(--color-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;
}

.cu-type-card:hover {
  border-color: var(--cu-accent);
  background: var(--cu-hover);
}
.cu-type-card.active {
  border-color: var(--cu-accent-dk);
  background: #2c2218;
  color: #f0ebe2;
}
.cu-type-card.active .cu-type-name,
.cu-type-card.active .cu-type-price {
  color: #f0ebe2;
}
.cu-type-card.active .cu-type-icon {
  color: #c4a882;
}

.cu-type-icon {
  color: var(--cu-muted);
}
.cu-type-name {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--cu-text);
  line-height: 1.2;
}
.cu-type-price {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-xs);
  color: var(--cu-muted);
}

/* config sections */

.cu-config-heading {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
  color: var(--cu-muted);
}

.cu-swatch {
  font-family: "Times New Roman", serif;
  border: 1.5px solid var(--color-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
  font-size: var(--fs-sm);
  color: var(--cu-text-2);
}

.cu-swatch.active {
  border-color: var(--cu-accent-dk);
  background: var(--cu-hover);
}
.cu-swatch:hover {
  border-color: var(--cu-accent);
}

.cu-swatch-dot {
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.cu-swatch-check {
  color: var(--cu-accent-dk);
  flex-shrink: 0;
}

.cu-opt-card {
  font-family: "Times New Roman", serif;
  border: 1.5px solid var(--color-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.cu-opt-card:hover {
  border-color: var(--cu-accent);
  background: var(--cu-hover);
}
.cu-opt-card.active {
  border-color: var(--cu-accent-dk);
  background: var(--cu-hover);
}

.cu-opt-name {
  font-size: var(--fs-base);
  color: var(--cu-text);
}
.cu-opt-price {
  font-size: var(--fs-sm);
  color: var(--cu-muted);
}
.cu-opt-check {
  color: var(--cu-accent-dk);
  flex-shrink: 0;
}

/* empty hint */
.cu-empty-hint {
  font-family: "Times New Roman", serif;
  color: var(--cu-muted);
  font-size: var(--fs-base);
  line-height: 1.6;
}

.cu-empty-icon {
  color: #d4c4b0;
}

/* 3D viewer */
.cu-viewer-wrap {
  background: #f5f0e8;
  border: 1px solid var(--cu-border);
  height: 630px;
}

.cu-viewer-placeholder {
  inset: 0;
  background: #f5f0e8;
}

[data-theme="dark"] .cu-viewer-placeholder {
  background: var(--border-light);
}

.cu-ph-icon {
  color: #d4c4b0;
}
.cu-ph-text {
  font-family: "Times New Roman", serif;
  color: var(--cu-text);
}
.cu-ph-sub {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-base);
  color: var(--cu-muted);
}

/* price card */
.cu-price-card {
  font-family: "Times New Roman", serif;
  background: var(--cu-card);
  border: 1px solid var(--cu-border);
}

.cu-price-title {
  font-family: "Times New Roman", serif;
  color: var(--cu-text);
}

.cu-price-row {
  font-size: var(--fs-base);
  color: var(--cu-text-2);
}

.cu-price--add {
  color: var(--cu-muted);
}
.cu-price--deduct {
  color: var(--cu-muted);
}

.cu-price-divider {
  height: 1px;
  background: var(--cu-border);
  margin: 0.85rem 0;
}

.cu-price-total > span:first-child {
  font-size: var(--fs-base);
  color: var(--cu-text-2);
  font-weight: 600;
}

.cu-price-amount {
  font-family: "Times New Roman", serif;
  font-size: 1.6rem;
  color: var(--cu-text);
}

/* toasts */
.cu-toast {
  font-size: var(--fs-base);
}

.cu-toast--success {
  background: #edf7ed;
  color: #3a6b3a;
  border: 1px solid #b8dab8;
}
.cu-toast--error {
  background: #fdf0ed;
  color: #9b4030;
  border: 1px solid #e8a090;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* CTA buttons */
.cu-cta {
  grid-template-columns: 1fr 1fr;
}

.cu-btn {
  font-size: var(--fs-base);
  cursor: pointer;
  transition: all 0.18s;
}

.cu-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.cu-btn--cart {
  background: #2c2218;
  color: #f0ebe2;
}

.cu-btn--cart:hover:not(:disabled) {
  background: #3d3024;
}

[data-theme="dark"] .cu-btn--cart {
  background: var(--btn-bg);
  color: var(--btn-color);
}

[data-theme="dark"] .cu-btn--cart:hover {
  background: var(--btn-bg-hover);
}

.cu-btn--contrib {
  background: transparent;
  color: var(--cu-text);
  border: 1.5px solid var(--cu-border);
}

[data-theme="dark"] .cu-btn--contrib {
  border: 1px solid var(--color-subtle);
  background: var(--bg-alt);
}

.cu-btn--contrib:hover {
  background: var(--cu-hover);
  border-color: var(--cu-accent);
}

.cu-btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(240, 235, 226, 0.3);
  border-top-color: #f0ebe2;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* responsive */
.cu-workspace--mobile {
  grid-template-columns: 1fr;
}
.cu-panel--left-mobile {
  position: static;
  max-height: none;
  overflow-y: visible;
}

@media (max-width: 992px) {
  .cu-workspace {
    grid-template-columns: 1fr;
  }
  .cu-panel--left {
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  .cu-viewer-wrap {
    height: 380px;
  }
  .cu-hero-inner {
    padding: 0 2.5rem;
  }
  .cu-hero-orn,
  .cu-hero-orn-sm {
    display: none;
  }
}

@media (max-width: 767px) {
  .cu-hero {
    height: auto;
    min-height: 300px;
  }
  .cu-hero-inner {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .cu-type-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .cu-cta {
    grid-template-columns: 1fr;
  }
  .cu-viewer-wrap {
    height: 300px;
  }
}

@media (max-width: 430px) {
  .cu-type-grid {
    grid-template-columns: 1fr 1fr;
  }
  .cu-workspace {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .cu-step {
    padding: 1rem !important;
  }
  .cu-price-card {
    padding: 1rem !important;
  }
  .cu-price-amount {
    font-size: 1.2rem;
  }
  .cu-price-row {
    font-size: var(--fs-sm);
  }
  .cu-area-tabs {
    gap: 0.35rem !important;
  }
}
</style>
