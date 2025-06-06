import { lazy } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@mui/material";
import { toast } from "react-hot-toast";
import { api } from "../services/http";
import { useUserProfile } from "../services/hooks";
import { addToCart } from "../services/http";
import { jwtAtom } from "../services/atoms";
import { cartKeys, serviceKeys, userKeys } from "../services/queryKeyFactory";

const fetchServices = async (params) => {
  const { data } = await api.get("/api/services", { params });
  return data;
};
const Loader = lazy(() => import("./Loader"));

export default function ServiceList() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const industry = searchParams.get("industry");
  const page = parseInt(searchParams.get("page") || "1");
  const jwt = useAtomValue(jwtAtom);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["services", category, industry, page], // Query key as an object/array
    queryFn: () => fetchServices({ category, industry, page, limit: 9 }),
    keepPreviousData: true, // to maintain data between page changes
  });

  const { data: profileData } = useUserProfile(jwt?.access);
  const userEmailVerified = profileData?.email_verified;

  // Mutation for adding to cart
  const { mutate: addItemToCart } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Service added to your cart!");
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error adding item to cart:", error);
    },
  });

  const handlePageChange = (_, value) => {
    searchParams.set("page", value);
    setSearchParams(searchParams);
  };

  // Helper to pick chip color based on label (optional)
  const getChipColor = (label) => {
    const colors = {
      "Financial Analysis": "primary",
      "Marketing Analytics": "secondary",
      "Business Intelligence": "success",
      "Consulting Services": "warning",
      Retail: "info",
      "E-commerce": "error",
      Healthcare: "success",
      Manufacturing: "secondary",
    };
    return colors[label] || "default";
  };

  const notifyToConfirm = () => {
    toast(
      <span>
        Confirm your email in <Link to={"/account"}>Account page</Link>
      </span>
    );
  };

  if (isLoading) return <Loader />;

  if (!isLoading && data?.data.length === 0) {
    toast.error("No services found matching your criteria.");
  }

  if (isError) toast.error("Failed to load services. Please try again later.");

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Service Catalog
      </Typography>

      {/* Filters UI could go here */}

      {/* Pagination Top */}
      {data?.totalPages > 1 && (
        <Paper
          elevation={1}
          sx={{ my: 3, p: 2, display: "flex", justifyContent: "center" }}
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
          />
        </Paper>
      )}

      {!isLoading && data?.data.length > 0 && (
        <Grid container spacing={3} aria-live="polite">
          {data.data.map((service) => (
            <Grid size={{ sm: 12, md: 6 }} key={service._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
                role="article"
                tabIndex={0}
                aria-label={`Service: ${service.name}`}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    noWrap
                    title={service.name}
                    component={Link}
                    to={`/services/${service._id}`}
                    sx={{ textDecoration: "none", color: "inherit" }}
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
                      WebkitLineClamp: 3,
                    }}
                    title={service.description}
                  >
                    {service.description}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ₱{service.price.toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                    <Chip
                      label={service.category}
                      size="small"
                      color={getChipColor(service.category)}
                      aria-label={`Category: ${service.category}`}
                    />
                    <Chip
                      label={service.industry}
                      size="small"
                      color={getChipColor(service.industry)}
                      aria-label={`Industry: ${service.industry}`}
                    />
                  </Stack>
                  {/* user subscribe to the service */}
                  <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                    {/* Check if the user is authenticated (has JWT) */}
                    {jwt?.access && (
                      // Check if the user's email is verified
                      <div>
                        {userEmailVerified ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => addItemToCart(service._id)} // Add to cart function
                          >
                            Subscribe
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={notifyToConfirm} // Notify the user to confirm their email
                          >
                            Subscribe
                          </Button>
                        )}
                      </div>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination Bottom */}
      {data?.totalPages > 1 && (
        <Paper
          elevation={1}
          sx={{ my: 3, p: 2, display: "flex", justifyContent: "center" }}
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
          />
        </Paper>
      )}
    </Box>
  );
}
