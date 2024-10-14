const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const webpushHandler = require("./webpushconfig/webpushHandler");

const app = express();
const PORT = process.env.PORT || 3001;
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");
const jobRoutes = require("./routes/job");
const projectRoutes = require("./routes/project");

const allowCors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Another common pattern
  // res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
};
app.use(allowCors);
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/project", projectRoutes);

app.post("/register-subscription", webpushHandler.registerSubscription);
app.post("/send-notification", webpushHandler.sendNotification);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
