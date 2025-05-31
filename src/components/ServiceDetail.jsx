import { useParams, useNavigate } from "react-router-dom";
import { useServiceById } from "../services/hooks";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Breadcrumbs,
  Link as MUILink,
  Button,
  Container,
} from "@mui/material";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const { data, isLoading, isError } = useServiceById(id);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Service not found</Alert>;

  return (
    <Container maxWidth="md">
      <Box p={3}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MUILink
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Home
          </MUILink>
          <MUILink
            underline="hover"
            color="inherit"
            onClick={() => navigate("/services")}
            sx={{ cursor: "pointer" }}
          >
            Services
          </MUILink>
          <Typography color="text.primary">{data.name}</Typography>
        </Breadcrumbs>

        {/* Title */}
        <Typography variant="h4" gutterBottom>
          {data.name}
        </Typography>

        {/* Tags */}
        <Stack direction="row" spacing={1} mb={2}>
          <Chip
            label={data.category}
            size="small"
            color={getChipColor(data.category)}
            aria-label={`Category: ${data.category}`}
          />
          <Chip
            label={data.industry}
            size="small"
            color={getChipColor(data.industry)}
            aria-label={`Industry: ${data.industry}`}
          />
        </Stack>

        {/* Description */}
        <Typography variant="body1" mb={3}>
          {data.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" color="text.secondary">
          Estimated Duration:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {data.duration_hours} hour(s)
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Price:
        </Typography>
        <Typography variant="h5" color="primary">
          ₱{data.price.toLocaleString()}
        </Typography>

        {data.tags?.length > 0 && (
          <>
            <Typography variant="subtitle1" mt={3}>
              Tags:
            </Typography>
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              {data.tags.map((tag, i) => (
                <Chip key={i} label={tag} variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        {/* Back to List Button */}
        <Box mt={4}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            ← Back to List
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
