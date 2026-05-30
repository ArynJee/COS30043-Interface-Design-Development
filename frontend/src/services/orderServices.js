import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createPaymentIntentApi = (itemIds) =>
  axios.post(`${BASE}/create-payment-intent`, { itemIds }, { headers: authHeader() });

export const confirmOrderApi = (paymentIntentId, itemIds, shippingInfo, shippingMethod, shippingFee, taxAmount) =>
  axios.post(
    `${BASE}/confirm`,
    { paymentIntentId, itemIds, shippingInfo, shippingMethod, shippingFee, taxAmount },
    { headers: authHeader() }
  );

export const fetchUserOrdersApi = () =>
  axios.get(BASE, { headers: authHeader() });
