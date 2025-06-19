import { useQuery } from "@tanstack/react-query";

import { userKeys, cartKeys, orderKeys, serviceKeys } from "./queryKeyFactory";
import {
  getUserProfile,
  fetchCart,
  fetchOrders,
  fetchOrderById,
  fetchServices,
} from "./http";
import { api } from "./http";

export const useUserProfile = (accessToken) => {
  return useQuery({
    queryKey: userKeys.detail("profile"), // fine as user profile is unique
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!accessToken,
  });
};

// Fetch all services (services are public/not user-specific)
export const useServices = () => {
  return useQuery({
    queryKey: serviceKeys.all,
    queryFn: async () => {
      const { data } = await api.get("/api/services");
      return data;
    },
  });
};

// Fetch service by ID (services are public/not user-specific)
export const useServiceById = (id) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/services/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Updated useCartFetch to also be user-specific
export const useCartFetch = (accessToken) => {
  return useQuery({
    // Use the accessToken as the userSessionIdentifier for cart data
    queryKey: cartKeys.detail(accessToken), // Then uses the user's access token
    queryFn: fetchCart,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!accessToken,
  });
};

export const useFetchOrders = (accessToken) => {
  return useQuery({
    // Pass the accessToken to the query key for unique user caching
    queryKey: orderKeys.list(accessToken),
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // Query is enabled only when an accessToken is present
    enabled: !!accessToken,
  });
};

export const useFetchOrderById = (id, accessToken) => {
  return useQuery({
    // Pass both the order ID and accessToken for unique user-specific order detail caching
    queryKey: orderKeys.detail(id, accessToken),
    queryFn: () => fetchOrderById(id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // Query is enabled only when an order ID and accessToken are present
    enabled: !!id && !!accessToken,
  });
};

// for fetching and filtering services
export const useServicesSearch = ({ category, industry, page }) => {
  const limit = 9; // Define limit internally or pass as an argument if dynamic

  return useQuery({
    queryKey: ["services", category, industry, page, limit], // Include limit in key if it's dynamic
    queryFn: () => fetchServices({ category, industry, page, limit }),
    keepPreviousData: true, // Retain previous data while fetching new data
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
