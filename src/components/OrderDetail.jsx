import { lazy } from "react";
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import {
  Box,
  Typography,
  List,
  Paper,
  Grid,
  Divider,
  Container,
} from "@mui/material";

import { useFetchOrderById } from "../services/hooks";
import { jwtAtom } from "../services/atoms";

const Loader = lazy(() => import("./Loader"));

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function OrderDetail() {
  const jwt = useAtomValue(jwtAtom);
  const { id } = useParams();
  const { data: order, isLoading, isError } = useFetchOrderById(id, jwt.access);

  if (isLoading) return <Loader />;
  if (isError || !order)
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Failed to load order.
      </Typography>
    );

  const { id: orderId, user, ordered_at, status, items, total_price } = order;

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

      <Typography
        variant="body1"
        sx={{
          mb: 3,
          textAlign: "center",
          fontWeight: "600",
          color:
            status.toLowerCase() === "completed"
              ? "success.main"
              : status.toLowerCase() === "pending"
              ? "warning.main"
              : "text.secondary",
        }}
      >
        Status: {status}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Typography
        variant="h6"
        sx={{ fontWeight: "600", mb: 2, letterSpacing: 0.5, color: "text.primary" }}
      >
        Ordered Services
      </Typography>

      <List disablePadding>
        {items.map((item, index) => (
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
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "700" }}>
          Order Summary
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "700", color: "primary.main" }}>
          {currencyFormatter.format(Number(total_price))}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mt: 2, fontStyle: "italic" }}
      >
        User ID: {user}
      </Typography>
    </Container>
  );
}
