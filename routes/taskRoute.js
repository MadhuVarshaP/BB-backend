import express from "express";
import {
  createTask,
  claimTask,
  submitProof,
  verifyProof,
  withdrawBounty,
  getTasks,
  getAllTasks,
  getTasksCreatedByUser,
  getTasksClaimedByUser,
} from "../controller/taskController.js";

const router = express.Router();

// Route for creating a task
router.post("/create", createTask);

// Route for claiming a task
router.post("/claimTask", claimTask);

// Route for submitting proof of task completion
router.post("/submitProof", submitProof);

// Route for verifying proof and releasing bounty
router.post("/verifyProof", verifyProof);

// Route for withdrawing bounty if task is unclaimed
router.post("/withdrawBounty", withdrawBounty);

// Route for accessing available tasks
router.get("/tasks", getTasks);

// Route for getting all tasks
router.get("/allTasks", getAllTasks);

router.get("/tasksCreatedByUser", getTasksCreatedByUser); // Get tasks created by user
router.get("/tasksClaimedByUser", getTasksClaimedByUser);

export default router;
