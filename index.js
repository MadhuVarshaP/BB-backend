import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import taskRoute from "./routes/taskRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(MONGO)
  .then(() => {
    console.log("DB is Connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB:", error);
  });

// User routes
app.use("/api/user", route);
// Task routes
app.use("/api/tasks", taskRoute);
