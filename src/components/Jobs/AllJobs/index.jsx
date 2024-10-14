import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import Filter from "../JobFilter";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import PrimaryButton from "../../buttons/PrimaryButton";
const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const [likedJobs, setLikedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [jobImages, setJobImages] = useState([]);



  useEffect(() => {
    fetchJobs();
    fetchRoles();
    fetchMyUser();
    const storedLikedJobs = JSON.parse(localStorage.getItem("LikedJobs")) || [];
    setLikedJobs(storedLikedJobs);

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

  useEffect(() => {
    const fetchImages = async () => {
      const context = require.context(
        "../../../Assets/images",
        false,
        /\.(png|jpg)$/
      );
      const images = context.keys().map(context);
      setJobImages(images);
    };
    fetchImages();
  }, []);
  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://vui-indol.vercel.app/api/job");
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("There was an error fetching the jobs!", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/job/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("There was an error fetching roles!", error);
    }
  };

  const fetchMyUser = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3001/api/user/my-user`, {
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

  const handleJobFilter = async (role) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/job/role/${role}`
      );
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("There was an error filtering jobs by role!", error);
    }
  };

  const saveClick = (job) => {
    const isLiked = likedJobs.some((likedJob) => likedJob._id === job._id);
    let updatedLikedJobs;

    if (!isLiked) {
      updatedLikedJobs = [...likedJobs, job];
    } else {
      updatedLikedJobs = likedJobs.filter(
        (likedJob) => likedJob._id !== job._id
      );
    }

    setLikedJobs(updatedLikedJobs);
    localStorage.setItem("LikedJobs", JSON.stringify(updatedLikedJobs));
  };

  const searchEvent = (event) => {
    const data = event.target.value;
    setSearchTerm(data);
    if (data !== "" || data.length > 2) {
      const filterData = jobs.filter((item) =>
        Object.values(item).join("").toLowerCase().includes(data.toLowerCase())
      );
      setFilteredJobs(filterData);
    } else {
      setFilteredJobs(jobs);
    }
  };

  const handleExperienceFilter = async (checkedState) => {
    const filters = checkedState.reduce((acc, isChecked, idx) => {
      if (isChecked) {
        const { min, max } = experience[idx];
        acc.push(`${min}-${max}`);
      }
      return acc;
    }, []);

    if (filters.length === 0) {
      setFilteredJobs(jobs);
      return;
    }

    try {
      const results = await Promise.all(
        filters.map((filter) =>
          axios.get(`http://localhost:3001/api/job/experience/${filter}`)
        )
      );
      const filteredJobs = results.flatMap((result) => result.data);
      setFilteredJobs(filteredJobs);
    } catch (error) {
      console.error("There was an error filtering jobs by experience!", error);
    }
  };

  const userRole = user ? user.role : null;

  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Our Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {filteredJobs.map(
              ({ _id, company, position, location, posted, role }, index) => (
                <div key={_id} className="job-list">
                  <div className="job-card">
                    <div className="job-name">
                      <img
                        src={jobImages[index]}
                        alt="logo"
                        className="job-profile"
                      />
                      <div className="job-detail">
                        <h4>{company}</h4>
                        <h3>{position}</h3>
                        <div className="category">
                          <p>{location}</p>
                          <p>{role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="job-button">
                      <PrimaryButton
                        text="Apply Now"
                        onClick={() => navigate("/apply-jobs")}
                      />

                      <Link
                        to="/Jobs"
                        onClick={() => {
                          if (userRole !== "company") {
                            saveClick({
                              _id,
                              company,
                              position,
                              location,
                              posted,
                            });
                          }
                        }}
                      >
                        {userRole !== "company" ? (
                          likedJobs.some((likedJob) => likedJob._id === _id) ? (
                            <AiFillHeart />
                          ) : (
                            <AiOutlineHeart />
                          )
                        ) : null}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <Filter
            roles={roles}
            setFilteredJobs={setFilteredJobs}
            handleJobFilter={handleJobFilter}
            handleExperienceFilter={handleExperienceFilter}
            searchEvent={searchEvent}
          />
        </div>
      </div>
    </>
  );
};

export default Jobs;
