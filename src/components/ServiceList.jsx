import { lazy } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/material";
import { toast } from "react-hot-toast";
import { api } from "../services/http";

const fetchServices = async (params) => {
  const { data } = await api.get("/api/services", { params });
  return data;
};
const Loader = lazy(() => import("./Loader"));

export default function ServiceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const industry = searchParams.get("industry");
  const page = parseInt(searchParams.get("page") || "1");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["services", category, industry, page],
    queryFn: () => fetchServices({ category, industry, page, limit: 9 }),
    keepPreviousData: true,
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

  if (isLoading) return <Loader />;

  if (!isLoading && data?.data.length === 0) {
    toast.info("No services found matching your criteria.");
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
            <Grid item xs={12} sm={6} md={4} key={service._id}>
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
