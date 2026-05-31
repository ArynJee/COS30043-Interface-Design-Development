import { computed } from "vue";

export const SHIPPING_OPTIONS = [
  { id: "sea", label: "Sea Shipping", days: "14-21 days", fee: 10 },
  { id: "air", label: "Air Shipping", days: "3-7 days", fee: 15 },
];

export const FREE_THRESHOLD = { sea: 300, air: 3000 };

const TAX_RATE = 0.06;

export const formatPrice = (val) =>
  "RM " + parseFloat(val || 0).toFixed(2);

export function getItemName(item) {
  if (item.is_custom) {
    return (item.furniture_type || "Custom Item")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return item.item_name || "Product";
}

export default function useOrderSummary(cartStore) {
  const subtotal = computed(() => cartStore.subtotal);

  const shippingOption = computed(() =>
    SHIPPING_OPTIONS.find((o) => o.id === cartStore.selectedShipping),
  );

  const shippingFee = computed(() => {
    const threshold = FREE_THRESHOLD[cartStore.selectedShipping];
    return subtotal.value >= threshold ? 0 : shippingOption.value.fee;
  });

  const freeShippingThreshold = computed(
    () => FREE_THRESHOLD[cartStore.selectedShipping],
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

  const taxAmount = computed(
    () => (subtotal.value + shippingFee.value) * TAX_RATE,
  );

  const orderTotal = computed(
    () => subtotal.value + shippingFee.value + taxAmount.value,
  );

  return {
    shippingOption,
    shippingFee,
    freeShippingThreshold,
    amountToFreeShipping,
    freeShippingProgress,
    freeShippingUnlocked,
    taxAmount,
    orderTotal,
  };
}
