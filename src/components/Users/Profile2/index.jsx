import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import EditProfile from "../EditProfile/EditProfile";
import ConfirmModal from "../../modals/ConfirmModal";
import "./index.css";
import PrimaryButton from "../../buttons/PrimaryButton";
import CancelButton from "../../buttons/CancelButton";
import { displayInAppNotification } from "../../Notifications/sendAppNotifications";
import useSpeech from "../../..//hooks/speech";

const Profile2 = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    ////////////////////////////////////// KEYBOARD SHORTCUTS ////////////////

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "d" || event.key === "D") {
                window.scrollTo({ top: window.scrollY + 200, behavior: "smooth" });
            } else if (event.key === "u" || event.key === "U") {
                window.scrollTo({ top: window.scrollY - 200, behavior: "smooth" });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    /////////////////////////////////////// VOICE COMMANDS //////////////////////// 

    const handleEditProfile = () => {
        speak("Entering edit profile mode");
        setIsEditing(true);
    };

    const handleDeleteProfile = () => {
        speak("Are you sure?")
        confirmDelete();
    }

    const confimDeleteProfile = () => {
        proceedDelete();
    }
    const cancelDeleteProfile = () => {
        cancelDelete();
    }

    const handleLogoutCommand = () => {
        speak("Logging out");
        handleLogout();
    };

    const commands = {
        "edit profile": handleEditProfile,
        "log out": handleLogoutCommand,
        "delete profile": handleDeleteProfile,
        "yes": confimDeleteProfile,
        'no': cancelDeleteProfile
    };

    const { speak } = useSpeech(commands);





    useEffect(() => {
        const fetchMyUser = async () => {
            const token = sessionStorage.getItem("token");
            try {
                const response = await fetch(`https://vuibackend-6-0.onrender.com/api/user/my-user`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                console.log("Fetched User:", data);
                setUser(data); // Set user state
            } catch (error) {
                console.error("Error fetching current user:", error);
                setUser(null);
            }
        };
        fetchMyUser();
    }, []);

    useEffect(() => {
        if (user && window.hj) {
            window.hj('event', 'viewed_profile_B'); // Send event to Hotjar
        }
    }, [data]);
    // Trigger when 'user' state changes


    const handleUpdateUser = async (formData) => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch(`https://vuibackend-6-0.onrender.com/api/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            displayInAppNotification("Success", { body: "Your profile has been updated successfully!" });
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user:", error);
            displayInAppNotification("Error", { body: "An error occurred while updating your profile. Please try again." });
        }
    };

    const handleDeleteUser = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch(`https://vuibackend-6-0.onrender.com/api/user`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            sessionStorage.clear();
            window.location.href = "/login";
            displayInAppNotification("Success", { body: "Your account has been successfully deleted!" });
        } catch (error) {
            console.error("Error deleting user:", error);
            displayInAppNotification("Error", { body: "An error occurred while deleting your account. Please try again." });
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    const handleNavigationToMyProjects = () => {
        window.location.href = "/my-projects2"
    }

    const handleNavigationToSavedJobs = () => {
        window.location.href = "/saved-job"
    }

    const confirmDelete = () => setShowDeleteModal(true);
    const cancelDelete = () => setShowDeleteModal(false);
    const proceedDelete = () => {
        setShowDeleteModal(false);
        handleDeleteUser();
    };

    if (!user) return null;
    const userRole = user ? user.role : null;


    return (
        <>
            <Navbar />
            <div className="job-background">
                <div className="title">Hi, {user.role === "company" ? user.name : user.firstName}</div>
            </div>
            <div className="job-section">
                <div className="job-page">
                    {isEditing ? (
                        <EditProfile user={user} onSave={handleUpdateUser} onCancel={() => setIsEditing(false)} />
                    ) : (
                        <>
                            {user.role === "admin" ? (
                                <div className="user-title">
                                    <h2>Admin Profile</h2>
                                    <p>Admins have special privileges.</p>
                                </div>
                            ) : user.role === "company" ? (
                                <>
                                    <div className="user-title">
                                        <h2>Company Profile</h2>
                                    </div>
                                    <div className="profile-card-info">
                                        <div className="job-detail">
                                            <h4>{user.name}</h4>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Location:</strong> {user.location}</p>
                                            <p><strong>Description:</strong> {user.description}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <PrimaryButton text="My Projects" onClick={handleNavigationToMyProjects} />
                                        <PrimaryButton text="Saved Jobs" onClick={handleNavigationToSavedJobs} />

                                    </div>



                                    <div className="user-title">
                                        <h2>BASIC INFORMATION</h2>
                                    </div>
                                    <div className="profile-card-info">
                                        <div className="job-detail">
                                            <h4>{user.firstName} {user.lastName}</h4>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Location:</strong> {user.location}</p>
                                            <p><strong>Bio:</strong> {user.bio}</p>
                                        </div>
                                    </div>
                                    <div className="user-title">
                                        <h2>SKILLS</h2>
                                    </div>
                                    <div className="profile-cards">
                                        {user.skills.map((skill, index) => (
                                            <div className="profile-card" key={index}>
                                                <div className="job-detail">
                                                    <h4>{skill}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <div className="button-group">
                                <div>
                                    <PrimaryButton text="Edit Profile" onClick={handleEditProfile} />
                                </div>
                                <div>
                                    <CancelButton text="Delete Profile" onClick={confirmDelete} />
                                </div>
                                <div>
                                    <PrimaryButton text="Logout" onClick={handleLogout} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ConfirmModal
                show={showDeleteModal}
                message="Are you sure you want to delete your profile? This action cannot be undone."
                onConfirm={proceedDelete}
                onCancel={cancelDelete}
            />
        </>
    );
};

export default Profile2;
