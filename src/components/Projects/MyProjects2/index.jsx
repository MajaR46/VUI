import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import "./index.css";
import EditProject from "../EditProject/EditProject";
import ConfirmModal from "../../modals/ConfirmModal";
import CancelButton from "../../buttons/CancelButton";
import PrimaryButton from "../../buttons/PrimaryButton";
import { displayInAppNotification } from "../../Notifications/sendAppNotifications";
import useSpeech from "../../..//hooks/speech";


const MyProjects2 = () => {
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState([]);

    ////////////////////////KEYBOARD SHORTCUTS ////////////////
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "d" || event.key === "D") {
                window.scrollTo({
                    top: window.scrollY + 200,
                    behavior: "smooth",
                });
            } else if (event.key === "u" || event.key === "U") {
                window.scrollTo({
                    top: window.scrollY - 200,
                    behavior: "smooth",
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    ////////////////////////// VOICE COMMANDS ///////////////////////////////////

    const handleEditMyProject = () => {
        speak("Entering edit project mode");
        setIsEditing(true);
    };

    const handleDeleteMyProject = () => {
        speak("Are you sure?")
        confirmDelete();
    }

    const confimDeleteProject = () => {
        proceedDelete();
    }
    const cancelDeleteProject = () => {
        cancelDelete();
    }

    const commands = {
        "edit project": handleEditMyProject,
        "delete project": handleDeleteMyProject,
        "yes": confimDeleteProject,
        'no': cancelDeleteProject
    };

    const { speak } = useSpeech(commands);




    const fetchMyProjects = async () => {
        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(
                `https://vuibackend-6-0.onrender.com/api/project/user/project`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Projects:", data);
            setProjects(data); // Update projects
            setFilteredProjects(data); // Update filteredProjects for the initial display
        } catch (error) {
            console.error("Error fetching my projects:", error);
            setProjects([]); // Ensure the state is cleared on error
            setFilteredProjects([]);
        }
    };


    const handleUpdateProject = async (projectId, formData) => {
        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(
                `https://vuibackend-6-0.onrender.com/api/project/${projectId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            displayInAppNotification("Success", {
                body: "Your project has been updated successfully!",
            });

            const updatedProject = await response.json();
            setFilteredProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === updatedProject._id ? updatedProject : project
                )
            );
            setIsEditing(null);
        } catch (error) {
            console.error("Error updating project:", error);
            displayInAppNotification("Error", {
                body: "An error occurred while updating your project. Please try again.",
            });
        }
    };

    const handleDeleteProject = async () => {
        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(
                `https://vuibackend-6-0.onrender.com/api/project/${projectToDelete}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            displayInAppNotification("Success", {
                body: "Your project has been deleted successfully!",
            });

            setFilteredProjects((prevProjects) =>
                prevProjects.filter((project) => project._id !== projectToDelete)
            );
            setShowDeleteModal(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error("Error deleting project:", error);
            displayInAppNotification("Error", {
                body: "An error occurred while deleting your project. Please try again.",
            });
        }
    };

    useEffect(() => {
        fetchMyProjects();
    }, []);

    const confirmDelete = (projectId) => {
        setShowDeleteModal(true);
        setProjectToDelete(projectId);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setProjectToDelete(null);
    };

    const proceedDelete = () => {
        handleDeleteProject();
    };


    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = projects.filter((project) =>
            project.projectTitle.toLowerCase().includes(query) ||
            project.projectDescription.toLowerCase().includes(query)
        );

        setFilteredProjects(filtered);
    };
    return (
        <>
            <Navbar />
            <div className="jobs-for-you">
                <div className="job-background">
                    <div className="title">
                        <h2>My Projects</h2>

                    </div>
                </div>
                <div className="job-section">
                    <div className="job-page">

                        <div className="job-search">
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-term"
                            />
                        </div>
                        {filteredProjects.map((project) => {
                            const {
                                _id: id,
                                projectTitle,
                                projectDescription,
                                projectStatus,
                                uploadDate,
                                userId,
                            } = project;

                            return isEditing === id ? (
                                <EditProject
                                    key={id}
                                    project={project}
                                    onSave={handleUpdateProject}
                                    onCancel={() => setIsEditing(null)}
                                />
                            ) : (
                                <div className="job-list" key={id}>
                                    <div className="job-card">
                                        <div className="job-name">
                                            <div className="job-detail">
                                                <h4>{projectTitle}</h4>
                                                <p>{projectDescription}</p>
                                                <div className="category">
                                                    <p>Status: {projectStatus}</p>
                                                    <p>
                                                        Uploaded:{" "}
                                                        {new Date(uploadDate).toLocaleDateString()}
                                                    </p>
                                                    <p>User ID: {userId}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="job-button">
                                            <PrimaryButton
                                                text="Edit Project"
                                                onClick={() => setIsEditing(id)}
                                            />

                                            <CancelButton
                                                text="Delete Project"
                                                onClick={() => confirmDelete(id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <ConfirmModal
                show={showDeleteModal}
                message="Are you sure you want to delete this project? This action cannot be undone."
                onConfirm={proceedDelete}
                onCancel={cancelDelete}
            />
        </>
    );
};

export default MyProjects2;
