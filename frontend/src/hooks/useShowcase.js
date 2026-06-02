import { ref, computed, watch, onMounted } from "vue";
import { getContributionsApi } from "@/services/showcaseServices.js";

const PAGE_SIZE = 6;

export const AREAS = [
  "All",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Study Room",
  "Bathroom",
];

export function useShowcase() {
  const contributions = ref([]);
  const loading = ref(true);
  const selectedArea = ref("All");
  const currentPage = ref(1);

  const totalContributors = computed(
    () => new Set(contributions.value.map((c) => c.email).filter(Boolean)).size,
  );

  const totalAreas = computed(
    () => new Set(contributions.value.map((c) => c.area)).size,
  );

  const filtered = computed(() =>
    selectedArea.value === "All"
      ? contributions.value
      : contributions.value.filter((c) => c.area === selectedArea.value),
  );

  const totalPages = computed(() => Math.ceil(filtered.value.length / PAGE_SIZE));

  const paginated = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return filtered.value.slice(start, start + PAGE_SIZE);
  });

  const visiblePages = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, cur, cur - 1, cur + 1].filter((p) => p >= 1 && p <= total));
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
      result.push(sorted[i]);
    }
    return result;
  });

  function goToPage(p) {
    currentPage.value = p;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  watch(selectedArea, () => {
    currentPage.value = 1;
  });

  const formatPrice = (price) =>
    `RM ${parseFloat(price).toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getInitials = (first, last) =>
    `${first?.[0] ?? "?"}${last?.[0] ?? ""}`.toUpperCase();

  const configEntries = (cfg) =>
    cfg
      ? Object.entries(cfg).map(([k, v]) => ({
          label: k[0].toUpperCase() + k.slice(1),
          ...v,
        }))
      : [];

  onMounted(async () => {
    try {
      const data = await getContributionsApi();
      contributions.value = data.contributions;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  });

  return {
    contributions,
    loading,
    selectedArea,
    totalContributors,
    totalAreas,
    filtered,
    paginated,
    currentPage,
    totalPages,
    visiblePages,
    goToPage,
    formatPrice,
    formatDate,
    getInitials,
    configEntries,
  };
}
