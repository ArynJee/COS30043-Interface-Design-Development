<script setup>
import { ChevronRight, Clock, MapPin, ExternalLink, X } from '@lucide/vue'
import { DAYS, branches, useLocation } from '@/hooks/useLocation.js'

const {
  mapRef,
  activeModal,
  activeBranchId,
  mapError,
  cardRefs,
  onCardMouseenter,
  onCardMouseleave,
  onCardClick,
  openModal,
  closeModal,
  openGoogleMaps,
} = useLocation()
</script>

<template>
  <div class="loc-page">
    <!-- hero -->
    <section class="loc-hero d-flex align-items-center overflow-hidden position-relative">
      <img
        src="/home/kitchen-counter.jpeg"
        alt=""
        class="loc-hero-img position-absolute inset-0 w-100 h-100 object-fit-cover"
      />
      <div class="loc-hero-inner position-relative z-1">
        <p class="loc-crumb mb-4">
          <RouterLink to="/">Home</RouterLink>&ensp;<ChevronRight :size="10" />&ensp;
          <span>Locations</span>
        </p>
        <h1 class="loc-hero-title fw-bold pb-4">Find a Branch Near You</h1>
        <p class="loc-hero-sub">
          Visit one of our showrooms across Malaysia. Experience ComfyHome furniture in person
          with expert guidance from our in-store team.
        </p>
      </div>
    </section>

    <!-- workspace -->
    <div class="loc-workspace d-grid">
      <!-- left: branch cards -->
      <aside class="loc-panel loc-panel--left h-100 overflow-y-auto">
        <div
          v-for="branch in branches"
          :key="branch.id"
          :ref="(el) => { cardRefs[branch.id] = el }"
          class="loc-branch-card position-relative px-4 py-4"
          :class="{ 'is-active': activeBranchId === branch.id }"
          @mouseenter="onCardMouseenter(branch)"
          @mouseleave="onCardMouseleave"
          @click="onCardClick(branch)"
        >
          <p class="loc-branch-state text-uppercase fw-semibold">{{ branch.state }}</p>
          <h2 class="loc-branch-name fw-semibold">{{ branch.name }}</h2>
          <p class="loc-branch-address d-flex align-items-start gap-2">
            <MapPin :size="13" class="loc-pin-icon flex-shrink-0" />
            {{ branch.address }}
          </p>
          <div class="loc-branch-actions d-flex gap-2 flex-wrap">
            <button class="loc-btn loc-btn--hours d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill" @click.stop="openModal(branch)">
              <Clock :size="14" />
              View working hours
            </button>
            <button class="loc-btn loc-btn--maps d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill" @click.stop="openGoogleMaps(branch)">
              <ExternalLink :size="14" />
              View location
            </button>
          </div>
        </div>
      </aside>

      <!-- right: map -->
      <main class="loc-panel loc-panel--right position-relative h-100">
        <div ref="mapRef" class="loc-map w-100 h-100" :class="{ 'loc-map--hidden d-none': mapError }" />
        <div
          v-if="mapError"
          class="loc-map-error d-flex flex-column align-items-center justify-content-center gap-3 text-center p-4 w-100 h-100"
        >
          <MapPin :size="44" stroke-width="1" />
          <p>Map could not be loaded.</p>
          <p class="loc-map-hint">
            Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in your <code>.env</code> and restart the dev
            server.
          </p>
        </div>
      </main>
    </div>

    <!-- working hours modal -->
    <Teleport to="body">
      <Transition name="loc-fade">
        <div
          v-if="activeModal"
          class="loc-overlay position-fixed d-flex align-items-center justify-content-center p-4"
          @click.self="closeModal"
        >
          <div class="loc-modal overflow-hidden w-100" role="dialog" aria-modal="true">
            <div class="loc-modal-hd d-flex align-items-start justify-content-between gap-3 px-4 py-3">
              <div>
                <p class="loc-modal-state text-uppercase fw-semibold my-2">{{ activeModal.state }}</p>
                <h3 class="loc-modal-title fw-semibold m-0">{{ activeModal.name }}</h3>
              </div>
              <button
                class="loc-modal-close d-flex align-items-center justify-content-center flex-shrink-0 border-0 p-2"
                @click="closeModal"
                aria-label="Close"
              >
                <X :size="18" />
              </button>
            </div>
            <table class="loc-hours-table w-100 border-collapse">
              <tbody>
                <tr
                  v-for="day in DAYS"
                  :key="day"
                  :class="{ 'is-closed': activeModal.hours[day] === 'Closed' }"
                >
                  <td class="loc-hours-day">{{ day }}</td>
                  <td class="loc-hours-time">{{ activeModal.hours[day] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@import '@/styles/main.css';

.loc-page {
  min-height: 100vh;
  background: var(--bg-page);
}

.loc-hero {
  height: 400px;
  background: var(--btn-alt-bg);
}
.loc-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(30, 26, 20, 0.88) 0%, rgba(30, 26, 20, 0) 70%);
  pointer-events: none;
  z-index: 0;
}
.loc-hero-img { object-position: center center; }
.loc-hero-inner {
  font-family: var(--font-serif);
  padding: 0 5rem;
  max-width: 700px;
}
.loc-crumb {
  font-size: var(--fs-sm);
  letter-spacing: 0.04em;
  color: var(--color-cream);
  font-family: var(--font-serif);
}
.loc-crumb a { color: var(--color-cream); text-decoration: none; transition: color 0.2s; }
.loc-crumb a:hover { color: var(--accent); }
.loc-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: var(--color-cream);
  line-height: 1.1;
}
.loc-hero-sub {
  font-size: var(--fs-base);
  color: var(--color-cream);
  letter-spacing: 0.04em;
  max-width: 440px;
  line-height: 1.6;
}

.loc-workspace {
  grid-template-columns: clamp(260px, 32%, 400px) 1fr;
  height: 680px;
  border-bottom: 1px solid var(--border);
}

.loc-panel--left {
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

/* branch cards */
.loc-branch-card {
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}
.loc-branch-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: transparent;
  transition: background 0.2s ease;
}
.loc-branch-card:hover { background: var(--bg-elevated); }
.loc-branch-card:hover::before { background: var(--accent); }
.loc-branch-card.is-active { background: var(--bg-alt); }
.loc-branch-card.is-active::before { background: var(--accent-dk); }
.loc-branch-card.is-active .loc-branch-name { color: var(--accent-dk); }

.loc-branch-state {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  letter-spacing: 0.13em;
  color: var(--accent-dk);
}
.loc-branch-name {
  font-family: var(--font-serif);
  font-size: var(--fs-md);
  color: var(--color-primary);
  transition: color 0.2s;
}
.loc-branch-address {
  font-size: var(--fs-base);
  color: var(--color-secondary);
  line-height: 1.55;
}
.loc-pin-icon {
  margin-top: 6px;
  color: var(--accent-dk);
}

/* buttons — mirrors cu-btn patterns from Customize.vue */
.loc-btn {
  font-size: var(--fs-sm);
  font-family: var(--font-serif);
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
/* outlined — mirrors cu-btn--contrib */
.loc-btn--hours {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--color-primary);
}
.loc-btn--hours:hover {
  background: var(--bg-elevated);
  border-color: var(--accent);
}
/* filled dark — mirrors cu-btn--cart */
.loc-btn--maps {
  background: var(--btn-bg);
  border: none;
  color: var(--btn-color);
}
.loc-btn--maps:hover { background: var(--btn-bg-hover); }

/* layout */
.loc-map-error {
  background: var(--bg-surface);
  color: var(--color-secondary);
  font-family: var(--font-serif);
}
.loc-map-hint { font-size: var(--fs-xs); opacity: 0.75; }
.loc-map-error code {
  background: var(--bg-elevated);
  color: var(--accent-dk);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: var(--fs-xs);
}

/* modal */
.loc-overlay {
  inset: 0;
  background: rgba(30, 26, 20, 0.52);
  z-index: 2000;
}
.loc-modal {
  background: var(--bg-surface);
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(30, 26, 20, 0.28);
}
.loc-modal-hd {
  border-bottom: 1px solid var(--border);
}
.loc-modal-state {
  font-size: var(--fs-xs);
  letter-spacing: 0.13em;
  color: var(--accent-dk);
  font-family: var(--font-serif);
}
.loc-modal-title {
  font-family: var(--font-serif);
  font-size: var(--fs-md);
  color: var(--color-primary);
}
.loc-modal-close {
  background: transparent;
  cursor: pointer;
  color: var(--color-secondary);
  transition: background 0.2s, color 0.2s;
}
.loc-modal-close:hover {
  background: var(--bg-elevated);
  color: var(--color-primary);
}

/* hours table */
.loc-hours-table { font-family: var(--font-serif); }
.loc-hours-table tr:nth-child(even) { background: var(--bg-elevated); }
.loc-hours-table td { padding: 0.65rem 1.5rem; font-size: var(--fs-xs); border: none; }
.loc-hours-day { color: var(--color-primary); width: 48%; }
.loc-hours-time { color: var(--color-secondary); }
.loc-hours-table tr.is-closed .loc-hours-day,
.loc-hours-table tr.is-closed .loc-hours-time { color: var(--color-error); }
.loc-hours-table tr.is-closed .loc-hours-time { font-weight: 700; }

/* modal transition */
.loc-fade-enter-active { transition: opacity 0.22s ease; }
.loc-fade-leave-active { transition: opacity 0.18s ease; }
.loc-fade-enter-from,
.loc-fade-leave-to { opacity: 0; }
.loc-fade-enter-active .loc-modal {
  animation: loc-modal-pop 0.26s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}
@keyframes loc-modal-pop {
  from { transform: translateY(-12px) scale(0.96); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* responsive */
@media (max-width: 900px) {
  .loc-workspace {
    grid-template-columns: 1fr;
    grid-template-rows: 360px auto;
    height: auto;
  }
  .loc-panel--right { height: 360px; order: -1; border-bottom: 1px solid var(--border); }
  .loc-panel--left { height: auto; max-height: 520px; border-right: none; overflow-y: auto; }
  .loc-hero-inner { padding: 0 1.5rem; }
}
@media (max-width: 480px) {
  .loc-hero { height: 300px; }
  .loc-hero-title { font-size: clamp(1.6rem, 6vw, 2.2rem); }
  .loc-hero-sub { font-size: var(--fs-xs); }
  .loc-panel--right { height: 280px; }
  .loc-panel--left { max-height: none; }
  .loc-branch-actions { flex-direction: column; }
  .loc-btn { justify-content: center; }
}

/* dark mode */
[data-theme='dark'] .loc-branch-card:hover { background: var(--bg-elevated); }
[data-theme='dark'] .loc-branch-card.is-active { background: var(--bg-elevated); }
[data-theme='dark'] .loc-branch-card.is-active .loc-branch-name { color: var(--accent); }
[data-theme='dark'] .loc-btn--hours { background: var(--bg-alt); border-color: var(--color-subtle); }
[data-theme='dark'] .loc-btn--hours:hover { background: var(--bg-elevated); border-color: var(--accent); }
[data-theme='dark'] .loc-map-error code { background: var(--bg-elevated); }
</style>
