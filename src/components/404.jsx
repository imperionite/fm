import { Link, useLocation } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const location = useLocation();

  return (
    <Container maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
      <Box sx={{ mb: 4 }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
      </Box>

      <Typography
        variant="h2"
        fontWeight="bold"
        gutterBottom
        color="error.main"
      >
        404
      </Typography>

      <Typography variant="h5" gutterBottom>
        Oops! Page not found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The route <strong>{location.pathname}</strong> does not exist. Please
        check the URL or return to the homepage.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        color="primary"
      >
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
