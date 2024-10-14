import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "./index.css";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import ProjectFilter from "../ProjectFilter";
import PrimaryButton from "../../buttons/PrimaryButton";
import useSpeech from "../../../hooks/speech";

const ProjectCard = ({
  id,
  _id,
  projectTitle,
  projectDescription,
  projectStatus,
  uploadDate,
  userId,
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const navigate = useNavigate();
  const fetchLoggedInUser = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`https://vuibackend-4-0.onrender.com/api/user/my-user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLoggedInUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const token = sessionStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://vuibackend-4-0.onrender.com/api/review/project/${id}`,
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
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]); // Initialize as an empty array in case of error
    }
  };

  const addComment = async () => {
    if (!loggedInUser) {
      console.error("User not logged in");
      alert("You must be logged in to add a comment.");
      return;
    }

    const newComment = {
      comment,
      userId: loggedInUser._id,
      projectId: _id,
    };

    try {
      const response = await fetch("https://vuibackend-4-0.onrender.com/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments([...comments, createdComment]);
        setComment("");
      } else {
        const errorData = await response.json();
        console.error("Error adding comment:", errorData);
        alert("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `https://vuibackend-4-0.onrender.com/api/review/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      } else {
        const errorData = await response.json();
        console.error("Error deleting comment:", errorData);
        alert("Failed to delete comment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const editComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment._id === commentId);
    if (commentToEdit) {
      setComment(commentToEdit.comment);
      setEditCommentId(commentId);
      setShowCommentBox(true);
    }
  };

  const updateComment = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `https://vuibackend-4-0.onrender.com/api/review/${editCommentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: comment }),
        }
      );
      if (response.ok) {
        setComments(
          comments.map((item) =>
            item._id === editCommentId ? { ...item, comment: comment } : item
          )
        );
        setComment("");
        setEditCommentId(null);
        setShowCommentBox(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="job-list" key={id}>
      <div className="job-card">
        <div className="job-name">
          <div className="job-detail">
            <h4>{projectTitle}</h4>
            <p>{projectDescription}</p>
            <div className="category">
              <p>Status: {projectStatus}</p>
              <p>Uploaded: {uploadDate}</p>
              <p>User ID: {userId}</p>
            </div>
          </div>
        </div>
        <div className="job-button">
          <PrimaryButton
            text="View project"
            onClick={() => navigate("/send-inquiry")}
          />
        </div>
      </div>
      <div className="comment-section">
        {showCommentBox && (
          <div className="comment-box">
            <button
              className="closeCommentBox"
              onClick={() => setShowCommentBox(false)}
            >
              X
            </button>
            <textarea
              className="commentBox"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="addComment"
              onClick={editCommentId ? updateComment : addComment}
            >
              {editCommentId ? "Update Comment" : "Add Comment"}
            </button>
          </div>
        )}
        <button
          className={`toggleCommentBox ${showCommentBox ? "hideComment" : ""}`}
          onClick={() => setShowCommentBox(!showCommentBox)}
        >
          {showCommentBox ? "Hide Section" : "Add a Comment"}
        </button>
        <div className="comments">
          {Array.isArray(comments) &&
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p>
                  <strong>{comment.userId}</strong>: {comment.comment}
                </p>
                <div className="comment-actions">
                  <button onClick={() => editComment(comment._id)}>
                    <AiOutlineEdit />
                  </button>
                  <button onClick={() => deleteComment(comment._id)}>
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchProjects();



    /////////////////////////KEYBOARD SHORTCUTS///////////////
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
  }, [selectedStatus]);




  const fetchProjects = async () => {
    let url = "https://vuibackend-4-0.onrender.com/api/project";

    if (selectedStatus.length && !selectedStatus.includes("All")) {
      url = `https://vuibackend-4-0.onrender.com/api/project/status/${selectedStatus.join(
        ","
      )}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const handleKeyboardShortcut = (event) => {
    if (event.key === "c" || event.key === "C") {
      setShowCompleted(!showCompleted);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [showCompleted]);

  const filteredProjects = showCompleted ? projects : projects.filter(project => project.projectStatus !== "In Progress" && project.projectStatus !== "Pending");

  const fetchProjectsByTitle = async () => {
    if (searchTerm.length < 3) {
      fetchProjects();
      return;
    }

    try {
      const url = `https://vuibackend-4-0.onrender.com/api/project/title/${searchTerm}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 404) {
        console.log("No projects found with the given title.");
        setProjects([]); // Set to empty array if no projects are found
      } else {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects by title:", error);
      setProjects([]); // Set to empty array in case of error
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const searchEvent = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      fetchProjectsByTitle();
    } else {
      fetchProjects();
    }
  }, [searchTerm]);

  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Discover Projects</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {Array.isArray(projects) &&
              filteredProjects.map((project) => (
                <ProjectCard key={project._id} {...project} />
              ))}
          </div>
          <ProjectFilter
            handleStatusFilter={handleStatusFilter}
            searchEvent={searchEvent}
          />
        </div>
      </div>
    </>
  );
};

export default Projects;
