<script setup>
import { ChevronRight } from '@lucide/vue'
import useOnboarding, { ONBOARDING_SLIDES } from '@/hooks/useOnboarding.js'

const { visible, currentSlide, next, goTo, dismiss } = useOnboarding()
</script>

<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div
        v-if="visible"
        class="ob-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Getting started guide"
      >
        <div class="ob-card">

          <div class="ob-header">
            <span class="ob-counter">{{ ONBOARDING_SLIDES[currentSlide].step }} / 05</span>
            <button class="ob-skip" @click="dismiss">Skip tutorial</button>
          </div>

          <Transition name="ob-slide" mode="out-in">
            <div :key="currentSlide" class="ob-body">
              <div class="ob-icon-ring">
                <component
                  :is="ONBOARDING_SLIDES[currentSlide].icon"
                  :size="32"
                  stroke-width="1.5"
                />
              </div>
              <h2 class="ob-title">{{ ONBOARDING_SLIDES[currentSlide].title }}</h2>
              <div class="ob-rule"></div>
              <p class="ob-desc">{{ ONBOARDING_SLIDES[currentSlide].desc }}</p>
            </div>
          </Transition>

          <div class="ob-progress-track">
            <div :key="currentSlide" class="ob-progress-fill"></div>
          </div>

          <div class="ob-footer">
            <div class="ob-dots">
              <button
                v-for="(_, i) in ONBOARDING_SLIDES"
                :key="i"
                class="ob-dot"
                :class="{ 'ob-dot--active': i === currentSlide }"
                :aria-label="`Go to slide ${i + 1}`"
                @click="goTo(i)"
              />
            </div>
            <button class="ob-next-btn" @click="next">
              <span>{{ currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next' }}</span>
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
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 10, 0.65);
  backdrop-filter: blur(3px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.ob-card {
  position: relative;
  background: var(--bg-page);
  width: 100%;
  max-width: 580px;
  padding: 2.5rem 2.75rem 2.25rem;
  overflow: hidden;
}

[data-theme="dark"] .ob-card {
  border: 1px solid var(--color-subtle);
}

/* header row */
.ob-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.ob-counter {
  font-family: "Times New Roman", serif;
  font-size: var(--fs-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c4a882;
}

.ob-skip {
  background: none;
  border: none;
  font-family: "Times New Roman", serif;
  font-size: var(--fs-sm);
  color: #9a8875;
  cursor: pointer;
  padding: 0;
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
  border-radius: 50%;
  background: #f0e8da;
  border: 1px solid #e0d5c5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2218;
  margin-bottom: 1.5rem;
}

.ob-title {
  font-family: "Times New Roman", serif;
  font-size: 1.75rem;
  font-weight: 700;
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
  margin: 0;
}

/* progress bar */
.ob-progress-track {
  height: 2px;
  background: #e0d5c5;
  border-radius: 1px;
  overflow: hidden;
  margin: 1.5rem 0 1.25rem;
}

.ob-progress-fill {
  height: 100%;
  width: 0%;
  background: #c4a882;
  border-radius: 1px;
  animation: ob-advance 5s linear forwards;
}

@keyframes ob-advance {
  from { width: 0% }
  to   { width: 100% }
}

/* footer row */
.ob-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ob-dots {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.ob-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ddd5c5;
  border: none;
  padding: 0;
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
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #2c2218;
  color: #f0ebe2;
  border: none;
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
