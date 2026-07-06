const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;
const authRoutes = require("./Routes/AuthRoutes");
const CustomError = require("./util/CustomError");
const cookieParser = require("cookie-parser");
const errorHandlerController = require("./Controllers/ErrorHandlerController");

app.use(
  cors({
    origin: [
      "https://auth-app-frontend-76wm.onrender.com",
      "https://auth-backend-b6kg.onrender.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Error:", err));

const port = PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Server is running..." });
});
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
app.use(errorHandlerController.errorHandler);
app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});
