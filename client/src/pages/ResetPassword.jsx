import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

function ResetPassword() {
  let { token } = useParams();
  const { setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API}/api/v1/auth/reset-password/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
        },
      );
      toast.success("Password changed successfully..");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    setPassword("");
    setConfirmPassword("");
  };

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required..";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "confirm password is required..";
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
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className={`form-control mt-2 ${errors.password ? "is-invalid" : ""}`}
            />
          </div>
          <div>
            <input
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className={`form-control mt-2 ${errors.confirmPasswordpassword ? "is-invalid" : ""}`}
            />
          </div>
          <button type="submit" className="btn mt-4" disabled={loading}>
            {loading ? "Saving" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
