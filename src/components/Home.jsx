import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import InsightsIcon from "@mui/icons-material/Insights";
import EngineeringIcon from "@mui/icons-material/Engineering";

const services = [
  {
    title: "Financial Analysis",
    icon: <ShowChartIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    description:
      "Detailed assessments of financial health, resource efficiency, and growth potential using structured reporting and data models.",
  },
  {
    title: "Marketing Analytics",
    icon: <InsightsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    description:
      "Strategic analysis of customer behavior and campaign effectiveness to maximize engagement and ROI.",
  },
  {
    title: "Business Intelligence",
    icon: (
      <PrecisionManufacturingIcon
        sx={{ fontSize: 40, color: "primary.main" }}
      />
    ),
    description:
      "Real-time dashboards and automated insights engineered for operational clarity and data-backed decisions.",
  },
  {
    title: "Consulting Services",
    icon: <EngineeringIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    description:
      "Industry-specific consulting focused on SME scalability, cost optimization, and cross-sector strategy alignment.",
  },
];

const clients = [
  {
    title: "Retail Enterprises",
    description:
      "Support for high-volume retailers seeking margin optimization and market expansion via predictive analytics.",
  },
  {
    title: "E-commerce Platforms",
    description:
      "Behavioral insight tools and funnel analysis for platforms scaling in dynamic, competitive environments.",
  },
  {
    title: "Healthcare Networks",
    description:
      "BI solutions to manage patient flow, compliance data, and resource allocations in real time.",
  },
  {
    title: "Manufacturing Firms",
    description:
      "Production analytics, logistics optimization, and KPI systems designed for operational resilience.",
  },
];

const Home = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ pt: 8, pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 14,
          py: { xs: 8, md: 12 },
          px: 3,
          background: `linear-gradient(145deg, ${theme.palette.grey[900]}, ${theme.palette.grey[800]})`,
          borderRadius: 3,
          color: "white",
          boxShadow: 6,
        }}
      >
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          FinMark by Imperionite
        </Typography>
        <Typography
          variant="h6"
          sx={{ maxWidth: 720, mx: "auto", color: "grey.300" }}
        >
          Enterprise-grade financial and analytical services engineered for
          real-world business performance.
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ mt: 5, px: 5, py: 1.5, fontWeight: 600 }}
          component={Link}
          to="/services"
        >
          View Service Plans
        </Button>
      </Box>

      {/* Services Section */}
      <Box sx={{ mb: 14 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Core Services
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid
          container
          spacing={4}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2-column layout
            gridTemplateRows: "repeat(2, 1fr)", // 2-row layout
            gap: 4,
          }}
        >
          {services.map((service, index) => (
            <Grid item key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: "100%",
                  backgroundColor: "#f9fafb",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  borderTop: `3px solid ${theme.palette.primary.main}`,
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 64,
                    height: 64,
                    bgcolor: "primary.light",
                    borderRadius: "50%",
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Clients Section */}
      <Box sx={{ mb: 14 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sectors We Serve
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid
          container
          spacing={4}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2-column layout
            gridTemplateRows: "repeat(2, 1fr)", // 2-row layout
            gap: 4,
          }}
        >
          {clients.map((client, index) => (
            <Grid item key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {client.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          backgroundColor: "#f0f2f5",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Engineering Business Performance Through Data
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Connect with FinMark today to implement scalable, data-first
          solutions.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderWidth: 2,
            "&:hover": {
              backgroundColor: "primary.light",
              borderColor: "primary.main",
            },
          }}
          component={Link}
          to="/signup"
        >
          Let's Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
