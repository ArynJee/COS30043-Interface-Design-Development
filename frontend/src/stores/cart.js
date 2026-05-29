import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  fetchCartApi,
  addProductToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "@/services/cartServices";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const loading = ref(false);
  const selectedIds = ref([]);

  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value
      .filter((i) => selectedIds.value.includes(i.id))
      .reduce((sum, i) => sum + parseFloat(i.unit_price) * i.quantity, 0)
  );

  const selectedItems = computed(() =>
    items.value.filter((i) => selectedIds.value.includes(i.id))
  );

  const allSelected = computed(
    () =>
      items.value.length > 0 &&
      selectedIds.value.length === items.value.length
  );

  async function fetchCart() {
    if (!localStorage.getItem("token")) {
      items.value = [];
      selectedIds.value = [];
      return;
    }
    loading.value = true;
    try {
      const res = await fetchCartApi();
      items.value = res.data.items;
      selectedIds.value = items.value.map((i) => i.id);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      loading.value = false;
    }
  }

  async function addProduct(product) {
    if (!localStorage.getItem("token")) return false;
    try {
      await addProductToCartApi(product);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      return false;
    }
  }

  async function updateQuantity(id, quantity) {
    if (quantity < 1) return;
    try {
      await updateCartItemApi(id, quantity);
      const item = items.value.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  }

  async function removeItem(id) {
    try {
      await removeCartItemApi(id);
      items.value = items.value.filter((i) => i.id !== id);
      selectedIds.value = selectedIds.value.filter((i) => i !== id);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  }

  async function clearCart() {
    try {
      await clearCartApi();
      items.value = [];
      selectedIds.value = [];
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }

  function toggleSelect(id) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((i) => i !== id);
    } else {
      selectedIds.value = [...selectedIds.value, id];
    }
  }

  function toggleSelectAll() {
    if (allSelected.value) {
      selectedIds.value = [];
    } else {
      selectedIds.value = items.value.map((i) => i.id);
    }
  }

  return {
    items,
    loading,
    selectedIds,
    selectedItems,
    itemCount,
    subtotal,
    allSelected,
    fetchCart,
    addProduct,
    updateQuantity,
    removeItem,
    clearCart,
    toggleSelect,
    toggleSelectAll,
  };
});
