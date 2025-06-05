import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";

import { jwtAtom } from "../services/atoms";

const Signup = lazy(() => import("./Signup"));
const Login = lazy(() => import("./Login"));
const Account = lazy(() => import("./Account"));
const Home = lazy(() => import("./Home"));
const ServiceListPage = lazy(() => import("./ServiceListPage"));
const ServiceDetailPage = lazy(() => import("./ServiceDetailPage"));
const Cart = lazy(() => import("./Cart"));

const NotFound = lazy(() => import("./404"));

const RouterList = () => {
  const jwt = useAtomValue(jwtAtom);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/signup"
        element={jwt.access !== "" ? <Navigate to="/account" /> : <Signup />}
      />
      <Route
        path="/login"
        element={jwt.access !== "" ? <Navigate to="/account" /> : <Login />}
      />
      <Route
        path="/account"
        element={jwt.access !== "" ? <Account /> : <Navigate to="/login" />}
      />
      <Route path="/services" element={<ServiceListPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route
        path="/cart"
        element={jwt.access !== "" ? <Cart /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterList;
