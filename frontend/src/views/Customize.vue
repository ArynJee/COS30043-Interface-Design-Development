<script setup>
import { ref, computed } from 'vue'
import {
  Sofa as SofaIcon,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from '@lucide/vue'
import FurnitureViewer from '@/components/FurnitureViewer.vue'
import ContributionModal from '@/components/ContributionModal.vue'
import useCustomize from '@/hooks/useCustomize.js'

const viewerRef = ref(null)

const {
  selectedArea, selectedTypeId, selectedConfig,
  AREAS, furnitureInArea, currentType, configKeys, totalPrice,
  selectArea, selectType, selectOption,
  cartLoading, cartSuccess, cartError, addToCart,
  contribOpen, contribSubmitting, contribError, contribSuccess,
  contribPreview, openContribModal, submitContribution,
  formatPrice,
} = useCustomize(viewerRef)

// friendly label map for config section headings
const CONFIG_LABELS = {
  shape:     'Shape / Form',
  fabric:    'Fabric',
  material:  'Material',
  color:     'Colour',
  legs:      'Leg Style',
  headboard: 'Headboard Style',
  countertop:'Countertop Material',
}

const configLabel = (key) => CONFIG_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)

// price breakdown lines (skip base — shown separately)
const priceBreakdown = computed(() => {
  if (!currentType.value) return []
  return configKeys.value
    .filter(k => selectedConfig.value[k]?.price != null)
    .map(k => ({
      label: configLabel(k),
      name:  selectedConfig.value[k].name,
      price: selectedConfig.value[k].price,
    }))
})
</script>

<template>
  <div class="cu-page">

    <!-- ── HERO ──────────────────────────────────────────────────────────── -->
    <section class="cu-hero">
      <div class="cu-hero-inner container">
        <p class="cu-crumb">
          <RouterLink to="/">Home</RouterLink>&ensp;›&ensp;
          <RouterLink to="/products">Products</RouterLink>&ensp;›&ensp;
          <span>Customize</span>
        </p>
        <div class="cu-hero-text">
          <div class="cu-eyebrow">
            <span class="ey-line"></span>
            <span class="ey-text">HD FEATURE</span>
            <span class="ey-line"></span>
          </div>
          <h1 class="cu-hero-title">Design Your Furniture</h1>
          <p class="cu-hero-sub">
            Craft something uniquely yours — choose shape, material, colour, fabric and watch
            your design come to life in real-time 3D.
          </p>
        </div>
      </div>
    </section>

    <!-- ── MAIN WORKSPACE ─────────────────────────────────────────────────── -->
    <div class="cu-workspace container">

      <!-- ═══ LEFT PANEL — Selector + Config ══════════════════════════════ -->
      <aside class="cu-panel cu-panel--left">

        <!-- STEP 1: furniture type -->
        <div class="cu-step">
          <h2 class="cu-step-title">
            <span class="cu-step-num">1</span> Select Furniture
          </h2>

          <!-- area tabs -->
          <div class="cu-area-tabs" role="tablist">
            <button
              v-for="area in AREAS"
              :key="area"
              class="cu-area-tab"
              :class="{ active: selectedArea === area }"
              @click="selectArea(area)"
              role="tab"
            >{{ area }}</button>
          </div>

          <!-- furniture type grid -->
          <div class="cu-type-grid">
            <button
              v-for="ft in furnitureInArea"
              :key="ft.id"
              class="cu-type-card"
              :class="{ active: selectedTypeId === ft.id }"
              @click="selectType(ft.id)"
            >
              <div class="cu-type-icon">
                <SofaIcon :size="22" />
              </div>
              <span class="cu-type-name">{{ ft.name }}</span>
              <span class="cu-type-price">from {{ formatPrice(ft.basePrice) }}</span>
            </button>
          </div>
        </div>

        <!-- STEP 2: customisation options -->
        <template v-if="currentType">
          <div class="cu-step cu-step--config">
            <h2 class="cu-step-title">
              <span class="cu-step-num">2</span> Customise
              <span class="cu-step-sub">{{ currentType.name }}</span>
            </h2>

            <div
              v-for="key in configKeys"
              :key="key"
              class="cu-config-section"
            >
              <h3 class="cu-config-heading">{{ configLabel(key) }}</h3>

              <!-- colour swatches -->
              <div v-if="key === 'color'" class="cu-color-grid">
                <button
                  v-for="opt in currentType.configs[key]"
                  :key="opt.id"
                  class="cu-swatch"
                  :class="{ active: selectedConfig[key]?.id === opt.id }"
                  :title="opt.name + (opt.price ? ' +' + formatPrice(opt.price) : ' (included)')"
                  @click="selectOption(key, opt)"
                >
                  <span class="cu-swatch-dot" :style="{ background: opt.hex }"></span>
                  <span class="cu-swatch-label">
                    {{ opt.name }}
                    <span v-if="opt.price" class="cu-opt-price">+{{ formatPrice(opt.price) }}</span>
                  </span>
                  <CheckCircle2 v-if="selectedConfig[key]?.id === opt.id" :size="12" class="cu-swatch-check" />
                </button>
              </div>

              <!-- regular option cards -->
              <div v-else class="cu-opt-grid">
                <button
                  v-for="opt in currentType.configs[key]"
                  :key="opt.id"
                  class="cu-opt-card"
                  :class="{ active: selectedConfig[key]?.id === opt.id }"
                  @click="selectOption(key, opt)"
                >
                  <span class="cu-opt-name">{{ opt.name }}</span>
                  <span class="cu-opt-price">
                    {{ opt.price === 0 ? 'included'
                     : opt.price < 0  ? '− ' + formatPrice(Math.abs(opt.price))
                     :                  '+ ' + formatPrice(opt.price) }}
                  </span>
                  <CheckCircle2 v-if="selectedConfig[key]?.id === opt.id" :size="12" class="cu-opt-check" />
                </button>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="cu-empty-hint">
          <SofaIcon :size="40" stroke-width="1" class="cu-empty-icon" />
          <p>Select a furniture type above<br>to start customising.</p>
        </div>

      </aside>

      <!-- ═══ RIGHT PANEL — 3D Viewer + Price Summary ══════════════════════ -->
      <main class="cu-panel cu-panel--right">

        <!-- 3D viewer -->
        <div class="cu-viewer-wrap">
          <FurnitureViewer
            ref="viewerRef"
            :skeleton-type="currentType?.skeletonType || ''"
            :furniture-type="currentType?.id || ''"
            :configuration="selectedConfig"
            class="cu-viewer"
          />

          <!-- no-selection overlay -->
          <div v-if="!currentType" class="cu-viewer-placeholder">
            <SofaIcon :size="56" stroke-width="1" class="cu-ph-icon" />
            <p class="cu-ph-text">Your 3D preview will appear here</p>
            <p class="cu-ph-sub">Select a furniture type to begin</p>
          </div>
        </div>

        <!-- price summary -->
        <div v-if="currentType" class="cu-price-card">
          <h3 class="cu-price-title">Price Summary</h3>
          <div class="cu-price-rows">
            <div class="cu-price-row">
              <span>Base ({{ currentType.name }})</span>
              <span>{{ formatPrice(currentType.basePrice) }}</span>
            </div>
            <div
              v-for="line in priceBreakdown"
              :key="line.label"
              class="cu-price-row"
            >
              <span>{{ line.label }}: {{ line.name }}</span>
              <span :class="line.price < 0 ? 'cu-price--deduct' : 'cu-price--add'">
                {{ line.price === 0 ? '—'
                 : line.price < 0  ? '− ' + formatPrice(Math.abs(line.price))
                 :                   '+ ' + formatPrice(line.price) }}
              </span>
            </div>
          </div>
          <div class="cu-price-divider"></div>
          <div class="cu-price-total">
            <span>Total Estimated</span>
            <span class="cu-price-amount">{{ formatPrice(totalPrice) }}</span>
          </div>

          <!-- example summary pill -->
          <div class="cu-config-summary">
            <span
              v-for="key in configKeys"
              :key="key"
              v-if="selectedConfig[key]"
              class="cu-config-chip"
            >
              {{ configLabel(key) }}: {{ selectedConfig[key]?.name }}
            </span>
          </div>

          <!-- toast messages -->
          <Transition name="toast">
            <div v-if="cartSuccess" class="cu-toast cu-toast--success">
              <CheckCircle2 :size="16" />
              Added to cart successfully!
            </div>
            <div v-else-if="cartError" class="cu-toast cu-toast--error">
              <AlertCircle :size="16" />
              {{ cartError }}
            </div>
            <div v-else-if="contribSuccess" class="cu-toast cu-toast--success">
              <CheckCircle2 :size="16" />
              Design contributed to Showcase!
            </div>
          </Transition>

          <!-- CTA buttons -->
          <div class="cu-cta">
            <button
              class="cu-btn cu-btn--cart"
              @click="addToCart"
              :disabled="cartLoading"
            >
              <span v-if="cartLoading" class="cu-btn-spinner"></span>
              <ShoppingCart v-else :size="17" />
              {{ cartLoading ? 'Adding…' : 'Add to Cart' }}
            </button>
            <button class="cu-btn cu-btn--contrib" @click="openContribModal">
              <Sparkles :size="17" />
              Contribute Work
            </button>
          </div>
        </div>

      </main>
    </div>

    <!-- ── CONTRIBUTION MODAL ─────────────────────────────────────────────── -->
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
</template>

<style scoped>
/* ── variables ────────────────────────────────────────────────────────────── */
.cu-page {
  --cu-bg:        #faf7f2;
  --cu-card:      #fff;
  --cu-border:    #e8e0d4;
  --cu-text:      #2c2218;
  --cu-text-2:    #5a4a3a;
  --cu-muted:     #8B7355;
  --cu-accent:    #c4a882;
  --cu-accent-dk: #2c2218;
  --cu-hover:     #f5f0e8;
  min-height: 100vh;
  background: var(--cu-bg);
}

/* ── hero ─────────────────────────────────────────────────────────────────── */
.cu-hero {
  background: linear-gradient(135deg, #2c2218 0%, #4a3828 100%);
  color: #f0ebe2;
  padding: 3.5rem 0 2.8rem;
}

.cu-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

.cu-crumb {
  font-size: 0.8rem;
  color: rgba(240,235,226,0.6);
  margin-bottom: 1.5rem;
}

.cu-crumb a { color: rgba(240,235,226,0.7); text-decoration: none; }
.cu-crumb a:hover { color: #f0ebe2; }

.cu-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.ey-line { flex: 0 0 28px; height: 1px; background: #c4a882; }
.ey-text { font-size: 0.72rem; letter-spacing: 0.12em; color: #c4a882; }

.cu-hero-title {
  font-family: 'Times New Roman', serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin: 0 0 0.75rem;
  color: #f0ebe2;
}

.cu-hero-sub {
  font-size: 0.95rem;
  color: rgba(240,235,226,0.75);
  max-width: 520px;
  line-height: 1.6;
  margin: 0;
}

/* ── workspace layout ────────────────────────────────────────────────────── */
.cu-workspace {
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1.5rem 4rem;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  align-items: start;
}

/* ── left panel ──────────────────────────────────────────────────────────── */
.cu-panel--left {
  background: var(--cu-card);
  border: 1px solid var(--cu-border);
  border-radius: 16px;
  overflow: hidden;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e0d8cc transparent;
}

.cu-step {
  padding: 1.5rem;
  border-bottom: 1px solid var(--cu-border);
}

.cu-step--config { border-bottom: none; }

.cu-step-title {
  font-family: 'Times New Roman', serif;
  font-size: 1.05rem;
  color: var(--cu-text);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cu-step-num {
  width: 22px;
  height: 22px;
  background: var(--cu-accent-dk);
  color: #f0ebe2;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-family: sans-serif;
  flex-shrink: 0;
}

.cu-step-sub {
  font-size: 0.82rem;
  color: var(--cu-muted);
  font-style: italic;
  font-family: 'Times New Roman', serif;
}

/* area tabs */
.cu-area-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.cu-area-tab {
  font-size: 0.77rem;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--cu-border);
  background: transparent;
  color: var(--cu-text-2);
  cursor: pointer;
  transition: all 0.15s;
}

.cu-area-tab.active,
.cu-area-tab:hover { background: var(--cu-accent-dk); color: #f0ebe2; border-color: var(--cu-accent-dk); }

/* furniture type grid */
.cu-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.cu-type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.75rem 0.5rem;
  border: 1.5px solid var(--cu-border);
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;
  text-align: center;
}

.cu-type-card:hover  { border-color: var(--cu-accent); background: var(--cu-hover); }
.cu-type-card.active { border-color: var(--cu-accent-dk); background: #2c2218; color: #f0ebe2; }
.cu-type-card.active .cu-type-name,
.cu-type-card.active .cu-type-price { color: #f0ebe2; }
.cu-type-card.active .cu-type-icon  { color: #c4a882; }

.cu-type-icon  { color: var(--cu-muted); }
.cu-type-name  { font-size: 0.80rem; font-weight: 600; color: var(--cu-text); line-height: 1.2; }
.cu-type-price { font-size: 0.70rem; color: var(--cu-muted); }

/* config sections */
.cu-config-section { margin-bottom: 1.25rem; }

.cu-config-heading {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cu-muted);
  margin: 0 0 0.5rem;
}

/* colour swatches */
.cu-color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.cu-swatch {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 4px 8px 4px 5px;
  border: 1.5px solid var(--cu-border);
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.75rem;
  color: var(--cu-text-2);
}

.cu-swatch.active { border-color: var(--cu-accent-dk); background: var(--cu-hover); }
.cu-swatch:hover  { border-color: var(--cu-accent); }

.cu-swatch-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.12);
  flex-shrink: 0;
}

.cu-swatch-label { display: flex; align-items: center; gap: 0.25rem; }
.cu-swatch-check { color: var(--cu-accent-dk); flex-shrink: 0; }

/* option cards */
.cu-opt-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cu-opt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.7rem;
  border: 1.5px solid var(--cu-border);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}

.cu-opt-card:hover  { border-color: var(--cu-accent); background: var(--cu-hover); }
.cu-opt-card.active { border-color: var(--cu-accent-dk); background: var(--cu-hover); }

.cu-opt-name  { font-size: 0.82rem; color: var(--cu-text); }
.cu-opt-price { font-size: 0.74rem; color: var(--cu-muted); margin-left: auto; margin-right: 0.4rem; }
.cu-opt-check { color: var(--cu-accent-dk); flex-shrink: 0; }

/* empty hint */
.cu-empty-hint {
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: var(--cu-muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.cu-empty-icon { color: #d4c4b0; margin-bottom: 0.75rem; }

/* ── right panel ──────────────────────────────────────────────────────────── */
.cu-panel--right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 3D viewer */
.cu-viewer-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f0e8;
  border: 1px solid var(--cu-border);
  height: 480px;
}

.cu-viewer { width: 100%; height: 100%; }

.cu-viewer-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f0e8;
  gap: 0.5rem;
  text-align: center;
  padding: 2rem;
}

.cu-ph-icon  { color: #d4c4b0; margin-bottom: 0.5rem; }
.cu-ph-text  { font-family: 'Times New Roman', serif; font-size: 1.1rem; color: var(--cu-text); margin: 0; }
.cu-ph-sub   { font-size: 0.82rem; color: var(--cu-muted); margin: 0; }

/* price card */
.cu-price-card {
  background: var(--cu-card);
  border: 1px solid var(--cu-border);
  border-radius: 16px;
  padding: 1.5rem;
}

.cu-price-title {
  font-family: 'Times New Roman', serif;
  font-size: 1.05rem;
  color: var(--cu-text);
  margin: 0 0 1rem;
}

.cu-price-rows  { display: flex; flex-direction: column; gap: 0.35rem; }

.cu-price-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--cu-text-2);
}

.cu-price--add    { color: var(--cu-muted); }
.cu-price--deduct { color: #7a9e7e; }

.cu-price-divider { height: 1px; background: var(--cu-border); margin: 0.85rem 0; }

.cu-price-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.cu-price-total > span:first-child { font-size: 0.88rem; color: var(--cu-text-2); font-weight: 600; }

.cu-price-amount {
  font-family: 'Times New Roman', serif;
  font-size: 1.6rem;
  color: var(--cu-text);
  font-weight: bold;
}

/* config summary chips */
.cu-config-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.cu-config-chip {
  font-size: 0.73rem;
  background: #f0ebe2;
  color: #5a4a3a;
  border: 1px solid #e0d8cc;
  padding: 3px 9px;
  border-radius: 20px;
}

/* toasts */
.cu-toast {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  font-size: 0.83rem;
  margin-bottom: 0.85rem;
}

.cu-toast--success { background: #edf7ed; color: #3a6b3a; border: 1px solid #b8dab8; }
.cu-toast--error   { background: #fdf0ed; color: #9b4030; border: 1px solid #e8a090; }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateY(-8px); }

/* CTA buttons */
.cu-cta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.cu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s;
}

.cu-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.cu-btn--cart {
  background: #2c2218;
  color: #f0ebe2;
}

.cu-btn--cart:hover:not(:disabled) { background: #3d3024; }

.cu-btn--contrib {
  background: transparent;
  color: var(--cu-text);
  border: 1.5px solid var(--cu-border);
}

.cu-btn--contrib:hover { background: var(--cu-hover); border-color: var(--cu-accent); }

.cu-btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(240,235,226,0.3);
  border-top-color: #f0ebe2;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 992px) {
  .cu-workspace {
    grid-template-columns: 1fr;
  }
  .cu-panel--left {
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  .cu-viewer-wrap { height: 380px; }
}

@media (max-width: 576px) {
  .cu-type-grid { grid-template-columns: 1fr 1fr 1fr; }
  .cu-cta       { grid-template-columns: 1fr; }
  .cu-viewer-wrap { height: 300px; }
}

/* ── dark mode ───────────────────────────────────────────────────────────── */
[data-theme="dark"] .cu-page        { --cu-bg: #100e0b; --cu-card: #1a1610; --cu-border: #2e2820; --cu-text: #f0ebe2; --cu-text-2: #c8b89a; --cu-muted: #a08868; --cu-hover: #241e18; }
[data-theme="dark"] .cu-area-tab    { color: #c8b89a; }
[data-theme="dark"] .cu-type-card   { color: #c8b89a; }
[data-theme="dark"] .cu-opt-card    { color: #c8b89a; }
[data-theme="dark"] .cu-swatch      { color: #c8b89a; }
[data-theme="dark"] .cu-config-chip { background: #241e18; color: #c8b89a; border-color: #2e2820; }
[data-theme="dark"] .cu-price-card  { background: #1a1610; }
[data-theme="dark"] .cu-btn--contrib{ color: #c8b89a; }
[data-theme="dark"] .cu-viewer-placeholder { background: #1a1610; }
[data-theme="dark"] .cu-ph-text     { color: #f0ebe2; }
</style>
