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
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";

import { useCartFetch } from "../services/hooks";
import { removeFromCart } from "../services/http";
import { jwtAtom } from "../services/atoms";
import { cartKeys, serviceKeys } from "../services/queryKeyFactory";

const Loader = lazy(() => import("./Loader"));

export default function Cart() {
  const queryClient = useQueryClient();
  const jwt = useAtomValue(jwtAtom);
  const { data: cart, isLoading, isError } = useCartFetch(jwt?.access);

  // Mutation for adding to cart
  // Handle removing item from cart
  const { mutate: removeItemFromCart } = useMutation({
    mutationFn: removeFromCart, // Use the updated mutationFn syntax
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success("Service removed from your cart.");
    },
    onError: (error) => {
      toast.error("Error removing item from cart");
      console.error("Error removing item from cart:", error);
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return toast.error("Error loading cart!");

  console.log(cart.items);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart?.items.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <Grid container spacing={3}>
          {cart?.items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item?.service_name}</Typography>
                  <Typography variant="body2">₱{item?.price}</Typography>
                  <Typography variant="body2">{item.service_id}</Typography>
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
          component={Link}
          to="/checkout"
          size="large"
          disabled={cart?.items?.length === 0}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
}
