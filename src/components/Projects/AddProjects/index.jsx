import React, { useState } from "react";
import Navbar from "../../Navbar";
import "./index.css";
import { useNavigate } from "react-router-dom";
import SaveButton from "../../buttons/SaveButton";
import sendPushNotification from "../../Notifications/sendPushNotification";

const AddProject = () => {
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [userId, setUserId] = useState("");


  const handleSubmitButton = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.alert("User not authenticated");
      return;
    }
    const userIdFromToken = JSON.parse(atob(token.split(".")[1])).sub;

    if (
      projectTitle === "" ||
      projectDescription === "" ||
      projectStatus === "" ||
      uploadDate === ""
    ) {
      alert("All fields are required");
      return;
    }

    setUserId(userIdFromToken);

    const projectData = {
      projectTitle,
      projectDescription,
      projectStatus,
      uploadDate,
      userId: userIdFromToken,
    };

    try {
      const response = await fetch("https://vuibackend-4-0.onrender.com/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const newProject = await response.json();
        await sendPushNotification("New project added successfully!");

        navigate("/my-projects");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("An error occurred while adding the project");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="job-background">
        <div className="title">
          <h2>Post a Project</h2>
        </div>
      </div>
      <div className="container">
        <header className="header">
          <h1 className="post-job">Fill the form </h1>
        </header>
        <form onSubmit={handleSubmitButton}>
          <div className="form-group">
            <label id="name-label" htmlFor="projectTitle">
              Project Title
            </label>
            <input
              type="text"
              id="projectTitle"
              className="form-control"
              value={projectTitle}
              placeholder="Enter Project Title"
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="projectDescription">
              Project Description
            </label>
            <textarea
              id="projectDescription"
              className="form-control"
              value={projectDescription}
              placeholder="Enter Project Description"
              onChange={(e) => setProjectDescription(e.target.value)}
              required
              rows={6}
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="projectStatus">
              Project Status
            </label>
            <select
              id="projectStatus"
              className="form-control"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="uploadDate">
              Upload Date
            </label>
            <input
              type="date"
              id="uploadDate"
              className="form-control"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <SaveButton text="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
