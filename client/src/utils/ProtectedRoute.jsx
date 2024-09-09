import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const authToken = localStorage.getItem("authToken");

  // If no authToken, redirect to the home route or
  // If authToken exists, render the children route
  return !authToken ? <Navigate to="/sign-in" /> : <Outlet />;
}

export default ProtectedRoute;
