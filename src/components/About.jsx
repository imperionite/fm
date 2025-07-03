import { Box, Container, Typography, Grid, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Container maxWidth="xl" sx={{ pt: 8, pb: 12 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          About FinMark
        </Typography>
        <Typography variant="h6" color="text.secondary">
          This is the project documentation for FinMark by Imperionite, a modern
          enterprise-grade analytics platform.
        </Typography>
      </Box>

      {/* Sections */}
      <Grid container spacing={4}>
        {/* Project Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "#f9fafb",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Project Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              FinMark is a data-driven platform designed to optimize business
              performance by providing insights into financial and operational
              data. With powerful dashboards, analytical tools, and real-time
              data updates, it serves enterprise businesses looking for
              actionable insights.
            </Typography>
          </Paper>
        </Grid>

        {/* Tech Stack */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "#f9fafb",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Tech Stack
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The platform is built using a combination of modern technologies
              such as React.js, Django/DRF, PostgreSQL, Node.js, Express, Redis,
              MongoDB and React.js. We use Material-UI for UI components and
              TailwindCSS for utility-first styling to ensure the platform is
              both functional and visually pleasing.
            </Typography>
          </Paper>
        </Grid>

        {/* Features */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "#f9fafb",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Key Features
            </Typography>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              <li>
                <strong>Real-Time Dashboards:</strong> Interactive dashboards
                with real-time data updates.
              </li>
              <li>
                <strong>Custom Analytics:</strong> Tailored reports and insights
                based on the business model.
              </li>
              <li>
                <strong>Data Security:</strong> Ensured security for sensitive
                financial data.
              </li>
              <li>
                <strong>Integration Ready:</strong> Easily integrates with
                external APIs and platforms.
              </li>
            </ul>
          </Paper>
        </Grid>

        {/* Project Architecture */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "#f9fafb",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Project Architecture: Microservices-Style Modular Architecture
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              The project follows a{" "}
              <strong>microservices-style modular architecture</strong>, where
              each service is designed to handle a specific business capability,
              with independent deployment and scalability. This modular approach
              enables the application to be more maintainable, fault-tolerant,
              and easier to scale.
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              Key benefits of this architecture include:
            </Typography>

            <Box
              component="ul"
              className="list-disc ml-5 space-y-2 text-gray-700"
            >
              <li>
                <strong>Decoupled Services:</strong> Each microservice operates
                independently, reducing interdependencies and allowing for
                easier updates or scaling.
              </li>
              <li>
                <strong>Improved Scalability:</strong> Services can be scaled
                independently based on the needs of the business, ensuring
                better resource utilization.
              </li>
              <li>
                <strong>Resilience & Fault Tolerance:</strong> If one service
                fails, the others can continue to function, ensuring high
                availability.
              </li>
              <li>
                <strong>Technology Agnostic:</strong> Different services can be
                built using different technologies, allowing for more
                flexibility in choosing the right tool for each job.
              </li>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* CTA Button */}
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 6, py: 2 }}
          component={Link}
          to="/contact"
        >
          Get In Touch
        </Button>
      </Box>
    </Container>
  );
};

export default About;
