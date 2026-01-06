import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/",
});

//auth
export const UserSignUp = async (data) => await API.post("/user/signup", data);
export const UserSignIn = async (data) => await API.post("/user/signin", data);

//products
export const getAllProducts = async (filter) =>
  await API.get(`/food?${filter}`, filter);

export const getProductDetails = async (id) => await API.get(`/food/${id}`);

//Cart
export const getCart = async (token) =>
  await API.get(`/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = async (token, data) =>
  await API.post(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromCart = async (token, data) =>
  await API.patch(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//favorites

export const getFavourite = async (token) =>
  await API.get(`/user/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToFavourite = async (token, data) =>
  await API.post(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromFavourite = async (token, data) =>
  await API.patch(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Orders
export const placeOrder = async (token, data) =>
  await API.post(`/user/order/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrders = async (token) => {
  const res = await API.get("/user/order", {
    headers: { Authorization: `Bearer ${token}` },
    params: { _t: Date.now() }
  });
  // Normalize response to always be an array of orders
  if (res.data && res.data.orders) {
    res.data = res.data.orders;
  }
  return res;
};

// Admin APIs
export const getAdminOrders = async (token) =>
  await API.get("/user/admin/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateOrderStatus = async (token, orderId, data) =>
  await API.patch(`/user/admin/order/${orderId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addProduct = async (token, data) =>
  await API.post("/food/add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProduct = async (token, id, data) =>
  await API.patch(`/food/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteProduct = async (token, id) =>
  await API.delete(`/food/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
