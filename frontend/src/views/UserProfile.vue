<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ChevronDown, ChevronUp, Package, User, LogOut } from "@lucide/vue";
import axios from "axios";
import { fetchUserOrdersApi } from "@/services/orderServices";
import { useCartStore } from "@/stores/cart";

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
const activeTab = ref("orders"); // 'orders' | 'profile'

const form = ref({ firstName: "", lastName: "", phone: "", address: "" });

const API = "http://localhost:3000/api/auth";
function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

const formatPrice = (val) => "$" + parseFloat(val || 0).toFixed(2);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function toggleOrder(id) {
  if (expandedOrders.value.includes(id)) {
    expandedOrders.value = expandedOrders.value.filter((i) => i !== id);
  } else {
    expandedOrders.value.push(id);
  }
}

function getItemName(item) {
  return item.item_name || "Item";
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

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    router.push("/login");
    return;
  }
  await Promise.all([fetchProfile(), fetchOrders()]);
});
</script>

<template>
  <div class="profile-page">
    <!-- Hero -->
    <section class="profile-hero">
      <div class="hero-inner">
        <p class="hero-breadcrumb">
          <a href="/">Home</a>&ensp;&rsaquo;&ensp;My Account
        </p>
        <h1 class="hero-title">My Account</h1>
        <p class="hero-sub" v-if="user">
          Welcome back, {{ user.first_name }} {{ user.last_name }}
        </p>
      </div>
    </section>

    <div class="profile-content" v-if="!loadingProfile">
      <!-- Sidebar -->
      <aside class="profile-sidebar">
        <div class="sidebar-user">
          <div class="avatar-circle">
            {{ user?.first_name?.[0] }}{{ user?.last_name?.[0] }}
          </div>
          <div class="sidebar-name">
            {{ user?.first_name }} {{ user?.last_name }}
          </div>
          <div class="sidebar-email">{{ user?.email }}</div>
        </div>

        <nav class="sidebar-nav">
          <button
            class="sidebar-link"
            :class="{ active: activeTab === 'orders' }"
            @click="activeTab = 'orders'"
          >
            <Package :size="16" class="sidebar-icon" />
            My Orders
          </button>
          <button
            class="sidebar-link"
            :class="{ active: activeTab === 'profile' }"
            @click="activeTab = 'profile'"
          >
            <User :size="16" class="sidebar-icon" />
            Profile Details
          </button>
          <button class="sidebar-link logout-link" @click="logout">
            <LogOut :size="16" class="sidebar-icon" />
            Sign Out
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <div class="profile-main">
        <!-- Orders tab -->
        <div v-if="activeTab === 'orders'">
          <div class="tab-header">
            <h2 class="tab-title">Order History</h2>
            <span class="tab-count"
              >{{ orders.length }} order{{
                orders.length !== 1 ? "s" : ""
              }}</span
            >
          </div>

          <div v-if="loadingOrders" class="state-msg">Loading orders…</div>

          <div v-else-if="orders.length === 0" class="empty-state">
            <p>You haven't placed any orders yet.</p>
            <a href="/products" class="empty-cta">Browse Products →</a>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-card">
              <!-- Order header (always visible) -->
              <div class="order-header" @click="toggleOrder(order.id)">
                <div class="order-meta">
                  <span class="order-id">#{{ order.id }}</span>
                  <span class="order-date">{{
                    formatDate(order.created_at)
                  }}</span>
                </div>
                <div class="order-right">
                  <span class="order-total">{{
                    formatPrice(order.total_amount)
                  }}</span>
                  <span class="order-status-badge">{{ order.status }}</span>
                  <component
                    :is="
                      expandedOrders.includes(order.id)
                        ? ChevronUp
                        : ChevronDown
                    "
                    :size="16"
                    class="order-chevron"
                  />
                </div>
              </div>

              <!-- Shipping info + items (expanded) -->
              <div
                v-if="expandedOrders.includes(order.id)"
                class="order-detail"
              >
                <div class="order-shipping">
                  <div class="detail-label">Shipped to</div>
                  <div class="detail-value">
                    {{ order.shipping_name }} — {{ order.shipping_address }},
                    {{ order.shipping_city }}, {{ order.shipping_state }}
                    {{ order.shipping_zip }}
                  </div>
                </div>

                <div class="order-items">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="order-item"
                  >
                    <div class="order-item-img-wrap">
                      <img
                        :src="item.preview_image || '/product/placeholder.jpg'"
                        :alt="getItemName(item)"
                        class="order-item-img"
                      />
                    </div>
                    <div class="order-item-info">
                      <div class="order-item-name">{{ getItemName(item) }}</div>
                      <div
                        class="order-item-type"
                        v-if="item.item_type === 'custom'"
                      >
                        Custom
                      </div>
                    </div>
                    <div class="order-item-qty">× {{ item.quantity }}</div>
                    <div class="order-item-price">
                      {{ formatPrice(item.unit_price * item.quantity) }}
                    </div>
                  </div>
                </div>

                <div class="order-summary-row">
                  <span>Order Total</span>
                  <span class="order-summary-total">{{
                    formatPrice(order.total_amount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile tab -->
        <div v-if="activeTab === 'profile'">
          <div class="tab-header">
            <h2 class="tab-title">Profile Details</h2>
            <button v-if="!editMode" class="edit-btn" @click="editMode = true">
              Edit
            </button>
          </div>

          <div v-if="!editMode" class="profile-view">
            <div class="profile-row">
              <span class="profile-label">First Name</span>
              <span class="profile-value">{{ user?.first_name }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Last Name</span>
              <span class="profile-value">{{ user?.last_name }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Email</span>
              <span class="profile-value">{{ user?.email }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Phone</span>
              <span class="profile-value">{{ user?.phone_number || "—" }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Address</span>
              <span class="profile-value">{{ user?.address || "—" }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Member Since</span>
              <span class="profile-value">{{
                formatDate(user?.created_at)
              }}</span>
            </div>
          </div>

          <div v-else class="profile-edit-form">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">First Name</label>
                <input
                  v-model="form.firstName"
                  class="field-input"
                  type="text"
                />
              </div>
              <div class="field-group">
                <label class="field-label">Last Name</label>
                <input
                  v-model="form.lastName"
                  class="field-input"
                  type="text"
                />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Phone</label>
              <input v-model="form.phone" class="field-input" type="tel" />
            </div>
            <div class="field-group">
              <label class="field-label">Address</label>
              <input v-model="form.address" class="field-input" type="text" />
            </div>

            <div v-if="saveError" class="save-error">{{ saveError }}</div>
            <div v-if="saveSuccess" class="save-success">
              Changes saved successfully.
            </div>

            <div class="edit-actions">
              <button class="save-btn" @click="saveProfile" :disabled="saving">
                {{ saving ? "Saving…" : "Save Changes" }}
              </button>
              <button
                class="cancel-btn"
                @click="
                  editMode = false;
                  saveError = '';
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="state-msg">Loading profile…</div>
  </div>
</template>

<style scoped>
@import "@/styles/main.css";

.profile-page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* ── Hero (always dark) ── */
.profile-hero {
  background: #2c2218;
  padding: 3rem 5rem;
  position: relative;
}
.hero-breadcrumb {
  font-size: 0.72rem;
  color: var(--color-muted);
  margin-bottom: 0.75rem;
}
.hero-breadcrumb a {
  color: var(--color-muted);
  text-decoration: none;
}
.hero-breadcrumb a:hover {
  color: var(--accent);
}
.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f0e1cc;
  margin-bottom: 0.35rem;
}
.hero-sub {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin: 0;
}

/* ── Layout ── */
.profile-content {
  display: flex;
  gap: 2rem;
  padding: 2.5rem 5rem;
  align-items: flex-start;
}
.profile-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow: hidden;
}
.profile-main {
  flex: 1;
  min-width: 0;
}

/* ── Sidebar ── */
.sidebar-user {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--border-light);
}
.avatar-circle {
  width: 52px;
  height: 52px;
  background: var(--accent);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.6rem;
  text-transform: uppercase;
}
.sidebar-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.2rem;
}
.sidebar-email {
  font-size: 0.72rem;
  color: var(--color-muted);
  word-break: break-all;
}
.sidebar-nav {
  padding: 0.5rem;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: none;
  border: none;
  font-family: var(--font-serif);
  font-size: 0.83rem;
  color: var(--color-primary);
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    color 0.15s;
}
.sidebar-link:hover {
  background: var(--bg-page);
}
.sidebar-link.active {
  background: var(--bg-page);
  color: var(--color-primary);
  font-weight: 600;
}
.sidebar-icon {
  flex-shrink: 0;
  color: var(--color-muted);
}
.sidebar-link.active .sidebar-icon {
  color: var(--accent);
}
.logout-link {
  color: var(--color-error-2);
  border-top: 1px solid var(--border-light);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
}
.logout-link:hover {
  background: #fff5f5;
}

/* ── Tab header ── */
.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.tab-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}
.tab-count {
  font-size: 0.78rem;
  color: var(--color-muted);
}
.edit-btn {
  background: none;
  border: 1px solid var(--border-input);
  font-family: var(--font-serif);
  font-size: 0.78rem;
  color: var(--color-primary);
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: var(--bg-elevated);
}

/* ── Orders list ── */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.order-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow: hidden;
}
.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s;
}
.order-header:hover {
  background: var(--bg-elevated);
}
.order-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.order-id {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
}
.order-date {
  font-size: 0.75rem;
  color: var(--color-muted);
}
.order-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.order-total {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
}
.order-status-badge {
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--color-success);
  color: #fff;
  padding: 0.15rem 0.5rem;
}
.order-chevron {
  color: var(--color-muted);
}
.order-detail {
  border-top: 1px solid var(--border-light);
  padding: 1rem 1.25rem;
}
.order-shipping {
  margin-bottom: 1rem;
}
.detail-label {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 0.2rem;
}
.detail-value {
  font-size: 0.82rem;
  color: var(--color-primary);
}
.order-items {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.order-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-light);
}
.order-item:last-child {
  border-bottom: none;
}
.order-item-img-wrap {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}
.order-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid var(--border);
}
.order-item-info {
  flex: 1;
  min-width: 0;
}
.order-item-name {
  font-size: 0.83rem;
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.order-item-type {
  font-size: 0.62rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--accent);
}
.order-item-qty {
  font-size: 0.8rem;
  color: var(--color-muted);
  white-space: nowrap;
}
.order-item-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}
.order-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}
.order-summary-total {
  color: var(--color-primary);
}

/* ── Profile view ── */
.profile-view {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 0;
}
.profile-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
}
.profile-row:last-child {
  border-bottom: none;
}
.profile-label {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  min-width: 110px;
  flex-shrink: 0;
}
.profile-value {
  font-size: 0.88rem;
  color: var(--color-primary);
}

/* ── Profile edit ── */
.profile-edit-form {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 1.5rem;
}
.field-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
}
.field-row .field-group {
  flex: 1;
}
.field-group {
  margin-bottom: 1.1rem;
}
.field-label {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 0.35rem;
}
.field-input {
  width: 100%;
  border: 1px solid var(--border-input);
  padding: 0.6rem 0.8rem;
  font-family: var(--font-serif);
  font-size: 0.88rem;
  color: var(--color-primary);
  background: var(--bg-surface);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.field-input:focus {
  border-color: var(--accent-hover);
}
.save-error {
  font-size: 0.78rem;
  color: var(--color-error-2);
  margin-bottom: 0.75rem;
}
.save-success {
  font-size: 0.78rem;
  color: var(--color-success);
  margin-bottom: 0.75rem;
}
.edit-actions {
  display: flex;
  gap: 0.75rem;
}
.save-btn {
  background: var(--btn-bg);
  color: var(--btn-color);
  border: none;
  padding: 0.65rem 1.5rem;
  font-family: var(--font-serif);
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
}
.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.cancel-btn {
  background: none;
  border: 1px solid var(--border-input);
  color: var(--color-secondary);
  padding: 0.65rem 1.5rem;
  font-family: var(--font-serif);
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: var(--bg-elevated);
}

/* ── States ── */
.state-msg {
  padding: 3rem 5rem;
  text-align: center;
  color: var(--color-muted);
  font-size: 0.9rem;
}
.empty-state {
  padding: 2.5rem;
  text-align: center;
  color: var(--color-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border);
}
.empty-state p {
  margin-bottom: 0.75rem;
}
.empty-cta {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.85rem;
}
.empty-cta:hover {
  text-decoration: underline;
}

/* ── Responsive ── */
@media (max-width: 991px) {
  .profile-content {
    padding: 1.5rem 2.5rem;
  }
  .profile-hero {
    padding: 2rem 2.5rem;
  }
}
@media (max-width: 767px) {
  .profile-content {
    padding: 1rem 1.25rem;
    flex-direction: column;
  }
  .profile-hero {
    padding: 1.5rem 1.25rem;
  }
  .profile-sidebar {
    width: 100%;
  }
  .field-row {
    flex-direction: column;
  }
  .state-msg {
    padding: 2rem 1.25rem;
  }
}
</style>
