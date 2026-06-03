<script setup>
import { ArrowLeft, ChevronRight } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import useOnboarding, { ONBOARDING_SLIDES } from '@/hooks/useOnboarding.js'

useI18n()
const { visible, currentSlide, prev, next, goTo, dismiss } = useOnboarding()
</script>

<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div
        v-if="visible"
        class="ob-backdrop position-fixed d-flex align-items-center justify-content-center p-3"
        role="dialog"
        aria-modal="true"
        aria-label="Getting started guide"
      >
        <div class="ob-card position-relative" w-100 overflow-hidden>

          <div class="ob-header d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
              <button
                class="ob-prev border-0 p-0 d-flex align-items-center"
                :class="{ 'ob-prev--hidden': currentSlide === 0 }"
                :disabled="currentSlide === 0"
                aria-label="Previous slide"
                @click="prev"
              >
                <ArrowLeft :size="15" />
              </button>
              <span class="ob-counter text-uppercase">{{ ONBOARDING_SLIDES[currentSlide].step }} / 05</span>
            </div>
            <button class="ob-skip border-0 p-0" @click="dismiss">{{ $t('components.onboarding.skip') }}</button>
          </div>

          <Transition name="ob-slide" mode="out-in">
            <div :key="currentSlide" class="ob-body">
              <div class="ob-icon-ring rounded-pill d-flex align-items-center justify-content-center mb-3">
                <component
                  :is="ONBOARDING_SLIDES[currentSlide].icon"
                  :size="32"
                  stroke-width="1.5"
                />
              </div>
              <h2 class="ob-title fw-bold fs-3">{{ $t(`components.onboarding.slides.${ONBOARDING_SLIDES[currentSlide].key}.title`) }}</h2>
              <div class="ob-rule mb-2"></div>
              <p class="ob-desc m-0">{{ $t(`components.onboarding.slides.${ONBOARDING_SLIDES[currentSlide].key}.desc`) }}</p>
            </div>
          </Transition>

          <div class="ob-progress-track rounded overflow-hidden">
            <div :key="currentSlide" class="ob-progress-fill h-100 rounded"></div>
          </div>

          <div class="ob-footer d-flex align-items-center justify-content-between">
            <div class="ob-dots d-flex align-items-center gap-2">
              <button
                v-for="(_, i) in ONBOARDING_SLIDES"
                :key="i"
                class="ob-dot rounded-pill border-0 p-0"
                :class="{ 'ob-dot--active': i === currentSlide }"
                :aria-label="`Go to slide ${i + 1}`"
                @click="goTo(i)"
              />
            </div>
            <button class="ob-next-btn d-flex align-items-center gap-2 border-0" @click="next">
              <span>{{ $t(currentSlide === ONBOARDING_SLIDES.length - 1 ? 'components.onboarding.getStarted' : 'components.onboarding.next') }}</span>
              <ChevronRight v-if="currentSlide < ONBOARDING_SLIDES.length - 1" :size="14" />
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@import "@/styles/main.css";

.ob-backdrop {
  inset: 0;
  background: rgba(20, 16, 10, 0.65);
  backdrop-filter: blur(3px);
  z-index: 2000;
}

.ob-card {
  background: var(--bg-page);
  max-width: 580px;
  padding: 2.5rem 2.75rem 2.25rem;
}

[data-theme="dark"] .ob-card {
  border: 1px solid var(--color-subtle);
}

.ob-prev {
  background: none;
  color: #9a8875;
  cursor: pointer;
  transition: color 0.2s, opacity 0.2s;
  line-height: 1;
}
.ob-prev:hover:not(:disabled) {
  color: #2c2218;
}
.ob-prev--hidden {
  opacity: 0;
  pointer-events: none;
}
[data-theme="dark"] .ob-prev {
  color: #6a5a4a;
}
[data-theme="dark"] .ob-prev:hover:not(:disabled) {
  color: #e8ddd0;
}

.ob-counter {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-xs);
  letter-spacing: 0.14em;
  color: #c4a882;
}

.ob-skip {
  background: none;
  font-family: "Times New Roman", serif;
  font-size: var(--fs-sm);
  color: #9a8875;
  cursor: pointer;
  transition: color 0.2s;
  letter-spacing: 0.02em;
}
.ob-skip:hover {
  color: #2c2218;
}

/* slide body */
.ob-body {
  min-height: 210px;
}

.ob-icon-ring {
  width: 72px;
  height: 72px;
  background: #f0e8da;
  border: 1px solid #e0d5c5;
  color: #2c2218;
}

.ob-title {
  font-family: "Times New Roman", serif;
  color: #2c2218;
  line-height: 1.2;
  margin: 0 0 0.65rem;
}

.ob-rule {
  width: 36px;
  height: 1.5px;
  background: #c4a882;
  margin-bottom: 0.85rem;
}

.ob-desc {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-base);
  color: #7a6a58;
  line-height: 1.75;
}

/* progress bar */
.ob-progress-track {
  height: 2px;
  background: #e0d5c5;
  margin: 1.5rem 0 1.25rem;
}

.ob-progress-fill {
  width: 0%;
  background: #c4a882;
  animation: ob-advance 5s linear forwards;
}

@keyframes ob-advance {
  from { width: 0% }
  to   { width: 100% }
}

.ob-dot {
  width: 7px;
  height: 7px;
  background: #ddd5c5;
  cursor: pointer;
  transition: all 0.28s ease;
}

.ob-dot--active {
  width: 22px;
  border-radius: 3px;
  background: #2c2218;
}

.ob-dot:not(.ob-dot--active):hover {
  background: #c4a882;
}

.ob-next-btn {
  background: #2c2218;
  color: #f0ebe2;
  font-family: "Times New Roman", serif;
  font-size: var(--fs-base);
  letter-spacing: 0.02em;
  padding: 0.55rem 1.25rem;
  cursor: pointer;
  transition: background 0.18s;
}
.ob-next-btn:hover {
  background: #3d3024;
}

/* overlay transitions */
.ob-fade-enter-active,
.ob-fade-leave-active {
  transition: opacity 0.4s ease;
}
.ob-fade-enter-from,
.ob-fade-leave-to {
  opacity: 0;
}

.ob-slide-enter-active,
.ob-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.ob-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.ob-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* dark mode */
[data-theme="dark"] .ob-icon-ring {
  background: #3a3025;
  border-color: #4a4035;
  color: #e8ddd0;
}
[data-theme="dark"] .ob-title {
  color: #e8ddd0;
}
[data-theme="dark"] .ob-desc {
  color: #9a8875;
}
[data-theme="dark"] .ob-skip:hover {
  color: #e8ddd0;
}
[data-theme="dark"] .ob-progress-track {
  background: #3a3025;
}
[data-theme="dark"] .ob-dot {
  background: #3a3025;
}
[data-theme="dark"] .ob-dot--active {
  background: #8c785f;
}
[data-theme="dark"] .ob-next-btn {
  background: #8c785f;
  color: #16130d;
}
[data-theme="dark"] .ob-next-btn:hover {
  background: #c4a882;
}
</style>
