import { computed, toValue } from "vue";

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatPrice = (price) =>
  `RM ${parseFloat(price).toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const getInitials = (first, last) =>
  `${first?.[0] ?? "?"}${last?.[0] ?? ""}`.toUpperCase();

export const parseConfigEntries = (cfg) => {
  if (!cfg) return [];
  const obj = typeof cfg === "string" ? JSON.parse(cfg) : cfg;
  return Object.entries(obj).map(([k, v]) => ({
    label: k[0].toUpperCase() + k.slice(1),
    name: typeof v === "object" ? v.name : String(v),
  }));
};

export default function useContributionCard(contributionRef) {
  const c = computed(() => toValue(contributionRef));

  const imageSrc = computed(() => {
    const url = c.value.preview_image_url;
    if (!url) return "/home/living-room.jpg";
    if (url.startsWith("/uploads/"))
      return `${import.meta.env.VITE_API_BASE_URL}${url}`;
    return url;
  });

  const typeName = computed(() =>
    (c.value.furniture_type || "").replace(/_/g, " "),
  );

  const configEntries = computed(() => parseConfigEntries(c.value.configuration));

  const formattedDate = computed(() => formatDate(c.value.created_at));

  const formattedPrice = computed(() => formatPrice(c.value.total_cost));

  return { imageSrc, typeName, configEntries, formattedDate, formattedPrice, getInitials };
}
