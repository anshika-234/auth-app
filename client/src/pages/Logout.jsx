import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Logout() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const hasRun = useRef(false); // 🔥 prevents double execution

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const logout = async () => {
      try {
        setLoading(true);

        await axios.post(
          `${API}/api/v1/auth/logout`,
          {},
          { withCredentials: true },
        );

        setUser(null);
        toast.success("You logged out successfully");

        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Logout failed");
      } finally {
        setLoading(false);
      }
    };

    logout();
  }, []);

  return null;
}

export default Logout;
