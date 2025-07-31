// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import auth from "./authservice";
import http from "./httpService";
import "./css/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await http.post("/login", {
        user,
        password,
      });
      console.log(response);
      auth.storeUser(response.data.user);
      window.dispatchEvent(new Event("userChanged"));
      auth.storeToken(response.data.token);
      navigate("/books");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };
  const us = auth.getUser();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await http.post("/google-login", {
        token: credentialResponse.credential,
      });
      auth.storeUser(res.data.user);
      auth.storeToken(res.data.token);
      window.dispatchEvent(new Event("userChanged"));
      navigate("/books");
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  if (us) return <Navigate to="/books" replace />;
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light logintop">
      <form
        onSubmit={handleLogin}
        className="bg-white p-4 shadow rounded w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="remember" />
          <label className="form-check-label" htmlFor="remember">
            Remember me
          </label>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        <div className="text-center mt-3 text-muted">Or login with</div>
        <div className="d-flex justify-content-center mt-3">
          <GoogleOAuthProvider clientId="742096444541-hrepa9ffdmhspcflq9icqgves76u536k.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </GoogleOAuthProvider>
        </div>
      </form>
    </div>
  );
}
