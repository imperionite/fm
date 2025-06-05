import { useQuery } from "@tanstack/react-query";

import { userKeys, cartKeys } from "./queryKeyFactory";
import { getUserProfile, fetchCart } from "./http";
import { api } from "./http";

export const useUserProfile = (accessToken) => {
  return useQuery({
    queryKey: userKeys.detail("profile"), // defined related key for invallidate or caching
    queryFn: getUserProfile, // your async function that fetches user profile
    // enabled, // enables data fetching on condition
    staleTime: 5 * 60 * 1000, // optional: cache data for 5 minutes
    retry: 1, // optional: retry once on failure
    enabled: !!accessToken, // enable only if auth accessToken is truthy
  });
};

// Fetch all services
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await api.get("/api/services");
      return data;
    },
  });
};

// Fetch service by ID
export const useServiceById = (id) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/services/${id}`);
      return data;
    },
    enabled: !!id, // only run if ID exists
  });
};

export const useCartFetch = (accessToken) => {
  return useQuery({
    queryKey: cartKeys.detail("userCart"), // defined related key for invallidate or caching
    queryFn: fetchCart, // your async function that fetches user profile
    // enabled, // enables data fetching on condition
    staleTime: 5 * 60 * 1000, // optional: cache data for 5 minutes
    retry: 1, // optional: retry once on failure
    enabled: !!accessToken, // enable only if auth accessToken is truthy
  });
};
