export const userKeys = {
  all: ["users"],
  detail: (id) => [...userKeys.all, "detail", id],
};

export const cartKeys = {
  all: ["cart"],
  // Consider making this user-specific as well if multiple users might use the same client
  detail: (userSessionIdentifier) => [
    ...cartKeys.all,
    "detail",
    userSessionIdentifier,
  ],
};

export const serviceKeys = {
  all: ["services"],
  detail: (id) => [...serviceKeys.all, "detail", id],
};

export const orderKeys = {
  // IMPORTANT: Add userSessionIdentifier to the query key for the list of orders.
  // This ensures TanStack Query caches orders separately for each authenticated user.
  list: (userSessionIdentifier) => ["orders", "list", userSessionIdentifier],
  // IMPORTANT: Also add userSessionIdentifier to the query key for a single order detail.
  // This prevents potential cache collisions and ensures data integrity if order IDs
  // could theoretically overlap across different users (though less likely in your setup, it's good practice).
  detail: (orderId, userSessionIdentifier) => [
    "orders",
    "detail",
    orderId,
    userSessionIdentifier,
  ],
};
