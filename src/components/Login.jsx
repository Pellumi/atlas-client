import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import authService from "../services/authService";
import "./CSS/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectTo = localStorage.getItem("redirectAfterLogin") || "/chat";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({
        email: email,
        password: password,
      });

      // Store token and user info in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
      localStorage.removeItem("redirectAfterLogin");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">UniHealth</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Email
            </label>
            <input
              type="text"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="footer">
          <p className="footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="footer-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
