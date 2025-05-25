import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiRoot } from "jotai";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App.jsx";
import theme from "./theme";
import "./styles/_index.scss";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

const Loader = lazy(() => import("./components/Loader.jsx"));

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

root.render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <JotaiRoot>
          <BrowserRouter>
            <GoogleOAuthProvider clientId={googleClientId}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
              </ThemeProvider>
            </GoogleOAuthProvider>
          </BrowserRouter>
        </JotaiRoot>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
