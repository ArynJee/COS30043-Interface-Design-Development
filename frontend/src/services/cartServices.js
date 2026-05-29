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
