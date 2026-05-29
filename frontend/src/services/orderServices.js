import axios from "axios";

const BASE = "http://localhost:3000/api/orders";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createPaymentIntentApi = (itemIds) =>
  axios.post(`${BASE}/create-payment-intent`, { itemIds }, { headers: authHeader() });

export const confirmOrderApi = (paymentIntentId, itemIds, shippingInfo) =>
  axios.post(
    `${BASE}/confirm`,
    { paymentIntentId, itemIds, shippingInfo },
    { headers: authHeader() }
  );

export const fetchUserOrdersApi = () =>
  axios.get(BASE, { headers: authHeader() });
