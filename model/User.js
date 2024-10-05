import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true, 
    },
    worldcoinID: {
        type: String,
        required: false, 
    },
    isVerified: {
        type: Boolean,
        default: false, 
    },
    name: {
        type: String,
        required: false, 
    },
    profilePicture: {
        type: String,
        required: false, 
    },
    reputation: {
        type: Number,
        default: 0, 
    },
    createdTasks: {
        type: [String], 
        default: [], 
    },
    completedTasks: {
        type: [String], 
        default: [], 
    },
}, {
    timestamps: true, 
});



export default mongoose.model('User', userSchema);
