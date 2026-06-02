import { ref } from "vue";
import { useRoute } from "vue-router";

const SHIPPING_LABELS = {
  sea: "Sea Shipping (14-21 days)",
  air: "Air Shipping (3-7 days)",
};

export default function useOrderConfirmation() {
  const route = useRoute();

  const orderId = ref(route.query.orderId || "");
  const total = ref(parseFloat(route.query.total || 0));
  const orderShippingMethod = SHIPPING_LABELS[route.query.shippingMethod] || "—";

  const formatPrice = (val) => "RM " + parseFloat(val || 0).toFixed(2);

  const now = new Date();
  const orderDate = now.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    orderId,
    total,
    formatPrice,
    orderDate,
    orderShippingMethod,
  };
}
