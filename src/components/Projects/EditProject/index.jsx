import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "./index.css";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState({
    projectTitle: "",
    projectDescription: "",
    projectStatus: "",
  });

  const fetchProjectDetails = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`https://vuibackend-6-0.onrender.com/api/project/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProjectDetails(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails({ ...projectDetails, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`https://vuibackend-6-0.onrender.com/api/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate("/my-projects");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="job-background">
        <div className="title">
          <h2>Edit Project</h2>
        </div>
      </div>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label id="name-label" htmlFor="projectTitle">
              Project Title
            </label>
            <input
              type="text"
              id="projectTitle"
              name="projectTitle"
              className="form-control"
              value={projectDetails.projectTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="projectDescription">
              Project Description
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              className="form-control"
              value={projectDetails.projectDescription}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="projectStatus">
              Project Status
            </label>
            <input
              type="text"
              id="projectStatus"
              className="form-control"
              name="projectStatus"
              value={projectDetails.projectStatus}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="submit-button" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProject;
