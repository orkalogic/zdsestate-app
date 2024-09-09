import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authTokenSignal } from "../store/store";

function ProtectedRoute() {
  // If no authToken, redirect to the home route or
  // If authToken exists, render the children route
  return !authTokenSignal ? <Navigate to="/sign-in" /> : <Outlet />;
}

export default ProtectedRoute;
