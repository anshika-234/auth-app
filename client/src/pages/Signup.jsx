import "./page.css";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const API = import.meta.env.VITE_API_URL || "";

function Signup() {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { confirmPassword, ...dataToSend } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/api/v1/auth/signup`,
        dataToSend,
        {
          withCredentials: true,
        },
      );
      setUser(response.data.user);
      toast.success("Signup Successfull");
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required..";
    }
    if (!formData.email) {
      newErrors.email = "Email is required..";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters..";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password do not match..";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="form-wrapper">
      <div className="form-section">
        <h1 className="mt-2 text-center">Signup Form</h1>
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
              className={`form-control  ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              id="name"
              name="userName" // Fixed: matches state
              type="text"
              placeholder="Please enter your name"
              onChange={handleChange}
              value={formData.userName}
              className={`form-control ${errors.userName ? "is-invalid" : ""}`}
            />
            {errors.userName && (
              <div className="invalid-feedback">{errors.userName}</div>
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
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password:
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Please confirm your password"
              onChange={handleChange}
              value={formData.confirmPassword}
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
          <div className="mt-4">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "SignUp"}
            </button>
            <div className="account-exists">
              <p>Already have an Account</p>
              <Link to="/login">Log in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
