import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { restoreUser } from "../redux/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const storedAuth =
      localStorage.getItem("isAuthenticated") ||
      sessionStorage.getItem("isAuthenticated");

    if (storedUser && storedAuth === "true" && !isAuthenticated) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(
          restoreUser({
            user: userData,
            isAuthenticated: true,
            rememberMe: !!localStorage.getItem("user"), 
          })
        );
      } catch (error) {
        console.error("Failed to restore user session:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isAuthenticated");
      }
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
