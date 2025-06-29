import { lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { Box, CircularProgress, Typography } from "@mui/material";

import { jwtAtom } from "../services/atoms";

// Lazy-loaded pages (keeping your existing structure)
const Signup = lazy(() => import("./Signup"));
const Login = lazy(() => import("./Login"));
const Account = lazy(() => import("./Account"));
const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const ServiceListPage = lazy(() => import("./ServiceListPage"));
const ServiceDetail = lazy(() => import("./ServiceDetail"));
const Cart = lazy(() => import("./Cart"));
const OrderList = lazy(() => import("./OrderList"));
const OrderDetail = lazy(() => import("./OrderDetail"));
const NotFound = lazy(() => import("./404"));

const Loader = lazy(() => import("./Loader"));

// --- PrivateRoute Component ---
const PrivateRoute = ({ children }) => {
  const jwt = useAtomValue(jwtAtom);
  const [isAttemptingRehydration, setIsAttemptingRehydration] = useState(true);

  useEffect(() => {
    // This effect runs once on mount to handle Jotai's state rehydration from localStorage.
    // jwt !== undefined: Indicates Jotai has read its initial value (even if it's null).
    // localStorage.getItem('jwtAtom'): Fallback check if Jotai's atom hasn't fully updated yet,
    // but we know data exists in storage.
    const storedJwt = localStorage.getItem("jwtAtom");

    if (jwt !== undefined || storedJwt) {
      setIsAttemptingRehydration(false);
    } else {
      // Small timeout as a safeguard for very quick loads where the atom's state
      // might not immediately transition from `undefined`.
      const timer = setTimeout(() => {
        setIsAttemptingRehydration(false);
      }, 300); // Give Jotai 300ms to rehydrate
      return () => clearTimeout(timer);
    }
  }, [jwt]); // Dependency on jwt ensures this effect reacts when jwt changes from undefined to a value

  if (isAttemptingRehydration) {
    // Show a loading indicator while trying to rehydrate authentication state
    return <Loader />;
  }

  // Once rehydration is attempted/complete, apply the actual authentication check
  return jwt?.access ? children : <Navigate to="/login" replace />;
};

// --- GuestRoute Component ---
const GuestRoute = ({ children }) => {
  const jwt = useAtomValue(jwtAtom);
  const [isAttemptingRehydration, setIsAttemptingRehydration] = useState(true);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwtAtom");
    if (jwt !== undefined || storedJwt) {
      setIsAttemptingRehydration(false);
    } else {
      const timer = setTimeout(() => {
        setIsAttemptingRehydration(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [jwt]);

  if (isAttemptingRehydration) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading authentication...</Typography>
      </Box>
    );
  }

  return jwt?.access ? <Navigate to="/account" replace /> : children;
};

// --- RouterList Component ---
const RouterList = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<ServiceListPage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />

        {/* Guest-only routes */}
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderList />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default RouterList;
