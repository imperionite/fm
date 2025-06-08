import { lazy } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";

import { useCartFetch } from "../services/hooks";
import { removeFromCart, checkoutCart } from "../services/http";
import { jwtAtom } from "../services/atoms";
import { cartKeys, serviceKeys } from "../services/queryKeyFactory";

const Loader = lazy(() => import("./Loader"));

export default function Cart() {
  const queryClient = useQueryClient();
  const jwt = useAtomValue(jwtAtom);
  const navigate = useNavigate();
  // IMPORTANT: Destructure `refetch` from useCartFetch
  const { data: cart, isLoading, isError, refetch } = useCartFetch(jwt?.access);

  // Handle removing item from cart
  const { mutate: removeItemFromCart } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      await refetch(); // Explicitly refetch the cart data
      toast.success("Service removed from your cart.");
    },
    onError: (error) => {
      toast.error("Error removing item from cart");
      console.error("Error removing item from cart:", error);
    },
  });

  // Mutation for checkout
  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: checkoutCart,
    onSuccess: async (data) => {
      // Remove the specific cart query from cache after checkout
      queryClient.removeQueries({ queryKey: cartKeys.detail(jwt?.access) });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      await refetch(); // Explicitly refetch the cart data
      //
      toast.success("Order placed successfully!");
      navigate(`/orders/${data.id}`); // Navigate after all cache updates and refetch
      //console.log(data);
    },
    onError: (error) => {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return toast.error("Error loading cart!");

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {/* Ensure that 'cart' is not null or undefined before accessing 'items' */}
      {cart && cart.items && cart.items.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <Grid container spacing={3}>
          {cart?.items?.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item?.service_name}</Typography>
                  <Typography variant="body2">₱{item?.price}</Typography>
                  <Typography variant="body2">{item?.service_id}</Typography>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => removeItemFromCart(item?.service_id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={3}>
        <Button
          variant="contained"
          size="large"
          disabled={cart?.items?.length === 0 || isCheckingOut}
          onClick={() => checkout()}
        >
          {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </Box>
    </Box>
  );
}
