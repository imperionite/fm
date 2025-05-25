import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const Home = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ bgcolor: "#cfe8fc" }}>
        <header>
          <h1>Welcome to Marmite</h1>
        </header>

        <section>
          <h2>Introduction</h2>
          <p>
            This is a proof-of-concept webpage design to augment and test the
            connectly-api backend REST API project at{" "}
            <a href="https://github.com/imperionite/marmite">
              {" "}
              https://github.com/imperionite/marmite
            </a>
            .
          </p>
        </section>
      </Box>
    </Container>
  );
};

export default Home;
