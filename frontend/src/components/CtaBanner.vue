<script setup>
import { RouterLink } from 'vue-router';
import { ArrowRight } from '@lucide/vue';

defineProps({
  eyebrow:   { type: String, required: true },
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  pill:      { type: String, required: true },
  linkTo:    { type: String, required: true },
  ariaLabel: { type: String, default: '' },
});
</script>

<template>
  <section class="cb-section position-relative overflow-hidden">
    <div class="cb-orb cb-orb--1" aria-hidden="true"></div>
    <div class="cb-orb cb-orb--2" aria-hidden="true"></div>

    <div class="cb-inner position-relative z-1 d-flex align-items-center justify-content-between flex-wrap gap-4">
      <div class="cb-left">
        <p class="cb-eyebrow text-uppercase mb-4">{{ eyebrow }}</p>
        <h2 class="cb-title mb-3" v-html="title"></h2>
        <p class="cb-body m-0">{{ body }}</p>

        <div class="cb-pill-row d-flex align-items-center gap-3 mt-3">
          <div class="cb-pill rounded-pill px-4 py-3 pe-none" aria-hidden="true">
            <span class="cb-pill-text text-uppercase">{{ pill }}</span>
          </div>
          <RouterLink
            :to="linkTo"
            class="cb-arrow rounded-pill d-flex align-items-center justify-content-center overflow-hidden text-decoration-none"
            :aria-label="ariaLabel"
          >
            <ArrowRight :size="18" class="cb-arrow-icon" />
          </RouterLink>
        </div>
      </div>

      <div class="cb-right position-relative" aria-hidden="true">
        <div class="cb-photo cb-photo--back position-absolute overflow-hidden rounded-4">
          <img src="/home/living-room.jpg" alt="" />
        </div>
        <div class="cb-photo cb-photo--front position-absolute overflow-hidden rounded-4">
          <img src="/home/bathroom.jpeg" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cb-section {
  margin: 2rem 4.5rem 0;
  background: #f5f0e8;
  border: 1px solid #e0d5c5;
}

.cb-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.cb-orb--1 {
  width: 420px;
  height: 420px;
  background: rgba(187, 141, 95, 0.28);
  filter: blur(90px);
  bottom: -120px;
  left: -80px;
}
.cb-orb--2 {
  width: 300px;
  height: 300px;
  background: rgba(187, 141, 95, 0.28);
  filter: blur(70px);
  top: -60px;
  right: 280px;
}

.cb-inner {
  padding: 3.5rem 4rem;
}

.cb-left {
  flex: 1;
  min-width: 0;
  max-width: 440px;
}

.cb-eyebrow {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  color: #a08060;
}

.cb-title {
  font-family: "Times New Roman", Times, serif;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: #2c2218;
  line-height: 1.15;
}

.cb-body {
  font-size: 0.84rem;
  color: #6a5a4a;
  line-height: 1.7;
  max-width: 360px;
}

.cb-pill {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #d8cfc4;
}

.cb-pill-text {
  font-family: "Times New Roman", Times, serif;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  color: #9a8a7a;
}

.cb-arrow {
  width: 50px;
  height: 50px;
  background: #c4a882;
  color: #fff;
  flex-shrink: 0;
  transition: background 0.22s, box-shadow 0.22s;
}
.cb-arrow:hover {
  background: #8b6f47;
  box-shadow: 0 6px 20px rgba(139, 111, 71, 0.35);
  color: #fff;
}
.cb-arrow:hover .cb-arrow-icon {
  animation: arrow-shoot 0.55s ease;
}

@keyframes arrow-shoot {
  0%   { transform: translateX(0);     opacity: 1; }
  40%  { transform: translateX(20px);  opacity: 0; }
  41%  { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0);     opacity: 1; }
}

.cb-right {
  flex-shrink: 0;
  width: 460px;
  height: 320px;
}

.cb-photo {
  box-shadow: 20px 20px 30px rgba(30, 26, 20, 0.195);
}
.cb-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cb-photo--back {
  width: 265px;
  height: 300px;
  top: 0;
  left: 20px;
  z-index: 1;
}
.cb-photo--front {
  width: 235px;
  height: 258px;
  bottom: 0;
  right: 0;
  z-index: 2;
}

/* ── Dark mode ── */
[data-theme="dark"] .cb-section {
  background: #1e1b14;
  border-color: #3a3025;
}
[data-theme="dark"] .cb-eyebrow { color: #c4a882; }
[data-theme="dark"] .cb-title { color: #e8ddd0; }
[data-theme="dark"] .cb-body { color: #9a8875; }
[data-theme="dark"] .cb-pill { background: rgba(44, 34, 24, 0.6); border-color: #3a3025; }
[data-theme="dark"] .cb-pill-text { color: #7a6a58; }

/* ── Responsive ── */
@media (max-width: 991px) {
  .cb-section { margin: 2rem 1.5rem 0; }
  .cb-inner { padding: 2.5rem 2.5rem; }
  .cb-right { width: 340px; height: 250px; }
  .cb-photo--back { width: 200px; height: 230px; }
  .cb-photo--front { width: 180px; height: 200px; }
}
@media (max-width: 767px) {
  .cb-section { margin: 2rem 1rem 0; }
  .cb-inner { flex-direction: column; padding: 2rem 1.75rem; gap: 2rem; }
  .cb-left { max-width: 100%; }
  .cb-right { width: 100%; height: 200px; }
  .cb-photo--back { width: 160px; height: 185px; left: 0; }
  .cb-photo--front { width: 145px; height: 162px; }
}
</style>
