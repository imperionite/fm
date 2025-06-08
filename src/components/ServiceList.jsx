import { lazy } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Pagination,
  Paper,
  Button,
  Container, // Import Container for consistent page width
  CircularProgress, // Import CircularProgress for loading indicator
} from "@mui/material";
import { toast } from "react-hot-toast";
import { addToCart } from "../services/http";
import { jwtAtom } from "../services/atoms";
import { cartKeys } from "../services/queryKeyFactory";
import { useServicesSearch } from "../services/hooks";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined"; // Example icon

const Loader = lazy(() => import("./Loader"));

export default function ServiceList() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const industry = searchParams.get("industry");
  const page = parseInt(searchParams.get("page") || "1");
  const jwt = useAtomValue(jwtAtom);

  const { data, isLoading, isError } = useServicesSearch({
    category,
    industry,
    page,
  });

  // Mutation for adding to cart
  const { mutate: addItemToCart, isPending: isAddingToCart } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Service added to your cart!");
      // Invalidate specific cart key to ensure refetch for the current user
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(jwt?.access) });
    },
    onError: (error) => {
      console.error(
        "Error adding item to cart:",
        error.response || error.message || error
      );
      // Display a more specific error message if available from the backend
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to add service to cart.";
      toast.error(errorMessage);
    },
  });

  const handlePageChange = (_, value) => {
    searchParams.set("page", value);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getChipColor = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("financial")) return "primary";
    if (lowerLabel.includes("marketing")) return "secondary";
    if (lowerLabel.includes("business intelligence")) return "info";
    if (lowerLabel.includes("consulting")) return "warning";
    if (lowerLabel.includes("retail")) return "success";
    if (lowerLabel.includes("e-commerce")) return "error";
    if (lowerLabel.includes("healthcare")) return "success";
    if (lowerLabel.includes("manufacturing")) return "secondary";
    return "default";
  };

  if (isLoading) return <Loader />;

  if (!isLoading && data?.data.length === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No services found matching your criteria.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Try adjusting your filters or browsing other categories.
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error">
          Failed to load services. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 4, md: 8 }, bgcolor: "background.default" }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 4, md: 6 },
          py: { xs: 2, md: 3 },
          px: { xs: 1, md: 0 },
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          borderRadius: 2,
          boxShadow: 3,
          color: "white",
          letterSpacing: 1.5,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Our Service Catalog
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
          Discover the perfect solutions for your business needs.
        </Typography>
      </Box>

      {data?.totalPages > 1 && (
        <Paper
          elevation={3}
          sx={{
            my: { xs: 2, md: 4 },
            p: { xs: 1, md: 2 },
            display: "flex",
            justifyContent: "center",
            borderRadius: 2,
            background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
          }}
          role="navigation"
          aria-label="Pagination Navigation"
        >
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            aria-label="Service list pagination"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "primary.main",
                fontWeight: 600,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  bgcolor: "primary.light",
                  color: "white",
                },
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              },
            }}
          />
        </Paper>
      )}

      {!isLoading && data?.data.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 4 }} aria-live="polite">
          {data.data.map((service) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition:
                    "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: 10,
                    background:
                      "linear-gradient(135deg, #ffffff 70%, #e0e7ff 100%)",
                  },
                  p: { xs: 1, md: 2 },
                  bgcolor: "white",
                }}
                role="article"
                tabIndex={0}
                aria-label={`Service: ${service.name}`}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box sx={{ mb: 2, color: "primary.main" }}>
                    <BusinessCenterOutlinedIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    noWrap
                    title={service.name}
                    component={Link}
                    to={`/services/${service._id}`}
                    sx={{
                      textDecoration: "none",
                      color: "primary.dark",
                      fontWeight: 600,
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {service.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 4,
                      minHeight: "4.8em",
                      lineHeight: "1.2em",
                    }}
                    title={service.description}
                  >
                    {service.description}
                  </Typography>
                  <Box mt={3} sx={{ flexGrow: 1 }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="secondary.main"
                    sx={{ mt: 2 }}
                  >
                    ₱{service.price.toLocaleString()}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                    <Chip
                      label={service.category}
                      size="small"
                      color={getChipColor(service.category)}
                      variant="filled"
                      sx={{ fontWeight: 500, px: 0.5 }}
                      aria-label={`Category: ${service.category}`}
                    />
                    <Chip
                      label={service.industry}
                      size="small"
                      color={getChipColor(service.industry)}
                      variant="filled"
                      sx={{ fontWeight: 500, px: 0.5 }}
                      aria-label={`Industry: ${service.industry}`}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} mt={3} flexWrap="wrap">
                    {jwt?.access && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => addItemToCart(service._id)}
                        disabled={isAddingToCart}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          py: 1.2,
                          px: 3,
                          boxShadow: 3,
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 6,
                          },
                          "& .MuiButton-startIcon": { mr: 1 },
                        }}
                      >
                        {isAddingToCart ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Subscribe"
                        )}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {data?.totalPages > 1 && (
        <Paper
          elevation={3}
          sx={{
            my: { xs: 2, md: 4 },
            p: { xs: 1, md: 2 },
            display: "flex",
            justifyContent: "center",
            borderRadius: 2,
            background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
          }}
          role="navigation"
          aria-label="Pagination Navigation"
        >
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            aria-label="Service list pagination"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "primary.main",
                fontWeight: 600,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  bgcolor: "primary.light",
                  color: "white",
                },
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              },
            }}
          />
        </Paper>
      )}
    </Container>
  );
}
