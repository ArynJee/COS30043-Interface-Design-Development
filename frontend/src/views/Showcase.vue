<script setup>
import { RouterLink } from "vue-router";
import { ArrowRight, Sparkle } from "@lucide/vue";
import CtaBanner from "@/components/CtaBanner.vue";
import { useShowcase, AREAS } from "@/hooks/useShowcase.js";

const {
  contributions,
  loading,
  selectedArea,
  totalContributors,
  totalAreas,
  filtered,
  formatPrice,
  formatDate,
  getInitials,
  configEntries,
} = useShowcase();
</script>

<template>
  <div class="sc-page">
    <!-- ── HERO ── -->
    <section class="sc-hero position-relative overflow-hidden">
      <img
        src="/showcase/showcase-hero.jpg"
        alt=""
        class="hero-img position-absolute inset-0 w-100 h-100 object-fit-cover"
      />

      <div class="hero-inner position-relative z-1">
        <p class="hero-crumb mb-4">
          <RouterLink to="/">Home</RouterLink>&ensp;›&ensp;Showcase
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

    <!-- ── DIVIDER STRIP ── -->
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
      class="filter-strip d-flex align-items-center gap-5 overflow-x-auto justify-content-center position-sticky px-2 py-4"
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

    <!-- ── MAIN CONTENT ── -->
    <div class="sc-container">
      <!-- Loading skeletons -->
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

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="sc-empty text-center">
        <div class="empty-orn">✦</div>
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

      <!-- Showcase grid -->
      <TransitionGroup v-else name="card-fade" tag="div" class="sc-grid">
        <article
          v-for="(c, idx) in filtered"
          :key="c.id"
          class="sc-card"
          :class="{ 'is-featured': idx === 0 && filtered.length > 1 }"
        >
          <!-- Image -->
          <div class="card-img-wrap overflow-hidden position-relative">
            <img
              :src="c.preview_image_url"
              :alt="`${c.furniture_type} by ${c.first_name ?? 'Community'}`"
              class="card-img w-100 h-100 object-fit-cover"
            />
            <div class="card-img-grad position-absolute inset-0"></div>

            <span class="card-area-badge position-absolute">
              {{ c.area }}
            </span>
          </div>

          <!-- Body -->
          <div class="card-body-sc">
            <!-- Contributor row -->
            <div class="contrib-row d-flex align-items-center gap-2 mb-3">
              <div
                class="contrib-avatar d-flex align-items-center justify-content-center flex-shrink-0"
              >
                {{ getInitials(c.first_name, c.last_name) }}
              </div>
              <div class="contrib-info">
                <div class="contrib-name">
                  {{
                    c.first_name
                      ? `${c.first_name} ${c.last_name}`
                      : "Anonymous"
                  }}
                </div>
                <div class="contrib-date">{{ formatDate(c.created_at) }}</div>
              </div>
              <div class="card-price ms-auto">
                {{ formatPrice(c.total_cost) }}
              </div>
            </div>

            <!-- Furniture type label -->
            <div class="card-type-label mb-1">{{ c.furniture_type }}</div>

            <!-- Description -->
            <p class="card-desc mb-3">{{ c.description }}</p>

            <!-- Config chips -->
            <div class="config-chips d-flex flex-wrap gap-1 mb-4">
              <span
                v-for="entry in configEntries(c.configuration)"
                :key="entry.label"
                class="cfg-chip"
              >
                <span class="cfg-key">{{ entry.label }}</span>
                <span class="cfg-sep">·</span>
                <span class="cfg-val">{{ entry.name }}</span>
              </span>
            </div>

            <!-- CTA -->
            <button class="card-cta d-inline-flex align-items-center gap-2">
              View Detail &thinsp;<ArrowRight :size="13" />
            </button>
          </div>
        </article>
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

/* ── PAGE ── */
.sc-page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* ── HERO ── */
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

/* eyebrow */
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

/* stats */
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

/* ornaments */
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

/* ── DIVIDER STRIP ── */
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

/* ── FILTER STRIP ── */
.filter-strip {
  top: 80px;
  z-index: 50;
  scrollbar-width: none;
  background: var(--bg-page);
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

/* ── CONTAINER ── */
.sc-container {
  padding: 3rem 5rem 5rem;
}

/* ── SKELETON ── */
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

/* ── EMPTY ── */
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

/* ── SHOWCASE GRID ── */
.sc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* ── CARD ── */
.sc-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow: hidden;
  transition:
    box-shadow 0.35s ease,
    transform 0.35s ease,
    border-color 0.35s ease;
}
.sc-card:hover {
  box-shadow: 0 16px 48px rgba(30, 26, 20, 0.13);
  transform: translateY(-5px);
  border-color: #d0b896;
}

/* Featured card takes first 2 columns */
.sc-card.is-featured {
  grid-column: span 2;
}
.sc-card.is-featured .card-img-wrap {
  aspect-ratio: 16 / 9;
}

/* Image wrapper */
.card-img-wrap {
  aspect-ratio: 4 / 3;
  display: block;
}
.card-img {
  transition: transform 0.65s ease;
  display: block;
}
.sc-card:hover .card-img {
  transform: scale(1.06);
}

/* gradient overlay */
.card-img-grad {
  background: linear-gradient(
    to bottom,
    transparent 35%,
    rgba(18, 14, 10, 0.72) 100%
  );
  pointer-events: none;
}

/* Area badge */
.card-area-badge {
  bottom: 1rem;
  left: 1rem;
  color: #fff;
  font-size: var(--fs-2xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.25rem 0.7rem;
  font-weight: 600;
  background: #c4a882;
}

/* Featured tag */
.card-featured-tag {
  top: 1rem;
  right: 1rem;
  background: rgba(18, 14, 10, 0.72);
  color: #c4a882;
  font-size: var(--fs-2xs);
  letter-spacing: 0.1em;
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(196, 168, 130, 0.35);
  backdrop-filter: blur(4px);
}

/* Card body */
.card-body-sc {
  padding: 1.3rem;
}

/* Contributor */
.contrib-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  background: #c4a882;
}
.contrib-name {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
}
.contrib-date {
  font-size: var(--fs-sm);
  color: var(--accent-hover);
}
.card-price {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--color-secondary);
  white-space: nowrap;
}
.card-type-label {
  font-size: var(--fs-sm);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--color-subtle);
}
.card-desc {
  font-size: var(--fs-base);
  color: var(--accent-dk);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cfg-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid var(--color-muted);
  padding: 0.15rem 0.55rem;
  font-size: var(--fs-xs);
  color: var(--color-secondary);
  border-radius: 2px;
}

[data-theme="dark"] .contrib-name {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
}
[data-theme="dark"] .contrib-date {
  font-size: var(--fs-sm);
  color: var(--accent-hover);
}
[data-theme="dark"] .card-price {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--accent-hover);
  white-space: nowrap;
}
[data-theme="dark"] .card-type-label {
  font-size: var(--fs-sm);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--accent-dk);
}
[data-theme="dark"] .card-desc {
  font-size: var(--fs-base);
  color: var(--color-cream);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
[data-theme="dark"] .cfg-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid var(--color-muted);
  padding: 0.15rem 0.55rem;
  font-size: var(--fs-xs);
  color: var(--color-secondary);
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
.card-cta {
  border: 1px solid var(--color-subtle);
  background: transparent;
  color: var(--color-subtle);
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition:
    background 0.22s,
    color 0.22s;
}
.card-cta:hover{
  border-color: var(--btn-bg);
  color: var(--btn-bg);
}

[data-theme="dark"] .card-cta {
  color: var(--color-cream);
  border: 1px solid var(--color-cream);
}
[data-theme="dark"] .card-cta:hover {
  background: var(--color-subtle);
  color: var(--color-cream);
}

/* ── CARD TRANSITION ── */
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

/* ── RESPONSIVE ── */
@media (max-width: 1199px) {
  .sc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sc-card.is-featured {
    grid-column: span 2;
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
  .sc-card.is-featured {
    grid-column: span 1;
  }
  .sc-card.is-featured .card-img-wrap {
    aspect-ratio: 4 / 3;
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
@media (max-width: 480px) {
  .hero-stats {
    gap: 0;
  }
}
</style>
