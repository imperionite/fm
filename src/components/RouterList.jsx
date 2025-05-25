import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";

import { jwtAtom } from "../services/atoms";

const Signup = lazy(() => import("./Signup"));
const Login = lazy(() => import("./Login"));
const Account = lazy(() => import("./Account"));
const Home = lazy(() => import("./Home"));
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterList;
