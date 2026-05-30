import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";

const SHIPPING_OPTIONS = [
  { id: "sea", label: "Sea Shipping", days: "14-21 days", fee: 10 },
  { id: "air", label: "Air Shipping", days: "3-7 days", fee: 15 },
];
const FREE_THRESHOLD = { sea: 300, air: 1000 };
const TAX_RATE = 0.06;

export default function useCart() {
  const router = useRouter();
  const cartStore = useCartStore();

  const { items, loading, selectedIds, allSelected, subtotal, selectedShipping } =
    storeToRefs(cartStore);

  const shippingOption = computed(() =>
    SHIPPING_OPTIONS.find((o) => o.id === selectedShipping.value),
  );

  const shippingFee = computed(() => {
    const threshold = FREE_THRESHOLD[selectedShipping.value];
    return subtotal.value >= threshold ? 0 : shippingOption.value.fee;
  });

  const freeShippingThreshold = computed(
    () => FREE_THRESHOLD[selectedShipping.value],
  );

  const amountToFreeShipping = computed(() =>
    Math.max(0, freeShippingThreshold.value - subtotal.value),
  );

  const freeShippingProgress = computed(() =>
    Math.min(100, (subtotal.value / freeShippingThreshold.value) * 100),
  );

  const freeShippingUnlocked = computed(
    () => subtotal.value >= freeShippingThreshold.value,
  );

  // ── Tax & totals ────────────────────────────────────────────────────────────
  const taxAmount = computed(
    () => (subtotal.value + shippingFee.value) * TAX_RATE,
  );

  const orderTotal = computed(
    () => subtotal.value + shippingFee.value + taxAmount.value,
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatPrice = (val) => "RM " + parseFloat(val || 0).toFixed(2);

  function getItemName(item) {
    if (item.is_custom) {
      return (item.furniture_type || "Custom Item")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return item.item_name || "Product";
  }

  function getItemVariant(item) {
    if (item.is_custom) {
      const raw = item.configuration;
      const cfg = typeof raw === "string" ? JSON.parse(raw) : raw || {};
      const parts = Object.entries(cfg)
        .slice(0, 2)
        .map(([k, v]) => {
          const label =
            typeof v === "object" && v !== null ? (v.name ?? String(v)) : v;
          return `${k}: ${label}`;
        });
      return parts.join(" · ") || "Custom Configuration";
    }
    return "";
  }

  // ── Actions ─────────────────────────────────────────────────────────────────
  async function handleClearCart() {
    if (!confirm("Remove all items from your cart?")) return;
    await cartStore.clearCart();
  }

  function goToCheckout() {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    if (selectedIds.value.length === 0) return;
    router.push("/checkout");
  }

  onMounted(() => {
    cartStore.fetchCart();
  });

  return {
    // store (for direct method calls in template)
    cartStore,
    // store refs
    items,
    loading,
    selectedIds,
    allSelected,
    subtotal,
    // shipping
    SHIPPING_OPTIONS,
    FREE_THRESHOLD,
    selectedShipping,
    shippingOption,
    shippingFee,
    freeShippingThreshold,
    amountToFreeShipping,
    freeShippingProgress,
    freeShippingUnlocked,
    // totals
    taxAmount,
    orderTotal,
    // helpers
    formatPrice,
    getItemName,
    getItemVariant,
    // actions
    handleClearCart,
    goToCheckout,
  };
}
