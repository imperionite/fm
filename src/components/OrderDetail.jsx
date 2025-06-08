import { lazy, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  List,
  Paper,
  Grid,
  Divider,
  Container,
  Button,
  ButtonGroup,
  CircularProgress,
  Chip,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { useFetchOrderById } from "../services/hooks";
import { payOrder, updateOrderStatus } from "../services/http";
import { jwtAtom } from "../services/atoms";
import { orderKeys } from "../services/queryKeyFactory";

const Loader = lazy(() => import("./Loader"));

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function OrderDetail() {
  const jwt = useAtomValue(jwtAtom);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useFetchOrderById(id, jwt.access);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const { mutate: processPayment, isPending: isProcessingPayment } =
    useMutation({
      mutationFn: ({ orderId, paymentData }) => payOrder(orderId, paymentData),
      onSuccess: (updatedOrder) => {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        queryClient.invalidateQueries({
          queryKey: orderKeys.list(jwt?.access),
        });
        toast.success(
          `Payment successful for Order #${updatedOrder.id}! Status: ${updatedOrder.status}.`
        );
        setShowPaymentOptions(false);
        setPaymentMethod("");
      },
      onError: (paymentError) => {
        console.error("Payment failed:", paymentError);
        toast.error(
          `Payment failed: ${
            paymentError.message || "An unknown error occurred."
          }`
        );
      },
    });

  // Mutation for cancelling an order
  const { mutate: cancelOrder, isPending: isCancellingOrder } = useMutation({
    mutationFn: (orderIdToCancel) =>
      updateOrderStatus(orderIdToCancel, "cancelled"),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.list(jwt?.access) });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success(`Order #${updatedOrder.id} successfully cancelled.`);
      navigate("/orders");
    },
    onError: (cancelError) => {
      console.error("Order cancellation failed:", cancelError);
      toast.error(
        `Cancellation failed: ${
          cancelError.response?.data?.detail ||
          cancelError.message ||
          "An unknown error occurred."
        }`
      );
    },
  });

  const handlePayClick = () => {
    setShowPaymentOptions(true);
  };

  const handleProcessPayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (!order) {
      toast.error("Order details are not available. Please try again.");
      return;
    }

    const reference_id = `sim_${paymentMethod}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    processPayment({
      orderId: order.id,
      paymentData: {
        method: paymentMethod,
        reference_id: reference_id,
      },
    });
  };

  const handleCancelOrder = () => {
    if (
      order &&
      window.confirm("Are you sure you want to cancel this order?")
    ) {
      cancelOrder(order.id);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Order Details...</Typography>
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Failed to load order. {error?.message || ""}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/orders")}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  const { id: orderId, ordered_at, status, items, total_price } = order;

  const statusColors = {
    completed: "success",
    pending: "warning",
    paid: "primary",
    confirmed: "info",
    cancelled: "error", // Use error color for cancelled
    refunded: "default",
  };
  const currentStatusColor = statusColors[status.toLowerCase()] || "default";

  // Determine if the "Cancel Order" button should be shown
  const showCancelButton = ["pending", "confirmed"].includes(
    status.toLowerCase()
  );

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "700", letterSpacing: 1, mb: 3, textAlign: "center" }}
      >
        Order #{orderId}
      </Typography>

      <Typography
        variant="subtitle2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        Placed on: {new Date(ordered_at).toLocaleString()}
      </Typography>

      <Chip
        label={`Status: ${status}`}
        color={currentStatusColor}
        variant="filled"
        size="large"
        sx={{
          mb: 3,
          fontWeight: 600,
          display: "block",
          maxWidth: "fit-content",
          mx: "auto",
        }}
      />

      <Divider sx={{ mb: 4 }} />

      <Typography
        variant="h6"
        sx={{
          fontWeight: "600",
          mb: 2,
          letterSpacing: 0.5,
          color: "text.primary",
        }}
      >
        Ordered Services
      </Typography>

      <List disablePadding>
        {items.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ my: 1, p: 2, borderRadius: 2, backgroundColor: "#fafafa" }}
          >
            <Typography>No services in this order.</Typography>
          </Paper>
        ) : (
          items.map((item, index) => (
            <Paper
              key={item.service_id || index}
              elevation={1}
              sx={{
                my: 1,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#fafafa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 500,
                color: "text.primary",
                transition: "background-color 0.2s ease",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <Typography noWrap>{item.service_name}</Typography>
              <Typography sx={{ fontWeight: "700", color: "primary.main" }}>
                {currencyFormatter.format(Number(item.price))}
              </Typography>
            </Paper>
          ))
        )}
      </List>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "700" }}>
          Order Total
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "700", color: "primary.main" }}
        >
          {currencyFormatter.format(Number(total_price))}
        </Typography>
      </Box>

      {/* Payment Section */}
      {order.status === "confirmed" && (
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {!showPaymentOptions && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePayClick}
              disabled={isProcessingPayment}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Pay Now
            </Button>
          )}

          {showPaymentOptions && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Select Payment Method:
              </Typography>
              <ButtonGroup
                fullWidth
                variant="outlined"
                aria-label="payment method selection"
                sx={{ mb: 2 }}
              >
                {["maya", "card", "paypal"].map((method) => (
                  <Button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    disabled={isProcessingPayment}
                    sx={{
                      py: 1.5,
                      borderColor:
                        paymentMethod === method ? "primary.main" : undefined,
                      backgroundColor:
                        paymentMethod === method ? "primary.light" : undefined,
                      color:
                        paymentMethod === method
                          ? "primary.contrastText"
                          : "text.primary",
                      "&:hover": {
                        backgroundColor:
                          paymentMethod === method
                            ? "primary.dark"
                            : "action.hover",
                      },
                    }}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </Button>
                ))}
              </ButtonGroup>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleProcessPayment}
                disabled={!paymentMethod || isProcessingPayment}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {isProcessingPayment ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Confirm Payment with ${
                    paymentMethod.charAt(0).toUpperCase() +
                    paymentMethod.slice(1)
                  }`
                )}
              </Button>
            </Paper>
          )}
        </Box>
      )}

      {order.status === "paid" && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            bgcolor: "success.light",
            color: "success.contrastText",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            This order has been successfully paid!
          </Typography>
          <Typography variant="body2">Thank you for your payment.</Typography>
        </Box>
      )}

      {/* NEW: Cancel Order Button */}
      {showCancelButton && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="outlined"
            color="error" // Use error color for cancellation
            size="large"
            onClick={handleCancelOrder}
            disabled={isCancellingOrder || isProcessingPayment} // Disable if already cancelling or paying
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            {isCancellingOrder ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cancel Order"
            )}
          </Button>
        </Box>
      )}

      {order.status !== "confirmed" &&
        order.status !== "paid" &&
        order.status !== "cancelled" && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              bgcolor: "warning.light",
              color: "warning.contrastText",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Order status is "{order.status}".
            </Typography>
            <Typography variant="body2">
              Payment options are available for "confirmed" orders.
            </Typography>
          </Box>
        )}

      {order.status === "cancelled" && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            bgcolor: "error.light",
            color: "error.contrastText",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            This order has been cancelled.
          </Typography>
          <Typography variant="body2">
            No further actions are allowed for cancelled orders.
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button variant="outlined" onClick={() => navigate("/orders")}>
          Back to All Orders
        </Button>
      </Box>
    </Container>
  );
}
