const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const wifi = require("node-wifi");

const { errorHandler } = require("./middlewares/errorHandler");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/authentication");
const departmentsRoute = require("./routes/departments");
const rolesRoute = require("./routes/roles");
const eventsRoute = require("./routes/events");
const qrCodeRoute = require("./routes/qrcode.routes");
const attendanceRoute = require("./routes/attendance");
const wifiRoute = require("./routes/wifiCheck");
const feedbackRoute = require("./routes/feedback");

const db = process.env.MONGO_URI;
console.log(db);

// Connect to MongoDB using Mongoose
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB!", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize wifi module
wifi.init({
  iface: null,
});

app.get("/", (req, res) => {
  res.send("Hello from EventSwift!");
});

app.use("/api/users", usersRoute);
app.use("/api/departments", departmentsRoute);
app.use("/api/roles", rolesRoute);
app.use("/api/auth", authRoute);
app.use("/api/events", eventsRoute);
app.use("/api/qrcode", qrCodeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/wifi", wifiRoute);
app.use("/api/feedback", feedbackRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
