import React, { useState, useEffect } from "react";
import "./index.css";

const SessionManager = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);

  const [token] = useState(sessionStorage.getItem("token"));
  const [refreshToken] = useState(sessionStorage.getItem("refreshToken"));

  useEffect(() => {
    if (token) {
      const tokenExpirationTime = sessionStorage.getItem("expiresAt");
      const expirationDate = new Date(tokenExpirationTime * 1000);

      if (expirationDate > Date.now()) {
        const notificationTimer = setTimeout(() => {
          setShowNotification(true);
        }, expirationDate - Date.now() - 60000);

        return () => clearTimeout(notificationTimer);
      } else {
        handleLogout();
      }
    }
  }, [token]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const prolongSession = async () => {
    try {
      if (refreshToken) {
        const response = await fetch(
          "https://vuibackend-6-0.onrender.com/api/user/token/refreshtoken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              refreshToken: refreshToken,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("expiresAt", data.expiresAt);
          console.log("Token refreshed successfully:", data);
          setShowNotification(false);
        } else {
          throw new Error("Token refresh failed");
        }
      } else {
        console.log("No refresh token found.");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return (
    <>
      {showNotification && (
        <div className="modal">
          <div className="modal-content">
            <p>
              Your session will expire soon. Do you want to prolong your
              session?
            </p>
            <button onClick={prolongSession}>Prolong Session</button>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default SessionManager;
