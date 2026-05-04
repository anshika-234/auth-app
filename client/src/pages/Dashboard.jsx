import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./page.css";
import Navbar from "./Navbar";
function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  return (
    <div className="dashboard-section">
      <Navbar />
      <h1>Hello , {user ? user?.userName : "User"}</h1>
    </div>
  );
}

export default Dashboard;
