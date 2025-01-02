import React, { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://vuibackend-6-0.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Add this line to inspect the response
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("expiresAt", data.expiresAt);

        // Navigate based on userRole
        if (data.userRole === "user") {
          navigate("/profile");
        } else if (data.userRole === "userB") {
          navigate("/profile2");
        } else {
          alert("Invalid user role");
        }
      } else {
        const data = await response.json();
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleRegister = () => {
    navigate("/registration");
  };

  return (
    <div className="login">
      <div className="container">
        <header className="header">
          <h1 className="login-title">Login</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="form-control"
              placeholder="Enter Your Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              className="form-control"
              placeholder="Enter Your Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Login
            </button>
            <p>Don't have an account?</p>
            <button className="profile-button" onClick={handleRegister}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
