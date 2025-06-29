import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <Container maxWidth="xl" sx={{ pt: 8, pb: 12 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We would love to hear from you! Feel free to reach out for any inquiries or collaboration opportunities.
        </Typography>
      </Box>

      {/* Contact Info Placeholder */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: "#f9fafb",
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Placeholder Contact Information
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            This is a placeholder page for the contact section. We will update this with a full contact form and details soon.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ px: 6, py: 2 }}
            component={Link}
            to="/about"
          >
            Learn More About Us
          </Button>
        </Paper>
      </Box>

      {/* Final CTA */}
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Stay Connected
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You can stay up to date by following us on social media or signing up for our newsletter.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 6, py: 2 }}
          component={Link}
          to="/signup"
        >
          Subscribe to Newsletter
        </Button>
      </Box>
    </Container>
  );
};

export default Contact;
