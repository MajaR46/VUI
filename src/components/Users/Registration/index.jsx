import React, { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
    firstName: "",
    lastName: "",
    skills: "",
    location: "",
    bio: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
    if (!email || !password || !role) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://vuibackend-6-0.onrender.com/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Your registration has been submitted successfully.");
        navigate("/Home");
      } else {
        const data = await response.json();
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  };

  const renderAdditionalFields = () => {
    if (formData.role === "company") {
      return (
        <>
          <div className="form-group">
            <label htmlFor="name">Company Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              className="form-control"
              placeholder="Enter Company Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              className="form-control"
              placeholder="Enter Location"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              className="form-control"
              placeholder="Enter Description"
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    } else if (formData.role === "user") {
      return (
        <>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              className="form-control"
              placeholder="Enter Your First Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              className="form-control"
              placeholder="Enter Your Last Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated):</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              className="form-control"
              placeholder="Enter Your Skills"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              className="form-control"
              placeholder="Enter Location"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              className="form-control"
              placeholder="Enter Your Bio"
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    } else {
      return null; // No additional fields for other roles
    }
  };

  return (
    <div className="apply-job">
      <div className="container">
        <header className="header">
          <h1 className="post-job">Registration</h1>
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
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="company">Company</option>
            </select>
          </div>
          {/* Render additional fields based on role */}
          {renderAdditionalFields()}
          <div className="form-group">
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
