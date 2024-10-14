import React, { useState } from "react";
import Navbar from "../../Navbar";
import "./index.css";
import { useNavigate } from "react-router-dom";
import sendPushNotification from "../../Notifications/sendPushNotification";

if (typeof navigator.serviceWorker !== 'undefined') {
  navigator.serviceWorker.register('index.js')
}
const PostJob = () => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const handleSubmitButton = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.alert("User not authenticated");
      return;
    }
    const userIdFromToken = JSON.parse(atob(token.split(".")[1])).sub;

    if (
      company === "" ||
      position === "" ||
      experience === "" ||
      salary === "" ||
      role === "" ||
      location === "" ||
      level === ""
    ) {
      window.alert("Please fill all the required fields.");
      return;
    }
    setUserId(userIdFromToken);


    const jobPost = {
      company,
      position,
      role,
      level,
      salary,
      experience: parseInt(experience, 10),
      location,
      userId: userIdFromToken,
    };

    try {
      const response = await fetch("https://vuibackend-4-0.onrender.com/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobPost),
      });

      if (response.ok) {
        const newJob = await response.json();

        await sendPushNotification("New job added successfully!");

        navigate("/jobs");

      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding job:", error);
      alert("An error occurred while adding the job");
    }
  };



  return (
    <div>
      <Navbar />

      <div className="job-background">
        <div className="title">
          <h2>Post a Job</h2>
        </div>
      </div>
      <div className="container">
        <header className="header">
          <h1 className="post-job">Fill the form </h1>
        </header>
        <form onSubmit={handleSubmitButton}>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Company Name"
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Enter Job Location
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Job Location"
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>What position are you posting for?</label>
            <select
              id="dropdown"
              name="role"
              className="form-control"
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option disabled selected value>
                Select position
              </option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Full Stack</option>
              <option>Devops</option>
              <option>Digital Marketing</option>
            </select>
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Enter Job Role
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Job Role"
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Enter Level
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Level"
              onChange={(e) => setLevel(e.target.value)}
              required
            />
          </div>

          <div
            className="form-group"
            onChange={(e) => setExperience(e.target.value)}
          >
            <label>Experience </label>
            <label>
              <input
                name="user-recommend"
                value="0-1 Year"
                type="radio"
                className="input-radio"
              />
              0-1 Year
            </label>
            <label>
              <input
                name="user-recommend"
                value="2-3 Years"
                type="radio"
                className="input-radio"
              />
              2-3 Years
            </label>
            <label>
              <input
                name="user-recommend"
                value="4-5 Years"
                type="radio"
                className="input-radio"
              />
              4-5 Years
            </label>
            <label>
              <input
                name="user-recommend"
                value="5+ Years"
                type="radio"
                className="input-radio"
              />
              5+ Years
            </label>
          </div>

          <div className="form-group">
            <label>Salary</label>
            <select
              className="form-control"
              onChange={(e) => setSalary(e.target.value)}
              required
            >
              <option disabled selected value>
                Select Salary
              </option>
              <option value="0-15K">0-15K</option>
              <option value="15-30K">15-30K</option>
              <option value="30K-50K">30K-50K</option>
              <option value="50K-80K">50K-80K</option>
              <option value="80K+">80K+</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
