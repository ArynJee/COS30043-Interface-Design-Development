import { ref, computed, onMounted } from "vue";
import { getContributionsApi } from "@/services/showcaseServices.js";

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
    formatPrice,
    formatDate,
    getInitials,
    configEntries,
  };
}
