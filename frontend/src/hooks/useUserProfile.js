import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { fetchUserOrdersApi } from "@/services/orderServices";
import { reorderItemApi } from "@/services/cartServices";
import { useCartStore } from "@/stores/cart";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;
const SHIPPING_LABELS = {
  sea: "Sea Shipping (14–21 days)",
  air: "Air Shipping (3–7 days)",
};

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export default function useUserProfile() {
  const router = useRouter();
  const cartStore = useCartStore();

  const user = ref(null);
  const orders = ref([]);
  const loadingProfile = ref(true);
  const loadingOrders = ref(true);
  const editMode = ref(false);
  const saving = ref(false);
  const saveError = ref("");
  const saveSuccess = ref(false);
  const expandedOrders = ref([]);
  const activeTab = ref("orders");
  const reorderingId = ref(null);
  const contributions = ref([]);
  const loadingContributions = ref(true);

  const form = ref({ firstName: "", lastName: "", phone: "", address: "" });

  const formatPrice = (val) => "RM " + parseFloat(val || 0).toFixed(2);

  const configEntries = (cfg) => {
    if (!cfg) return []
    const obj = typeof cfg === 'string' ? JSON.parse(cfg) : cfg
    return Object.entries(obj).map(([k, v]) => ({
      label: k[0].toUpperCase() + k.slice(1),
      ...v,
    }))
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const shippingLabel = (method) => SHIPPING_LABELS[method] || "—";

  function getItemName(item) {
    const name = item.item_name || "Item";
    if (item.item_type === "custom") {
      return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return name;
  }

  function toggleOrder(id) {
    if (expandedOrders.value.includes(id)) {
      expandedOrders.value = expandedOrders.value.filter((i) => i !== id);
    } else {
      expandedOrders.value.push(id);
    }
  }

  async function fetchProfile() {
    try {
      const res = await axios.get(`${API}/me`, { headers: authHeader() });
      user.value = res.data;
      form.value = {
        firstName: res.data.first_name || "",
        lastName: res.data.last_name || "",
        phone: res.data.phone_number || "",
        address: res.data.address || "",
      };
    } catch {
      router.push("/login");
    } finally {
      loadingProfile.value = false;
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetchUserOrdersApi();
      orders.value = res.data.orders;
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      loadingOrders.value = false;
    }
  }

  async function fetchContributions() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showcase/mine`, { headers: authHeader() });
      contributions.value = res.data.contributions;
    } catch (err) {
      console.error("Failed to fetch contributions:", err);
    } finally {
      loadingContributions.value = false;
    }
  }

  async function saveProfile() {
    saving.value = true;
    saveError.value = "";
    saveSuccess.value = false;
    try {
      const res = await axios.patch(`${API}/me`, form.value, {
        headers: authHeader(),
      });
      user.value = { ...user.value, ...res.data };
      editMode.value = false;
      saveSuccess.value = true;
      setTimeout(() => (saveSuccess.value = false), 3000);
    } catch (err) {
      saveError.value = err.response?.data?.message || "Failed to save changes.";
    } finally {
      saving.value = false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    cartStore.items = [];
    cartStore.selectedIds = [];
    router.push("/login");
  }

  async function orderAgain(order) {
    reorderingId.value = order.id;
    try {
      for (const item of order.items) {
        await reorderItemApi(item);
      }
      await cartStore.fetchCart();
      router.push("/cart");
    } catch (err) {
      console.error("Failed to re-add items to cart:", err);
      alert("Could not add items to cart. Please try again.");
    } finally {
      reorderingId.value = null;
    }
  }

  onMounted(async () => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    await Promise.all([fetchProfile(), fetchOrders(), fetchContributions()]);
  });

  return {
    user,
    orders,
    loadingProfile,
    loadingOrders,
    editMode,
    saving,
    saveError,
    saveSuccess,
    expandedOrders,
    activeTab,
    reorderingId,
    form,
    formatPrice,
    formatDate,
    shippingLabel,
    getItemName,
    toggleOrder,
    fetchProfile,
    fetchOrders,
    fetchContributions,
    saveProfile,
    logout,
    orderAgain,
    contributions,
    loadingContributions,
    configEntries,
  };
}
