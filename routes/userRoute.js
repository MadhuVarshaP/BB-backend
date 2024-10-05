import express from "express";
import {
  registerUser,
  getUserProfile,
  updateReputation,
} from "../controller/userController.js";

const route = express.Router();

route.post("/createUser", registerUser);
// Route for getting user profile by wallet address
route.get("/userProfile/:walletAddress", getUserProfile);
// Route for updating user reputation after task completion
route.post("/updateReputation", updateReputation);

export default route;
