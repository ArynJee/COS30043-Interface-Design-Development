import axios from "axios";

const BASE = "http://localhost:3000/api/cart";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchCartApi = () =>
  axios.get(BASE, { headers: authHeader() });

export const addProductToCartApi = (product) =>
  axios.post(
    BASE,
    {
      product_id: product.id,
      item_name: product.name,
      unit_price: product.base_price,
      is_custom: false,
      preview_image: product.images?.[0] || null,
    },
    { headers: authHeader() }
  );

export const updateCartItemApi = (id, quantity) =>
  axios.patch(`${BASE}/${id}`, { quantity }, { headers: authHeader() });

export const removeCartItemApi = (id) =>
  axios.delete(`${BASE}/${id}`, { headers: authHeader() });

export const clearCartApi = () =>
  axios.delete(BASE, { headers: authHeader() });

export const reorderItemApi = (item) => {
  const isCustom = item.item_type === "custom";
  return axios.post(
    BASE,
    {
      product_id: isCustom ? null : item.product_id,
      item_name: isCustom ? null : item.item_name,
      furniture_type: isCustom ? item.item_name : null,
      unit_price: item.unit_price,
      is_custom: isCustom,
      preview_image: item.preview_image || null,
      configuration: isCustom
        ? (typeof item.configuration === "string"
            ? JSON.parse(item.configuration)
            : item.configuration) || {}
        : null,
      quantity: item.quantity,
    },
    { headers: authHeader() }
  );
};
