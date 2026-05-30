import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/stores/cart";
import {
  createPaymentIntentApi,
  confirmOrderApi,
} from "@/services/orderServices";
import axios from "axios";

export default function useCheckout() {
  const router = useRouter();
  const cartStore = useCartStore();

  // ── Step state ───────────────────────────────────────────────────────────────
  const step = ref(1);
  const submitting = ref(false);
  const paymentError = ref("");

  // ── Shipping form ────────────────────────────────────────────────────────────
  const form = ref({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // ── Stripe ──────────────────────────────────────────────────────────────────
  let stripe = null;
  let cardElement = null;
  const stripeReady = ref(false);

  // ── Cart derived ─────────────────────────────────────────────────────────────
  const selectedItems = computed(() => cartStore.selectedItems);
  const subtotal = computed(() => cartStore.subtotal);
  const selectedIds = computed(() => cartStore.selectedIds);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatPrice = (val) => "RM " + parseFloat(val || 0).toFixed(2);

  function getItemName(item) {
    if (item.is_custom) {
      return (item.furniture_type || "Custom Item")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return item.item_name || "Product";
  }

  // ── Validation ───────────────────────────────────────────────────────────────
  function validateShipping() {
    const { name, address, city, state, zip } = form.value;
    if (
      !name.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zip.trim()
    ) {
      return "Please fill in all shipping fields.";
    }
    return null;
  }

  // ── Stripe init ──────────────────────────────────────────────────────────────
  async function initStripe() {
    try {
      stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const elements = stripe.elements({ fonts: [{ cssSrc: "" }] });
      cardElement = elements.create("card", {
        style: {
          base: {
            fontFamily: "'Times New Roman', serif",
            fontSize: "14px",
            color: "#2c2218",
            "::placeholder": { color: "#b8aaa0" },
          },
          invalid: { color: "#c0392b" },
        },
        hidePostalCode: true,
        disableLink: true,
      });
      cardElement.mount("#stripe-card-element");
      stripeReady.value = true;
    } catch (e) {
      paymentError.value =
        "Failed to load payment form. Check your Stripe publishable key.";
      console.error(e);
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────────
  async function proceedToPayment() {
    const err = validateShipping();
    if (err) {
      alert(err);
      return;
    }
    step.value = 2;
    await nextTick();
    await initStripe();
  }

  async function placeOrder() {
    if (!stripe || !cardElement) return;
    submitting.value = true;
    paymentError.value = "";

    try {
      const piRes = await createPaymentIntentApi(selectedIds.value);
      const { clientSecret, paymentIntentId } = piRes.data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: form.value.name },
          },
        },
      );

      if (error) {
        paymentError.value = error.message;
        submitting.value = false;
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        paymentError.value = "Payment was not completed. Please try again.";
        submitting.value = false;
        return;
      }

      const orderRes = await confirmOrderApi(
        paymentIntentId,
        selectedIds.value,
        form.value,
      );
      const { order } = orderRes.data;

      await cartStore.fetchCart();
      router.push(
        `/order-confirmation?orderId=${order.id}&total=${order.total}`,
      );
    } catch (err) {
      paymentError.value =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      submitting.value = false;
    }
  }

  async function prefillFromProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = res.data;
      if (u.first_name)
        form.value.name = `${u.first_name} ${u.last_name}`.trim();
      if (u.address) form.value.address = u.address;
    } catch {
      // silently ignore
    }
  }

  onMounted(async () => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    if (cartStore.selectedIds.length === 0) {
      router.push("/cart");
      return;
    }
    await prefillFromProfile();
  });

  return {
    // state
    step,
    submitting,
    paymentError,
    form,
    stripeReady,
    // cart derived
    selectedItems,
    subtotal,
    selectedIds,
    // helpers
    formatPrice,
    getItemName,
    // actions
    proceedToPayment,
    placeOrder,
  };
}
