import "./page.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const API = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/v1/auth/login`, formData, {
        withCredentials: true,
      });
      toast.success("Login successfull");
      navigate("/dashboard");
      setUser({
        userName: response.data.user.userName,
        email: response.data.user.email,
      });
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required..";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required..";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="form-wrapper">
      <div className="form-section">
        <h1 className="my-4 text-center">Login Form</h1>
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="mb-2">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="abcd@gmail.com"
              onChange={handleChange}
              value={formData.email}
              className={`form-control mt-2 ${
                errors.email ? "is-invalid" : ""
              }`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleChange}
              value={formData.password}
              className={`form-control mt-2 ${
                errors.password ? "is-invalid" : ""
              }`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="mt-4">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="account-exists">
              <p>Don't have an Account</p>
              <Link to="/signup">Signup</Link>
            </div>
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
