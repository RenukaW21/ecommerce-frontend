import axios from 'axios';
import BASE_URL from '../config/config';

export const IMAGE_BASE_URL =
  'http://localhost/fullstack/backend_project/uploads/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// ================= AUTH =================

export const loginUser = (credentials) =>
  api.post('login.php', credentials);

export const signupUser = (userData) =>
  api.post('signup.php', userData);


// ================= PRODUCTS =================

export const getProducts = (params) =>
  api.get('getProducts.php', { params });

export const getProduct = (id) =>
  api.get(`getSingleProduct.php?id=${id}`);


// ================= CATEGORIES =================

export const getCategories = () =>
  api.get('getCategory.php');

// Cart
export const getCart = (userId) => api.get(`getCart.php?user_id=${userId}`);
export const removeFromCart = (cartId) => api.post('removeFromCart.php', { cart_id: cartId });
export const updateCartQuantity = (cartId, action) => api.post('updateCartQuantity.php', { cart_id: cartId, action });


// ================= PROFILE =================

export const getProfile = () =>
  api.get('getProfile.php');

export const updateProfile = (data) =>
  api.post('updateProfile.php', data);


// ================= ADDRESS =================

export const getAddresses = () =>
  api.get('getAddresses.php');

export const addAddress = (data) =>
  api.post('addAddress.php', data);

export const deleteAddress = (id) =>
  api.post('deleteAddress.php', { id });


// ================= CART =================

export const addToCart = (data) =>
  api.post('addToCart.php', data);


// ================= ORDERS =================

export const placeOrder = (data) =>
  api.post('placeOrder.php', data);

export const getUserOrders = (userId) =>
  api.get(`getUserOrders.php?user_id=${userId}`);

export const getOrderDetails = (orderId) =>
  api.get(`getOrderDetails.php?order_id=${orderId}`);


// ================= PAYMENT =================

export const createPayment = (data) =>
  api.post('createPayment.php', data);

export const updatePaymentStatus = (data) =>
  api.post('updatePaymentStatus.php', data);


export default api;