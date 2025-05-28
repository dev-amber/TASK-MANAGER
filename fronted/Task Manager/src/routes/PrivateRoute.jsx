import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";  // Fixed typo: "NavigaTe" -> "NavigaTe"
import { UserContext } from "../context/userContext";  // Adjusted import path

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);

  // If user isn't logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified but user's role isn't included
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default PrivateRoute;