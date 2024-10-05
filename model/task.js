import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },
    taskID: {
      type: Number,
      required: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    bounty: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    creatorWalletAddress: {
      type: String,
      required: true,
    },
    claimantWalletAddress: {
      type: String,
      default: null,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      default: "Pending",
    },
    proofData: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
