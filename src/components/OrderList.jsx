import { lazy } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { useFetchOrders } from "../services/hooks";
import { jwtAtom } from "../services/atoms";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const Loader = lazy(() => import("./Loader"));

const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function OrderList() {
  const jwt = useAtomValue(jwtAtom);
  const { data: orders, isLoading, isError } = useFetchOrders(jwt.access);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <Typography
        color="error"
        align="center"
        sx={{ mt: 6, fontWeight: 600, fontSize: "1.2rem" }}
      >
        Failed to load orders.
      </Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          mb: 5,
          textAlign: "center",
          color: "text.primary",
        }}
      >
        Your Subscriptions
      </Typography>

      {orders?.length === 0 ? (
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No orders placed yet.
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 360, textAlign: "center" }}>
            Browse our products and start your subscription today!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {orders?.map((order) => {
            const total =
              order?.items?.reduce(
                (sum, item) => sum + Number(item?.price || 0),
                0
              ) || 0;

            const status = order.status.toLowerCase();

            // Map status to Chip color and label
            const statusColors = {
              completed: "success",
              pending: "warning",
              canceled: "error",
              refunded: "default",
            };

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    boxShadow:
                      "0 2px 6px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow:
                        "0 8px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, px: 3, py: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
                    >
                      Order #{order.id}
                    </Typography>
                    <Chip
                      label={`Status: ${order.status}`}
                      color={statusColors[status] || "default"}
                      variant="filled"
                      size="small"
                      sx={{ mb: 1, fontWeight: 600 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Items: {order.items?.length || 0} &bull; Total:{" "}
                      {formatter.format(total)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Button
                      component={Link}
                      to={`/orders/${order.id}`}
                      variant="contained"
                      size="medium"
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
