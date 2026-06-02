<script setup>
import { RouterLink } from "vue-router";
import { ArrowRight } from "@lucide/vue";
import useContributionCard from "@/hooks/useContributionCard";

const props = defineProps({
  contribution: { type: Object, required: true },
  showContributor: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
});

const { imageSrc, typeName, configEntries, formattedDate, formattedPrice, getInitials } =
  useContributionCard(() => props.contribution);
</script>

<template>
  <article class="cc-card" :class="{ 'cc-card--featured': featured }">
    <div class="cc-img-wrap">
      <img
        :src="imageSrc"
        :alt="`${contribution.furniture_type} in ${contribution.area}`"
        class="cc-img"
      />
      <div class="cc-img-grad"></div>
      <span class="cc-area-badge">{{ contribution.area }}</span>
    </div>

    <div class="cc-body">
      <!-- contributor row — shown in Showcase -->
      <div v-if="showContributor" class="cc-contrib-row">
        <div class="cc-avatar">
          {{ getInitials(contribution.first_name, contribution.last_name) }}
        </div>
        <div class="cc-contrib-info">
          <div class="cc-contrib-name">
            {{ contribution.first_name ? `${contribution.first_name} ${contribution.last_name}` : "Anonymous" }}
          </div>
          <div class="cc-contrib-date">{{ formattedDate }}</div>
        </div>
        <div class="cc-price ms-auto">{{ formattedPrice }}</div>
      </div>

      <!-- meta row — shown in UserProfile -->
      <div v-else class="cc-meta-row">
        <span class="cc-date">{{ formattedDate }}</span>
        <span class="cc-price">{{ formattedPrice }}</span>
      </div>

      <div class="cc-type">{{ typeName }}</div>
      <p v-if="contribution.description" class="cc-desc">{{ contribution.description }}</p>

      <div class="cc-chips">
        <span
          v-for="entry in configEntries"
          :key="entry.label"
          class="cc-chip"
        >
          <span class="cc-chip-key">{{ entry.label }}</span>
          <span class="cc-chip-sep">·</span>
          <span class="cc-chip-val">{{ entry.name }}</span>
        </span>
      </div>

      <RouterLink
        :to="`/showcase/${contribution.id}`"
        class="cc-cta d-inline-flex align-items-center gap-2 mt-4"
      >
        {{ $t('components.contributionCard.viewDetail') }} &thinsp;<ArrowRight :size="13" />
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
@import "@/styles/main.css";

.cc-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow: hidden;
  transition:
    box-shadow 0.35s ease,
    transform 0.35s ease,
    border-color 0.35s ease;
}
.cc-card:hover {
  box-shadow: 0 16px 48px rgba(30, 26, 20, 0.13);
  transform: translateY(-5px);
  border-color: #d0b896;
}

/* featured modifier */
.cc-card--featured {
  grid-column: span 2;
}
.cc-card--featured .cc-img-wrap {
  aspect-ratio: 16 / 9;
}

/* image */
.cc-img-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.cc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.65s ease;
}
.cc-card:hover .cc-img {
  transform: scale(1.06);
}
.cc-img-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 35%,
    rgba(18, 14, 10, 0.68) 100%
  );
  pointer-events: none;
}
.cc-area-badge {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  color: #fff;
  font-size: var(--fs-2xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.2rem 0.65rem;
  font-weight: 600;
  background: #c4a882;
}

/* body */
.cc-body {
  padding: 1.2rem;
}

/* contributor row (Showcase) */
.cc-contrib-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
}
.cc-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #c4a882;
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cc-contrib-info {
  min-width: 0;
}
.cc-contrib-name {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
}
.cc-contrib-date {
  font-size: var(--fs-sm);
  color: var(--accent-hover);
}

/* meta row (UserProfile) */
.cc-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.cc-date {
  font-size: var(--fs-sm);
  color: var(--accent-hover);
}

.cc-price {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--color-secondary);
  white-space: nowrap;
}
[data-theme="dark"] .cc-price {
  color: var(--accent-hover);
}

.cc-type {
  font-size: var(--fs-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-subtle);
  margin-bottom: 0.4rem;
}
[data-theme="dark"] .cc-type {
  color: var(--accent-dk);
}

.cc-desc {
  font-size: var(--fs-base);
  color: var(--accent-dk);
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
[data-theme="dark"] .cc-desc {
  color: var(--color-cream);
}

.cc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.cc-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid var(--color-muted);
  padding: 0.15rem 0.5rem;
  font-size: var(--fs-xs);
  border-radius: 2px;
}
.cc-chip-key {
  font-weight: 600;
  color: var(--color-primary);
}
.cc-chip-sep {
  color: var(--accent);
}
.cc-chip-val {
  color: var(--color-secondary);
}

.cc-cta {
  background: var(--btn-bg);
  color: var(--btn-color);
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  padding: 0.5rem 1rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}
.cc-cta:hover {
  background: var(--btn-bg-hover);
  color: var(--btn-color);
}

@media (max-width: 767px) {
  .cc-card--featured {
    grid-column: span 1;
  }
  .cc-card--featured .cc-img-wrap {
    aspect-ratio: 4 / 3;
  }
}
</style>
