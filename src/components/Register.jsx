import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import authService from "../services/authService";
import "./CSS/Register.css"

const Register = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.first_name ||
      !formData.last_name
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1 className="register-title">Create an Account</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-grid">
            <div>
              <label htmlFor="firstName" className="input-label">
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="input-label">
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>


          <div className="input-grid">
            <div>
              <label htmlFor="password" className="input-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="footer">
          <p className="footer-text">
            Already have an account?{" "}
            <Link to="/login" className="footer-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
