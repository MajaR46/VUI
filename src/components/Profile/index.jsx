import React from "react";
import Navbar from "../Navbar";
import "./index.css";

const Profile = () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  if (!loggedInUser) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="job-background">
        <div className="title">
          <h2>Hi, {loggedInUser.firstName}</h2>

        </div>
      </div>
      <div className="job-section">
        <div className="job-page">
          <div className="user-title">
            <h2>BASIC INFORMATION</h2>
          </div>
          <div className="profile-card-info">
            <div className="job-detail">
              <h4>{loggedInUser.firstName} {loggedInUser.lastName}</h4>
              <p><strong>Email:</strong> {loggedInUser.email}</p>
              <p><strong>Location:</strong> {loggedInUser.location}</p>
              <p><strong>Bio:</strong> {loggedInUser.bio}</p>
            </div>
          </div>
          <div className="user-title">
            <h2>SKILLS</h2>
          </div>
          <div className="profile-cards">
            {loggedInUser.skills.map((skill, index) => (
              <div className="profile-card" key={index}>
                <div className="job-detail">
                  <h4>{skill}</h4>
                </div>
              </div>
            ))}
          </div>
          <button className="profile-button" onClick={handleLogout}>Logout</button> {/* Logout button */}

        </div>

      </div>
    </>
  );
};

export default Profile;
