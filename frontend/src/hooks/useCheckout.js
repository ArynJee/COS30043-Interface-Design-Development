import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import {
  createPaymentIntentApi,
  confirmOrderApi,
} from "@/services/orderServices";
import axios from "axios";

const SHIPPING_FEE = { sea: 10, air: 15 };
const FREE_THRESHOLD = { sea: 300, air: 1000 };
const TAX_RATE = 0.06;

export default function useCheckout() {
  const router = useRouter();
  const cartStore = useCartStore();

  // payment steps states
  const step = ref(1);
  const submitting = ref(false);
  const paymentError = ref("");

  // shipping form state
  const form = ref({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // card
  const cardForm = ref({ number: "", expiry: "", cvc: "" });
  const cardErrors = ref({ number: "", expiry: "", cvc: "" });

  function handleCardNumber(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    cardForm.value.number = digits.replace(/(.{4})(?=.)/g, "$1 ");
    cardErrors.value.number = "";
  }

  function handleExpiry(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    cardForm.value.expiry =
      digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
    cardErrors.value.expiry = "";
  }

  function handleCvc(e) {
    cardForm.value.cvc = e.target.value.replace(/\D/g, "").slice(0, 3);
    cardErrors.value.cvc = "";
  }

  // cart derived
  const selectedItems = computed(() => cartStore.selectedItems);
  const subtotal = computed(() => cartStore.subtotal);
  const selectedIds = computed(() => cartStore.selectedIds);

  const shippingFee = computed(() => {
    const method = cartStore.selectedShipping;
    return subtotal.value >= FREE_THRESHOLD[method] ? 0 : SHIPPING_FEE[method];
  });

  const taxAmount = computed(() => (subtotal.value + shippingFee.value) * TAX_RATE);
  const orderTotal = computed(() => subtotal.value + shippingFee.value + taxAmount.value);

  // format price
  const formatPrice = (val) => "RM " + parseFloat(val || 0).toFixed(2);

  function getItemName(item) {
    if (item.is_custom) {
      return (item.furniture_type || "Custom Item")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return item.item_name || "Product";
  }

  // error validation
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

  function validateCard() {
    let valid = true;
    const digits = cardForm.value.number.replace(/\s/g, "");
    if (digits.length !== 16) {
      cardErrors.value.number = "Card number must be 16 digits.";
      valid = false;
    }
    const parts = cardForm.value.expiry.split("/");
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
      cardErrors.value.expiry = "Enter a valid expiry date (MM/YY).";
      valid = false;
    }
    if (cardForm.value.cvc.length !== 3) {
      cardErrors.value.cvc = "CVC must be 3 digits.";
      valid = false;
    }
    return valid;
  }

  // actions
  function proceedToPayment() {
    const err = validateShipping();
    if (err) {
      alert(err);
      return;
    }
    step.value = 2;
  }

  async function placeOrder() {
    if (!validateCard()) return;

    submitting.value = true;
    paymentError.value = "";

    try {
      const piRes = await createPaymentIntentApi(selectedIds.value);
      const { paymentIntentId } = piRes.data;

      const orderRes = await confirmOrderApi(
        paymentIntentId,
        selectedIds.value,
        form.value,
        cartStore.selectedShipping,
        shippingFee.value,
        taxAmount.value,
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
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
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
    step,
    submitting,
    paymentError,
    form,
    cardForm,
    cardErrors,
    handleCardNumber,
    handleExpiry,
    handleCvc,
    selectedItems,
    subtotal,
    shippingFee,
    taxAmount,
    orderTotal,
    selectedIds,
    formatPrice,
    getItemName,
    proceedToPayment,
    placeOrder,
  };
}
