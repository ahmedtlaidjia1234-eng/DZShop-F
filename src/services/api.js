const API_BASE = 'http://localhost:5000/api';
export const SERVER_BASE = 'http://localhost:5000';

// Helper for making secure requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aura_admin_token');
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API] ${endpoint} fetch issue:`, error.message);
    throw error;
  }
}

// Check Backend Health
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// Products
export async function fetchProductsAPI() {
  const data = await request('/products');
  return data.products;
}

export async function fetchProductByIdAPI(id) {
  const data = await request(`/products/${id}`);
  return data.product;
}

export async function createProductAPI(productData) {
  const data = await request('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  return data.product;
}

export async function updateProductAPI(id, productData) {
  const data = await request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
  return data.product;
}

export async function deleteProductAPI(id) {
  return await request(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Site Settings
export async function fetchSettingsAPI() {
  const data = await request('/settings');
  return {
    settings: data.settings,
    system: data.system,
  };
}

export async function updateSettingsAPI(settingsData) {
  const data = await request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
  return data.settings;
}

// Orders & Checkout
export async function submitOrderAPI(orderData) {
  const data = await request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return data.order;
}

export async function fetchOrdersAPI() {
  const data = await request('/orders');
  return data.orders;
}

export async function updateOrderStatusAPI(orderId, status) {
  return await request(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function deleteOrderAPI(orderId) {
  return await request(`/orders/${orderId}`, {
    method: 'DELETE',
  });
}

// Authentication & Profile Security
export async function loginAdminAPI(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (data.token) {
    localStorage.setItem('aura_admin_token', data.token);
    localStorage.setItem('aura_admin_user', JSON.stringify(data.user));
  }
  return data;
}

export async function updateAdminProfileAPI(profileData) {
  const data = await request('/auth/profile', {   
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  if (data.token) {
    localStorage.setItem('aura_admin_token', data.token);
    localStorage.setItem('aura_admin_user', JSON.stringify(data.user));
  }
  return data;
}

export function logoutAdmin() {
  localStorage.removeItem('aura_admin_token');
  localStorage.removeItem('aura_admin_user');
}

export function getStoredAdminUser() {
  try {
    const saved = localStorage.getItem('aura_admin_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Upload Image from Device
export async function uploadImageAPI(file) {
  const formData = new FormData();
  formData.append('image', file);

  const data = await request('/upload', {
    method: 'POST',
    body: formData,
  });

  if (data.url && (data.url.startsWith('http://') || data.url.startsWith('https://'))) {
    return data.url;
  }
  return `${SERVER_BASE}${data.url}`;
}
