import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL || "";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/v1/auth/forget-password`,
        { email },
        {
          withCredentials: true,
        },
      );
      if (res.data.resetToken) {
        navigate(`/reset-password/${res.data.resetToken}`);
      } else {
        toast.success("Check your email for reset link");
      }
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required..";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <div className="form-wrapper">
      <div className="form-section">
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div>
            <input
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              className={`form-control mt-2 ${errors.email ? "is-invalid" : ""}`}
            />
          </div>
          <button className="btn mt-4" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
