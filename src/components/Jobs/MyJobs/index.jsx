import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import "./index.css";
import EditJob from "../EditJob";
import ConfirmModal from "../../modals/ConfirmModal";
import CancelButton from "../../buttons/CancelButton";
import PrimaryButton from "../../buttons/PrimaryButton";
import { displayInAppNotification } from "../../Notifications/sendAppNotifications";
import useSpeech from "../../..//hooks/speech";


const MyJobs = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);


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

  const handleEditMyJob = () => {
    speak("Entering edit job mode");
    setIsEditing(true);
  };

  const handleDeleteMyJob = () => {
    speak("Are you sure?")
    confirmDelete();
  }

  const confimDeleteJob = () => {
    proceedDelete();
  }
  const cancelDeleteJob = () => {
    cancelDelete();
  }

  const commands = {
    "edit job": handleEditMyJob,
    "delete job": handleDeleteMyJob,
    "yes": confimDeleteJob,
    'no': cancelDeleteJob
  };

  const { speak } = useSpeech(commands);





  const fetchMyJobs = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `https://vuibackend-6-0.onrender.com/api/job/user/my-jobs`,
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
      console.log("Fetched Jobs:", data);
      setFilteredJobs(data);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
      setFilteredJobs([]);
    }
  };

  const handleUpdateJob = async (jobId, formData) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`https://vuibackend-6-0.onrender.com/api/job/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error Status: ${response.status}`);
      }
      displayInAppNotification("Success", {
        body: "Your job has been updated successfully!",
      });

      const updatedJob = await response.json();
      setFilteredJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
      );
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating job:", error);
      displayInAppNotification("Error", {
        body: "There was an error updating your job. Please try again.",
      });
    }
  };

  const handleDeleteJob = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `https://vuibackend-6-0.onrender.com/api/job/${jobToDelete}`,
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
        body: "Your job has been deleted successfully!",
      });

      setFilteredJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== jobToDelete)
      );
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      displayInAppNotification("Error", {
        body: "There was an error deleting your job. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const confirmDelete = (jobId) => {
    setShowDeleteModal(true);
    setJobToDelete(jobId);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const proceedDelete = () => {
    handleDeleteJob();
  };

  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>My Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {filteredJobs.map((job) => {
              const {
                _id: id,
                company,
                location,
                position,
                role,
                level,
                experience,
                salary,
                posted,
              } = job;

              return isEditing === id ? (
                <EditJob
                  key={id}
                  job={job}
                  onSave={handleUpdateJob}
                  onCancel={() => setIsEditing(null)}
                />
              ) : (
                <div className="job-list" key={id}>
                  <div className="job-card">
                    <div className="job-name">
                      <div className="job-detail">
                        <h4>{company}</h4>
                        <p>{position}</p>
                        <div className="category">
                          <p>Location: {location}</p>
                          <p>Role: {role}</p>
                          <p>Level: {level}</p>
                          <p>Experience: {experience}</p>
                          <p>Salary: {salary}</p>
                          <p>Posted: {posted}</p>
                        </div>
                      </div>
                    </div>
                    <div className="job-button">
                      <PrimaryButton
                        text="Edit Job"
                        onClick={() => setIsEditing(id)}
                      />
                      <CancelButton
                        text="Delete Job"
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
        message="Are you sure you want to delete this Job? This action cannot be undone."
        onConfirm={proceedDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default MyJobs;
