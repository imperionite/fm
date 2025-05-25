import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./queryKeyFactory";
import { getUserProfile } from "./http";

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
