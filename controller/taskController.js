import Task from "../model/task.js";

const uploadToIPFS = async (file) => {};
export const createTask = async (req, res) => {
  const {
    taskTitle,
    taskID,
    coverImage,
    taskDescription,
    bounty,
    deadline,
    creatorWalletAddress,
  } = req.body;

  try {
    const task = new Task({
      taskTitle,
      taskID,
      taskDescription,
      bounty,
      coverImage,
      deadline,
      creatorWalletAddress,
      claimantWalletAddress: null,
      isClaimed: false,
      isCompleted: false,
      verificationStatus: "Pending",
      proofData: null,
    });

    await task.save();

    return res
      .status(201)
      .json({ message: "Task created successfully.", task });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const claimTask = async (req, res) => {
  const { taskID, claimantWalletAddress } = req.body;

  try {
    const task = await Task.findOne({ taskID });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (task.isClaimed) {
      return res.status(400).json({ error: "Task has already been claimed." });
    }

    task.claimantWalletAddress = claimantWalletAddress;
    task.isClaimed = true;

    await task.save({ validateModifiedOnly: true });

    return res
      .status(200)
      .json({ message: "Task claimed successfully.", task });
  } catch (error) {
    console.error("Error claiming task:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const submitProof = async (req, res) => {
  const { taskID, proofDescription } = req.body;
  // const proofFile = req.file;

  // if (!proofFile) {
  //   return res.status(400).json({ error: "Proof file is required." });
  // }

  try {
    const task = await Task.findOne({ taskID });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Upload the proof file to IPFS
    // const proofData = await uploadToIPFS(proofFile);

    task.proofData = proofDescription;
    task.verificationStatus = "Pending";

    await task.save();

    return res
      .status(200)
      .json({ message: "Proof submitted successfully.", task });
  } catch (error) {
    console.error("Error submitting proof:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const verifyProof = async (req, res) => {
  const { taskID, verified } = req.body;

  try {
    const task = await Task.findOne({ taskID });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (task.verificationStatus !== "Pending") {
      return res
        .status(400)
        .json({ error: "Task verification already completed." });
    }

    if (verified) {
      task.verificationStatus = "Approved";
      task.isCompleted = true;

      // Simulate releasing bounty to the claimant
      // (actual on-chain transfer logic will be implemented with smart contracts)
      console.log(
        `Releasing bounty of ${task.bounty} to ${task.claimantWalletAddress}`
      );
    } else {
      task.verificationStatus = "Rejected";
    }

    await task.save();

    return res
      .status(200)
      .json({ message: "Task verification completed.", task });
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const withdrawBounty = async (req, res) => {
  const { taskID, creatorWalletAddress } = req.body;

  try {
    const task = await Task.findById(taskID);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (task.creatorWalletAddress !== creatorWalletAddress) {
      return res
        .status(403)
        .json({ error: "Only the creator can withdraw the bounty." });
    }

    if (task.isClaimed) {
      return res.status(400).json({ error: "Task has already been claimed." });
    }

    if (task.deadline > Date.now()) {
      return res
        .status(400)
        .json({ error: "Task deadline has not yet passed." });
    }

    // Update task status to withdrawn
    task.verificationStatus = "Withdrawn";
    await task.save();

    // Simulate refunding the bounty
    console.log(
      `Refunding bounty of ${task.bounty} to ${creatorWalletAddress}`
    );

    return res
      .status(200)
      .json({ message: "Bounty withdrawn successfully.", task });
  } catch (error) {
    console.error("Error withdrawing bounty:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getTasks = async (req, res) => {
  const { isClaimed } = req.query;

  try {
    const query = {};
    if (isClaimed !== undefined) {
      query.isClaimed = isClaimed === "true";
    }

    const tasks = await Task.find(query);

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find();

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getTasksCreatedByUser = async (req, res) => {
  const { walletAddress, taskID } = req.query;

  try {
    const query = {
      creatorWalletAddress: walletAddress,
    };

    if (taskID) {
      query.taskID = taskID; // Filter by taskID if provided
    }

    const tasks = await Task.find(query);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found." });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks created by user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getTasksClaimedByUser = async (req, res) => {
  const { walletAddress, taskID } = req.query;

  try {
    const query = {
      claimantWalletAddress: walletAddress,
    };

    if (taskID) {
      query.taskID = taskID; // Filter by taskID if provided
    }

    const tasks = await Task.find(query);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found." });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks claimed by user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
