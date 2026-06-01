<script setup>
import { RouterLink } from "vue-router";
import { ArrowRight, Sparkle, ChevronRight, Astroid} from "@lucide/vue";
import CtaBanner from "@/components/CtaBanner.vue";
import ContributionCard from "@/components/ContributionCard.vue";
import { useShowcase, AREAS } from "@/hooks/useShowcase.js";

const {
  contributions,
  loading,
  selectedArea,
  totalContributors,
  totalAreas,
  filtered,
} = useShowcase();
</script>

<template>
  <div class="sc-page">
    <section class="sc-hero position-relative overflow-hidden">
      <img
        src="/showcase/showcase-hero.jpg"
        alt=""
        class="hero-img position-absolute inset-0 w-100 h-100 object-fit-cover"
      />

      <div class="hero-inner position-relative z-1">
        <p class="hero-crumb mb-4">
          <RouterLink to="/">Home</RouterLink>&ensp;<ChevronRight size="10"/>&ensp;Showcase
        </p>

        <div class="hero-eyebrow d-flex align-items-center gap-2 mb-3">
          <span class="ey-line"></span>
          <span class="ey-text">COMMUNITY</span>
          <span class="ey-line"></span>
        </div>

        <h1 class="hero-title mb-3">Design Showcase</h1>
        <p class="hero-sub mb-5">
          Handcrafted furniture visions from our creative community
        </p>

        <div class="hero-stats d-flex align-items-center flex-wrap">
          <div class="stat-col">
            <span class="stat-n">{{ contributions.length }}</span>
            <span class="stat-l">Designs</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat-col">
            <span class="stat-n">{{ totalContributors }}</span>
            <span class="stat-l">Contributors</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat-col">
            <span class="stat-n">{{ totalAreas }}</span>
            <span class="stat-l">Areas</span>
          </div>
        </div>
      </div>

      <div class="hero-ornament position-absolute" aria-hidden="true">✦</div>
      <div class="hero-ornament-sm position-absolute" aria-hidden="true">✦</div>
    </section>

    <div
      class="divider-strip d-flex align-items-center justify-content-center gap-3 py-5 mt-4"
    >
      <span class="ds-line"></span>
      <span class="ds-text text-uppercase"
        ><Sparkle size="11" />&nbsp; CRAFTED WITH PASSION &nbsp;<Sparkle
          size="11"
      /></span>
      <span class="ds-line"></span>
    </div>

    <!-- area filter -->
    <div
      class="filter-strip d-flex align-items-center position-sticky px-2 py-4"
    >
      <button
        v-for="area in AREAS"
        :key="area"
        class="area-pill px-3 py-2 rounded-pill"
        :class="{ 'is-active': selectedArea === area }"
        @click="selectedArea = area"
      >
        {{ area }}
      </button>
    </div>

    <!-- main content -->
    <div class="sc-container">
      <!-- loading 3d model skeletons -->
      <div v-if="loading" class="skeleton-grid">
        <div v-for="i in 3" :key="i" class="skeleton-card">
          <div class="sk-img"></div>
          <div class="sk-body">
            <div class="sk-line sk-line--wide"></div>
            <div class="sk-line sk-line--narrow"></div>
            <div class="sk-line sk-line--wide"></div>
          </div>
        </div>
      </div>

      <!-- empty state -->
      <div v-else-if="filtered.length === 0" class="sc-empty text-center">
        <div class="empty-orn"><Astroid size="20"/></div>
        <h3 class="empty-title">No Designs Yet</h3>
        <p class="empty-sub">
          Be the first to contribute a {{ selectedArea }} design to the
          community.
        </p>
        <RouterLink
          to="/customize"
          class="empty-cta d-inline-flex align-items-center gap-2"
        >
          Start Designing <ArrowRight :size="14" />
        </RouterLink>
      </div>

      <!-- showcase grid -->
      <TransitionGroup v-else name="card-fade" tag="div" class="sc-grid">
        <ContributionCard
          v-for="(c, idx) in filtered"
          :key="c.id"
          :contribution="c"
          :show-contributor="true"
          :featured="idx === 0 && filtered.length > 1"
        />
      </TransitionGroup>
    </div>

    <!-- customize banner cta -->
    <CtaBanner
      eyebrow="Your Vision. Your Space."
      title="Design your own<br>furniture"
      body="Choose from 18 furniture types and fully customize materials, finishes, and dimensions — then share it with the community."
      pill="Design Now!"
      link-to="/customize"
      aria-label="Go to Customize"
    />

    <div class="sc-bridge"></div>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.sc-page {
  background: var(--bg-page);
  min-height: 100vh;
}

.sc-hero {
  height: 400px;
  background: #f0ebe2;
  display: flex;
  align-items: center;
}
.hero-img {
  inset: 0;
  object-position: right center;
}
.sc-hero::after {
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
.hero-inner {
  padding: 0 5rem;
  max-width: 700px;
}

.hero-crumb {
  font-size: var(--fs-sm);
  letter-spacing: 0.04em;
  color: #f0e1cc;
}
.hero-crumb a {
  color: #f0e1cc;
  text-decoration: none;
  transition: color 0.2s;
}
.hero-crumb a:hover {
  color: #dbbea0;
}

.hero-eyebrow {
  gap: 0.6rem;
}
.ey-text {
  font-size: var(--fs-2xs);
  letter-spacing: 0.28em;
  color: #f0e1cc;
  white-space: nowrap;
}
.ey-line {
  flex: 0 0 50px;
  height: 1px;
  background: rgba(255, 239, 216, 0.45);
}

.hero-title {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #f0e1cc;
  line-height: 1.1;
  font-weight: bold;
}
.hero-sub {
  font-size: var(--fs-base);
  color: #f0e1cc;
  letter-spacing: 0.04em;
  max-width: 360px;
}

.hero-stats {
  gap: 0;
}
.stat-col {
  display: flex;
  flex-direction: column;
  padding: 0 1.6rem;
}
.stat-col:first-child {
  padding-left: 0;
}
.stat-n {
  font-size: 2.2rem;
  font-weight: bold;
  color: #f0e1cc;
  line-height: 1;
}
.stat-l {
  font-size: var(--fs-2xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f0e1cc;
  margin-top: 0.2rem;
}
.stat-div {
  width: 1px;
  height: 40px;
  background: rgba(240, 225, 204, 0.35);
  flex-shrink: 0;
}

.hero-ornament {
  right: 5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10rem;
  color: rgba(196, 168, 130, 0.07);
  pointer-events: none;
  user-select: none;
  line-height: 1;
}
.hero-ornament-sm {
  right: 18rem;
  top: 25%;
  font-size: 3rem;
  color: rgba(196, 168, 130, 0.12);
  pointer-events: none;
  user-select: none;
  line-height: 1;
}
.divider-strip {
  padding: 0.6rem 5rem;
  gap: 1rem;
}
.ds-text {
  font-size: var(--fs-sm);
  letter-spacing: 0.22em;
  color: var(--accent-dk);
  white-space: nowrap;
}
.ds-line {
  flex: 1;
  max-width: 200px;
  height: 1px;
  background: var(--border-input);
}

.filter-strip {
  top: 80px;
  z-index: 50;
  overflow-x: auto;
  scrollbar-width: none;
  background: var(--bg-page);
  justify-content: center;
  gap: 1.25rem;
}
.filter-strip::-webkit-scrollbar {
  display: none;
}
.area-pill {
  border: 1px solid var(--border-input);
  background: transparent;
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  color: var(--color-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s;
  flex-shrink: 0;
}
.area-pill:hover {
  border-color: var(--accent-dk);
  color: var(--color-primary);
}
.area-pill.is-active {
  background: var(--btn-bg);
  border-color: var(--btn-bg);
  color: var(--color-cream);
}

.sc-container {
  padding: 3rem 5rem 5rem;
}

/* skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.skeleton-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow: hidden;
}
.sk-img {
  height: 280px;
  background: var(--bg-alt);
  animation: shimmer 1.5s ease-in-out infinite;
}
.sk-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.sk-line {
  height: 12px;
  background: var(--bg-alt);
  border-radius: 2px;
  animation: shimmer 1.5s ease-in-out infinite;
}
.sk-line--wide {
  width: 80%;
}
.sk-line--narrow {
  width: 45%;
}
@keyframes shimmer {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.85;
  }
}

.sc-empty {
  padding: 5rem 2rem;
}
.empty-orn {
  font-size: 3rem;
  color: var(--accent);
  opacity: 0.4;
  margin-bottom: 1.25rem;
  line-height: 1;
}
.empty-title {
  font-size: 1.4rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}
.empty-sub {
  font-size: var(--fs-base);
  color: var(--color-secondary);
  max-width: 350px;
  margin: 0 auto 1.5rem;
}
.empty-cta {
  display: inline-flex;
  align-items: center;
  background: var(--btn-bg);
  color: var(--color-cream);
  padding: 0.55rem 1.4rem;
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  letter-spacing: 0.07em;
  text-decoration: none;
  transition: background 0.2s;
}
.empty-cta:hover {
  background: var(--btn-bg-hover);
  color: var(--color-cream);
}

.sc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* card transition */
.card-fade-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.sc-bridge {
  background: var(--bg-page);
  height: 5rem;
}

@media (max-width: 1199px) {
  .sc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 991px) {
  .hero-inner {
    padding: 0 2.5rem;
  }
  .divider-strip {
    padding: 0.6rem 2.5rem;
  }
  .filter-strip {
    padding: 0.9rem 2.5rem;
    top: 0;
    gap: 0.875rem;
  }
  .sc-container {
    padding: 2rem 2.5rem 4rem;
  }
  .bottom-cta {
    padding: 4.5rem 2.5rem;
  }
  .hero-ornament {
    display: none;
  }
  .hero-ornament-sm {
    display: none;
  }
}
@media (max-width: 767px) {
  .sc-hero {
    height: auto;
    min-height: 300px;
  }
  .hero-inner {
    padding: 2rem 1.5rem;
  }
  .divider-strip {
    padding: 0.6rem 1.5rem;
  }
  .filter-strip {
    padding: 0.75rem 1.25rem;
    top: 0;
    gap: 0.5rem;
  }
  .sc-container {
    padding: 1.5rem 1.25rem 3rem;
  }
  .bottom-cta {
    padding: 3.5rem 1.5rem;
  }
  .sc-grid {
    grid-template-columns: 1fr;
  }
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
  .stat-col {
    padding: 0 1rem;
  }
  .stat-col:first-child {
    padding-left: 0;
  }
}
@media (max-width: 670px) {
  .filter-strip {
    overflow-x: visible;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
  .area-pill {
    flex: 0 0 calc(50% - 0.25rem);
    text-align: center;
  }
}
@media (max-width: 480px) {
  .hero-stats {
    gap: 0;
  }
  .stat-n {
    font-size: 1.4rem;
  }
  .stat-l {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
  }
  .stat-col {
    padding: 0 0.75rem;
  }
  .stat-col:first-child {
    padding-left: 0;
  }
  .stat-div {
    height: 30px;
  }
}
</style>
