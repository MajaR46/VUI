const sendPushNotification = async (message, recipient) => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    const response = await fetch("https://vuibackend-6-0.onrender.com/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        recipient: subscription.endpoint,
      }),
    });

    if (response.ok) {
      console.log("Notification sent successfully");
    } else {
      const responseData = await response.text();
      console.error("Failed to send notification:", responseData);
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

export default sendPushNotification;
