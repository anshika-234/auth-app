import React from "react";
import { useContext } from "react";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./pages/Navbar";
import Logout from "./pages/Logout";
import "./pages/page.css";
import { UserContext } from "./context/UserContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const { user, loading } = useContext(UserContext);
  const isAuthPage = location.pathname === "/dashboard";

  const isPublicRoute =
    ["/forgot-password", "/signup", "/login"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

  if (loading && !isPublicRoute) return null;

  return (
    <div className={isAuthPage ? "dashboard-bg" : "auth-bg"}>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
