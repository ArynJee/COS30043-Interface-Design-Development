<script setup>
import { RouterLink } from "vue-router";
import { ArrowUpRight, MessageSquare, Star } from "@lucide/vue";
import FeedbackModal from "@/components/FeedbackModal.vue";
import useFeedback from "@/hooks/useFeedback";
import useHome from "@/hooks/useHome";

const { productCount, projectCount, productCategories } = useHome();
const {
  feedbacks,
  feedbackCount,
  showFeedbackModal,
  feedbackSubmitted,
  userFeedback,
  fetchFeedbacks,
  submitFeedback,
} = useFeedback();
</script>

<template>
  <div class="comfy-home">
    <!-- hero -->
    <section class="hero">
      <video
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        disablePictureInPicture
        preload="auto"
        oncontextmenu="return false;"
        @click.prevent
        @mouseenter.prevent
      >
        <source src="/home/home-hero.mp4" type="video/mp4" />
        <!-- fallback to image when video fails to load -->
        <img
          src="/home/fallback-hero.jpg"
          alt="Interior"
          class="hero-fallback"
        />
      </video>
      <div class="hero-overlay"></div>

      <div class="hero-headline">
        <h1>{{ $t('home.hero.title') }}</h1>
        <p class="hero-sub">{{ $t('home.hero.subtitle') }}</p>
        <router-link
          to="/products"
          class="hero-cta d-inline-block text-decoration-none text-uppercase"
          >{{ $t('home.hero.cta') }}</router-link
        >
      </div>

      <!-- community showcase card in hero -->
      <div class="hero-card rounded-3">
        <span class="hero-card-badge d-inline-block text-uppercase">{{ $t('home.showcase.title') }}</span>
        <p class="hero-card-text">{{ $t('home.showcase.body') }}</p>
        <router-link
          to="/showcase"
          class="hero-card-link d-inline-flex align-items-center text-decoration-none text-uppercase"
        >
          {{ $t('home.showcase.cta') }} <ArrowUpRight :size="14" class="ms-1" />
        </router-link>
      </div>
    </section>

    <!-- design your own furniture section -->
    <section class="feature-grid py-5">
      <div class="container-fluid px-4 px-lg-5">
        <div class="fg-layout">
          <!-- big image left -->
          <div class="fg-main-img">
            <img src="/home/couch.jpg" alt="Modern interior couch" />
            <div class="fg-img-label text-uppercase">{{ $t('home.interior.title') }}</div>
          </div>

          <!-- right column -->
          <div class="fg-right">
            <div class="fg-heading-block">
              <h2 class="fg-main-title">{{ $t('home.interior.modern') }}<br />{{ $t('home.interior.minimalist') }}</h2>
            </div>

            <div class="fg-cards">
              <!-- Card 1: Into a Gallery -->
              <div class="fg-card fg-card-light">
                <span class="fg-card-tag d-inline-block text-uppercase">{{ $t('home.interior.aesthetic') }}</span>
                <h3 class="fg-card-title">{{ $t('home.gallery.line1') }}<br />{{ $t('home.gallery.line2') }}</h3>
                <p class="fg-card-body">{{ $t('home.gallery.body') }}</p>
              </div>

              <!-- Card 2: Customize Furniture -->
              <div class="fg-card fg-card-dark">
                <span class="fg-card-tag fg-tag-light d-inline-block text-uppercase"
                  >{{ $t('home.feature.customize') }}</span
                >
                <p class="fg-card-body fg-body-light">{{ $t('home.feature.body') }}</p>
                <router-link to="/customize">
                  <div class="fg-card-arrow d-flex align-items-center justify-content-center">
                    <ArrowUpRight :size="18" />
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- stats section showing product count, project count, feedback count -->
    <section class="stats-section py-5">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{{ productCount }}</span>
            <span class="stat-label text-uppercase">{{ $t('home.stats.products') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ projectCount }}</span>
            <span class="stat-label text-uppercase">{{ $t('home.stats.projects') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ feedbackCount }}</span>
            <span class="stat-label text-uppercase">{{ $t('home.stats.customers') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">1<sup>st</sup></span>
            <span class="stat-label text-uppercase">{{ $t('home.stats.rank') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- about us -->
    <section class="about-section py-5">
      <div class="container-fluid px-4 px-lg-5">
        <div class="about-layout">
          <div class="about-img-wrap">
            <img src="/home/nightstand.jpg" alt="ComfyHome studio" />
          </div>

          <div class="about-content">
            <p class="about-eyebrow text-uppercase">{{ $t('home.about.eyebrow') }}</p>
            <h2 class="about-title">{{ $t('home.about.title') }}<br />{{ $t('home.about.title2') }}</h2>
            <p class="about-body">{{ $t('home.about.body') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- explore our products section -->
    <section class="explore-section py-5">
      <div class="container-fluid px-4 px-lg-5">
        <!-- header row -->
        <div class="explore-header mb-4">
          <h2 class="explore-title">{{ $t('home.explore.title') }}</h2>
          <div class="explore-header-right">
            <p class="explore-sub">{{ $t('home.explore.body') }}</p>
            <router-link
              to="/products"
              class="explore-view-more d-inline-block text-decoration-none text-uppercase"
              >{{ $t('home.explore.viewMore') }}</router-link
            >
          </div>
        </div>

        <!-- bento product grid -->
        <div class="product-bento">
          <router-link
            v-for="cat in productCategories"
            :key="cat.id"
            :to="`/products?type=${cat.category}`"
            :class="['bento-card', `bento-${cat.size}`, 'd-block', 'text-decoration-none']"
          >
            <img :src="cat.img" :alt="cat.name" class="bento-img" />
            <div class="bento-overlay"></div>
            <div class="bento-footer">
              <span class="bento-name">{{ cat.name }}</span>
              <span class="bento-arrow d-flex align-items-center justify-content-center"
                ><ArrowUpRight :size="16"
              /></span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- feedback -->
    <section class="feedback-section py-5">
      <div class="container">
        <h2 class="feedback-title fw-bold text-center mb-5">{{ $t('home.testimonials.title') }}</h2>

        <!-- Feedback cards -->
        <div class="row mb-5" v-if="feedbacks.length > 0">
          <div
            v-for="fb in feedbacks"
            :key="fb.id"
            :class="feedbacks.length >= 4 ? 'col-md-3' : 'col-md-4'"
          >
            <div class="fb-card h-100">
              <div class="fb-stars mb-2">
                <Star
                  v-for="n in fb.rating || 5"
                  :key="n"
                  :size="14"
                  fill="currentColor"
                  class="fb-star"
                />
              </div>
              <p class="fb-comment fst-italic">"{{ fb.comment }}"</p>
              <footer class="fb-user">— {{ fb.user || fb.name }}</footer>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            class="fb-cta-btn d-inline-flex align-items-center text-uppercase"
            @click="showFeedbackModal = true"
          >
            <MessageSquare :size="16" class="me-2" /> {{ $t('home.testimonials.cta') }}
          </button>
        </div>
      </div>
    </section>

    <!-- feedback modal -->
    <FeedbackModal
      :show="showFeedbackModal"
      :userFeedback="userFeedback"
      :feedbackSubmitted="feedbackSubmitted"
      @close="showFeedbackModal = false"
      @submit="submitFeedback"
      @update:userFeedback="userFeedback = $event"
    />
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

/* hero section */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  background: var(--btn-alt-bg);
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

.hero-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 26, 20, 0.55) 0%,
    rgba(30, 26, 20, 0.25) 60%,
    rgba(30, 26, 20, 0.45) 100%
  );
  z-index: 1;
}

.hero-headline {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -52%);
  text-align: center;
  color: #ffffff;
  z-index: 2;
}

.hero-headline h1 {
  font-size: clamp(3.5rem, 10vw, 5rem);
  font-weight: bold;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 0.4em;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.3);
}

.hero-sub {
  font-size: clamp(0.95rem, 2vw, 1.2rem);
  letter-spacing: 0.08em;
  opacity: 0.88;
  margin-bottom: 2rem;
}

.hero-cta {
  padding: 0.75rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: #ffffff;
  font-size: var(--fs-sm);
  letter-spacing: 0.15em;
  transition: 0.3s;
}
.hero-cta:hover {
  background: var(--accent);
  color: var(--btn-alt-bg);
  border: 1px solid rgba(109, 98, 84, 0.7);
}

.hero-card {
  position: absolute;
  bottom: 3rem;
  left: 3rem;
  z-index: 3;
  max-width: 380px;
  background: rgba(30, 26, 20, 0.45);
  backdrop-filter: blur(10px);
  padding: 1.75rem;
  color: #ffffff;
}

.hero-card-badge {
  font-size: var(--fs-xs);
  letter-spacing: 0.15em;
  background: rgba(196, 168, 130, 0.6);
  padding: 0.25rem 0.75rem;
  margin-bottom: 0.9rem;
  color: #ffffff;
}

.hero-card-text {
  font-size: var(--fs-base);
  line-height: 1.7;
  opacity: 0.9;
  margin-bottom: 1.1rem;
}

.hero-card-link {
  color: var(--accent);
  font-size: var(--fs-sm);
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;
  transition: opacity 0.2s;
}
.hero-card-link:hover {
  opacity: 0.7;
}

/* feature grid */
.feature-grid {
  background: var(--bg-page);
}

.fg-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

.fg-main-img {
  position: relative;
  overflow: hidden;
}
.fg-main-img img {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.fg-main-img:hover img {
  transform: scale(1.03);
}

.fg-img-label {
  position: absolute;
  bottom: 1.2rem;
  left: 1.2rem;
  background: rgba(250, 247, 242, 0.85);
  backdrop-filter: blur(8px);
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
  color: var(--color-primary);
  padding: 0.4rem 0.9rem;
}

.fg-right {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.fg-heading-block {
  padding: 1rem 0;
}
.fg-main-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary);
  margin: 0;
}

.fg-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
}

.fg-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.fg-card-light {
  background: var(--bg-alt);
  border: 1px solid var(--border);
}
.fg-card-dark {
  background: var(--btn-alt-bg);
  position: relative;
  overflow: hidden;
}
[data-theme="dark"] .fg-card-dark {
  background: #2a2318;
}

.fg-card-tag {
  font-size: var(--fs-2xs);
  letter-spacing: 0.15em;
  background: var(--border);
  color: var(--color-primary);
  padding: 0.2rem 0.7rem;
  margin-bottom: 0.75rem;
  border-radius: 20px;
}
.fg-tag-light {
  background: rgba(196, 168, 130, 0.35);
  color: rgba(255, 255, 255, 0.9);
}

.fg-card-title {
  font-size: var(--fs-md);
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
  margin-bottom: 0.5rem;
}
.fg-card-body {
  font-size: var(--fs-base);
  line-height: 1.65;
  color: var(--color-secondary);
  margin: 0;
}
.fg-body-light {
  color: rgba(255, 255, 255, 0.65);
}

.fg-card-arrow {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--btn-color);
  transition: 0.3s;
}
.fg-card-arrow:hover {
  transform: scale(1.07);
}

/* stats section */
.stats-section {
  background: var(--bg-page);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 3.5rem;
}
.stat-number {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 0.35rem;
}
.stat-number sup {
  font-size: 0.55em;
  vertical-align: super;
}
.stat-label {
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}
.stat-divider {
  width: 1px;
  height: 50px;
  background: var(--border);
}

/* about us */
.about-section {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}

.about-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-img-wrap {
  overflow: hidden;
}
.about-img-wrap img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.about-img-wrap:hover img {
  transform: scale(1.03);
}

.about-eyebrow {
  font-size: var(--fs-sm);
  letter-spacing: 0.2em;
  color: var(--accent);
  margin-bottom: 0.75rem;
}
.about-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.15;
  margin-bottom: 1.25rem;
}
.about-body {
  font-size: var(--fs-md);
  line-height: 1.8;
  color: var(--color-secondary);
  margin-bottom: 2rem;
}

/* explore products */
.explore-section {
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
}

.explore-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  gap: 2rem;
}
.explore-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}
.explore-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}
.explore-sub {
  font-size: var(--fs-base);
  line-height: 1.65;
  color: var(--color-secondary);
  margin: 0;
  text-align: right;
  max-width: 340px;
}
.explore-view-more {
  font-size: var(--fs-xs);
  letter-spacing: 0.15em;
  color: var(--btn-color);
  background: var(--btn-alt-bg);
  padding: 0.5rem 1.25rem;
  transition: background 0.2s;
}
.explore-view-more:hover {
  background: var(--accent-dk);
}

/* bento grid */
.product-bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 280px 220px;
  gap: 0.75rem;
}

.bento-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.bento-card.bento-tall {
  grid-row: span 1;
}
.bento-card.bento-wide {
  grid-column: span 1;
}
.bento-card.bento-small {
  grid-column: span 1;
}

/* layout positioning for visual variety */
.bento-card:nth-child(1) { grid-row: 1; }
.bento-card:nth-child(2) { grid-column: 2; grid-row: 1 / 3; }
.bento-card:nth-child(3) { grid-column: 3; grid-row: 1; }
.bento-card:nth-child(4) { grid-column: 1; grid-row: 2; }
.bento-card:nth-child(5) { grid-column: 3; grid-row: 2; }
.bento-card:nth-child(6) { display: none; }

.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.bento-card:hover .bento-img {
  transform: scale(1.06);
}

.bento-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(20, 16, 10, 0.65) 0%,
    rgba(20, 16, 10, 0.05) 50%
  );
  transition: opacity 0.3s;
}

.bento-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bento-name {
  color: #ffffff;
  font-size: var(--fs-base);
  letter-spacing: 0.06em;
  font-weight: 500;
}
.bento-arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 0.2s;
}
.bento-card:hover .bento-arrow {
  background: var(--accent);
  border-color: var(--accent);
}

/* feedback */
.feedback-section {
  background: var(--bg-surface);
}
.feedback-title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  color: var(--color-primary);
}
.fb-card {
  background: var(--bg-alt);
  padding: 1.75rem;
  position: relative;
}
.fb-stars {
  display: flex;
  gap: 3px;
}
.fb-star {
  color: var(--accent);
}
.fb-comment {
  font-size: var(--fs-md);
  line-height: 1.7;
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.fb-user {
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}
.fb-cta-btn {
  background: transparent;
  border: 1px solid var(--btn-alt-bg);
  color: var(--btn-alt-bg);
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  letter-spacing: 0.12em;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition:
    background 0.25s,
    color 0.25s;
  gap: 15px;
}
.fb-cta-btn:hover {
  background: var(--btn-alt-bg);
  color: var(--btn-color);
}

/* feedback modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* responsive */
@media (max-width: 991px) {
  .fg-layout {
    grid-template-columns: 1fr;
  }
  .fg-main-img img {
    min-height: 300px;
  }
  .fg-cards {
    grid-template-columns: 1fr 1fr;
  }
  .about-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .explore-header {
    grid-template-columns: 1fr;
  }
  .explore-header-right {
    align-items: flex-start;
  }
  .explore-sub {
    text-align: left;
  }
  .product-bento {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .bento-card:nth-child(1),
  .bento-card:nth-child(2),
  .bento-card:nth-child(3),
  .bento-card:nth-child(4),
  .bento-card:nth-child(5) {
    grid-column: auto;
    grid-row: auto;
    height: 220px;
  }
  .bento-card:nth-child(6) {
    display: block;
    height: 220px;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .stat-item {
    padding: 1.5rem 2rem;
  }
}

@media (max-width: 1260px) {
  .hero {
    display: flex;
    flex-direction: column;
  }
  .hero-headline {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }
  .hero-card {
    position: relative;
    bottom: auto;
    left: auto;
    align-self: flex-start;
    margin: 0 2rem 2.5rem;
    max-width: 360px;
  }
}
@media (max-width: 575px) {
  .hero-card {
    margin: 0 1.25rem 1.5rem;
    max-width: none;
    align-self: stretch;
  }
  .fg-cards {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    flex-direction: column;
    gap: 0;
  }
  .stat-divider {
    width: 60px;
    height: 1px;
  }
  .stat-item {
    padding: 1.25rem;
  }
  .product-bento {
    grid-template-columns: 1fr;
  }
  .bento-card:nth-child(n) {
    height: 220px;
    grid-column: auto;
    grid-row: auto;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
