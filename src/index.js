import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
        handlePushManagerSubscription(registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

function handlePushManagerSubscription(swRegistration) {
  if ("PushManager" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        subscribeUserToPush(swRegistration);
      } else {
        console.log("Notification permission denied.");
      }
    });
  }
}

function subscribeUserToPush(swRegistration) {
  const applicationServerKey = urlB64ToUint8Array(
    "BCr240xujsyzA6w8FFornvef6qvU41_1KXx3zQaYVFQPthZdnoAC545RLntqEByynuCtMGfLB0fsKcXVqJA-JZg"
  );
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then((subscription) => {
      console.log("User is subscribed:", subscription);
      sendSubscriptionToServer(subscription);
    })
    .catch((err) => {
      console.log("Failed to subscribe the user: ", err);
    });
}

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscriptionToServer(subscription) {
  console.log("Sending subscription to server:", subscription);
  fetch("https://vui-indol.vercel.app/register-subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Subscription sent to server.");
}


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
