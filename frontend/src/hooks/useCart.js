import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import useOrderSummary, {
  SHIPPING_OPTIONS,
  FREE_THRESHOLD,
  formatPrice,
  getItemName,
} from "@/hooks/useOrderSummary";

export default function useCart() {
  const router = useRouter();
  const cartStore = useCartStore();

  const { items, loading, selectedIds, allSelected, subtotal, selectedShipping } =
    storeToRefs(cartStore);

  const {
    shippingOption,
    shippingFee,
    freeShippingThreshold,
    amountToFreeShipping,
    freeShippingProgress,
    freeShippingUnlocked,
    taxAmount,
    orderTotal,
  } = useOrderSummary(cartStore);

  function getItemImage(item) {
    const src = item.preview_image;
    if (!src) return "/product/placeholder.jpg";
    if (src.startsWith("/uploads/"))
      return `${import.meta.env.VITE_API_BASE_URL}${src}`;
    return src;
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
    cartStore,
    items,
    loading,
    selectedIds,
    allSelected,
    subtotal,
    SHIPPING_OPTIONS,
    FREE_THRESHOLD,
    selectedShipping,
    shippingOption,
    shippingFee,
    freeShippingThreshold,
    amountToFreeShipping,
    freeShippingProgress,
    freeShippingUnlocked,
    taxAmount,
    orderTotal,
    formatPrice,
    getItemName,
    getItemVariant,
    getItemImage,
    handleClearCart,
    goToCheckout,
  };
}
