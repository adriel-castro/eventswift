const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const usersRoute = require("./routes/users");
const departmentsRoute = require("./routes/departments");
const rolesRoute = require("./routes/roles");

const db = process.env.MONGO_URI;
console.log(db);

// Connect to MongoDB using Mongoose
mongoose
  .connect(db, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB!", err));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api/users", usersRoute);
app.use("/api/departments", departmentsRoute);
app.use("/api/roles", rolesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
