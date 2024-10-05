import User from "../model/User.js";

export const registerUser = async (req, res) => {
  const { walletAddress, name, profilePictureUrl, worldcoinID } = req.body;

  try {
    // Mock verification process (replace with actual Worldcoin verification logic)
    const isVerified = true; // Assuming verification is successful

    // Create a new user instance with the provided details
    const user = new User({
      walletAddress,
      worldcoinID, // Replace with actual Worldcoin ID after verification
      name,
      profilePicture: profilePictureUrl,
      isVerified,
      reputation: 0, // Initial reputation
      createdTasks: [],
      completedTasks: [],
    });

    // Save user to the database
    await user.save();

    return res
      .status(201)
      .json({ message: "User verified and registered.", user });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateReputation = async (req, res) => {
  const { claimantWalletAddress } = req.body;

  try {
    const user = await User.findOne({ walletAddress: claimantWalletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.reputation += 1; // Increase the reputation by 1
    user.completedTasks.push(req.body.taskID); // Add completed task ID to the list

    await user.save();

    return res
      .status(200)
      .json({ message: "User reputation updated successfully.", user });
  } catch (error) {
    console.error("Error updating user reputation:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
