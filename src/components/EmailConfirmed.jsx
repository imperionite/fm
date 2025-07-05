import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

export default function EmailConfirmed() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login"); // Or "/account" if auto-login is handled
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 64 }}
            aria-hidden="true"
          />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            aria-label="Email Verified"
          >
            Email Successfully Verified
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your email has been confirmed. You can now access your account and
            start using all features.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGoToLogin}
            sx={{ mt: 2 }}
            aria-label="Go to login"
          >
            Go to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
