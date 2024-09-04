import mongoose from "mongoose";

const usersNotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
    },
    status: {
        type: String,
        enum: ["UNREAD", "READ"],
        default: "UNREAD"
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});