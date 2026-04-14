import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const getCategories = () => API.get('/products/categories');
export const createReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Admin Products
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getMyOrders = () => API.get('/orders/myorders');
export const payOrder = (id, data) => API.put(`/orders/${id}/pay`, data);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Payment
export const createPaymentIntent = (amount) => API.post('/payment/create-payment-intent', { amount });

// Admin
export const getDashboardStats = () => API.get('/admin/dashboard');
export const getAllUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const toggleAdminRole = (id) => API.put(`/admin/users/${id}/toggle-admin`);

export default API;
