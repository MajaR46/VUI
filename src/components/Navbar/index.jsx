import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import useSpeech from "../../hooks/speech";

const Navbar = () => {
  const [user, setUser] = useState(null);

  const fetchMyUser = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`https://vuibackend-6-0.onrender.com/api/user/my-user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched User:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMyUser();
  }, []);

  const userRole = user ? user.role : null;
  const userEmail = user ? user.email : null;

  const { speak } = useSpeech({
    "go to home": () => document.getElementById("home-link").click(),
    "go to jobs": () => document.getElementById("jobs-link").click(),
    "go to saved jobs": () => document.getElementById("saved-jobs-link").click(),
    "go to discover projects": () => document.getElementById("projects-link").click(),
    "go to add projects": () => document.getElementById("add-projects-link").click(),
    "go to admin dashboard": () => document.getElementById("admin-dashboard-link").click(),
    "go to my profile": () => document.getElementById("my-profile-link").click(),
    "go to my projects": () => document.getElementById("my-projects-link").click(),
    "go to post a project": () => document.getElementById("post-project-link").click(),
    "go to my jobs": () => document.getElementById("my-jobs-link").click(),
    "go to post a job": () => document.getElementById("post-job-link").click(),
    "go to login": () => document.getElementById("login-link").click(),
  });

  return (
    <nav id="navbar">
      <h1 className="logo">
        MELT <span>Freelance</span>
      </h1>

      <ul>
        {/* Common menu items */}
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Jobs</Link>
        </li>
        {/* Conditionally render "Saved Jobs" menu item */}
        {userRole !== "company" && (
          <li>
            <Link to="/saved-job">Saved Jobs</Link>
          </li>
        )}
        <li>
          <Link to="/projects">Discover projects</Link>
        </li>

        {/* Conditional menu items based on user role */}
        {userRole === "admin" && (
          <>
            <li>
              <Link to="/add-projects">Add project</Link>
            </li>
            <li>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </li>
          </>
        )}

        {/* Menu items only for logged-in users */}
        {user && (
          <li className="profile-dropdown">
            <Link to="/profile">Profile</Link>
            <div className="dropdown-content">
              <Link to="/profile">My Profile</Link>
              {userRole !== "company" && (
                <>
                  <Link to="/my-projects">My Projects</Link>
                  <Link to="/add-projects">Post a Project</Link>
                </>
              )}
              {userRole === "company" && (
                <>
                  <Link to="/my-jobs">My Jobs</Link>
                  <Link to="/post-job">Post a Job</Link>
                </>
              )}
              {userEmail === "usertest@gmail.com" && (
                <>
                  <Link to="/my-projects2">My Projects2</Link>
                </>
              )}

            </div>
          </li>
        )}

        {/* Login menu item */}
        {!user && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
