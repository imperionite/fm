import axios from "axios";
import { jwtDecode } from "jwt-decode";
import qs from "qs";

// For Django/DRF
const baseURL = import.meta.env.VITE_BASE_URL_CORE;

const baseURLService = import.meta.env.VITE_BASE_URL_SERVICE;

// For DRF
const http = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 100000,
});

// For Express
export const api = axios.create({
  baseURL: baseURLService,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 100000,
});

// Function to get access token
const getAccessToken = () => {
  const jwtAtom = localStorage.getItem("jwtAtom");
  let token = jwtAtom ? JSON.parse(jwtAtom) : null;
  return token ? token.access : null;
};

// Function to get refresh token
const getRefreshToken = () => {
  const jwtAtom = localStorage.getItem("jwtAtom");
  let token = jwtAtom ? JSON.parse(jwtAtom) : null;
  return token ? token.refresh : null;
};

// Interceptor to add the Authorization header with the access token
http.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // Get the access token from localStorage

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data) {
      if (
        typeof config.data === "object" &&
        !(config.data instanceof FormData)
      ) {
        config.headers["Content-Type"] = "application/json";
      } else if (typeof config.data === "string") {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
    }

    if (
      config.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      config.data = qs.stringify(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 errors and refresh tokens
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken(); // Get refresh token from localStorage
      if (!refreshToken) {
        console.error("No refresh token available.");
        return Promise.reject(error);
      }

      try {
        const tokenResponse = await axios.post(
          `${baseURL}/api/users/djoser-auth/jwt/refresh/`,
          { refresh: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { access: newAccessToken } = tokenResponse.data;

        // Store new access token in localStorage
        let jwtTokenData = JSON.parse(localStorage.getItem("jwtAtom"));
        if (jwtTokenData && jwtTokenData.refresh) {
          jwtTokenData.access = newAccessToken;
          localStorage.setItem("jwtAtom", JSON.stringify(jwtTokenData));
        }

        // Decode the new access token and store expiration
        const decoded = jwtDecode(newAccessToken);
        localStorage.setItem("expAtom", JSON.stringify(decoded.exp * 1000)); // Store expiration in milliseconds

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        localStorage.removeItem("jwtAtom");
        localStorage.removeItem("expAtom");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API functions (Django/DRF)
const login = async (credentials) => {
  const response = await http.post("/api/users/auth/login/", credentials);
  return response.data;
};

const signup = async (userData) => {
  try {
    const response = await http.post("/api/users/auth/registration/", userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

const resendEmailConfirmation = async (data) => {
  try {
    const response = await http.post(
      "/api/users/auth/registration/resend-email/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
};

const logout = async (refreshToken) => {
  try {
    const response = await http.post("/api/users/auth/logout/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

const googleLogin = async (credential) => {
  const response = await http.post("/api/auth/social/google/", {
    access_token: credential,
  });
  return response.data;
};

const getUserProfile = async () => {
  const response = await http.get("/api/users/auth/user/");
  return response.data;
};

const deactivateUser = async (username) => {
  const response = await http.delete(`/api/users/deactivate/${username}/`);
  return response?.data;
};

// Fetch Cart Items
const fetchCart = async () => {
  try {
    const response = await http.get("/api/cart/");
    return response.data;
  } catch (error) {
    console.error("Fetch cart error:", error);
    throw error;
  }
};

// Add Item to Cart
const addToCart = async (serviceId) => {
  try {
    const response = await http.post("/api/cart/", { service_id: serviceId });
    return response.data;
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

// Remove Item from Cart
const removeFromCart = async (serviceId) => {
  try {
    const response = await http.delete(`/api/cart/${serviceId}/`);
    return response.data;
  } catch (error) {
    console.error("Remove from cart error:", error);
    throw error;
  }
};

// checkout
const checkoutCart = async () => {
  try {
    const response = await http.post("/api/orders/checkout/", {});
    console.log("Order successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Checkout failed:", error.response?.data || error.message);
    throw error;
  }
};

const fetchOrders = async () => {
  try {
    const response = await http.get("/api/orders/");
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Fetch orders failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchOrderById = async (id) => {
  try {
    const response = await http.get(`/api/orders/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Fetch order failed:", error.response?.data || error.message);
    throw error;
  }
};

const payOrder = async (orderId, paymentData) => {
  // paymentData should be { method: "card", reference_id: "txn_abc123" }
  try {
    const response = await http.post(`/api/orders/${orderId}/pay/`, paymentData);
    console.log(`Payment successful for Order ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Payment for Order ${orderId} failed:`, error.response?.data || error.message);
    throw error;
  }
};

// to update order status (for cancellation or other status changes)
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await http.patch(`/api/orders/${orderId}/update_status/`, { status: newStatus });
    console.log(`Order ${orderId} status updated to ${newStatus}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update status for Order ${orderId} to ${newStatus}:`, error.response?.data || error.message);
    throw error;
  }
};

// API Functions (Express)

const fetchServices = async (params) => {
  const { data } = await api.get("/api/services", { params });
  return data;
};


export {
  login,
  signup,
  getAccessToken,
  getRefreshToken,
  googleLogin,
  resendEmailConfirmation,
  logout,
  getUserProfile,
  deactivateUser,
  fetchCart,
  addToCart,
  removeFromCart,
  checkoutCart,
  fetchOrders,
  fetchOrderById,
  payOrder, 
  fetchServices,
  updateOrderStatus
};
