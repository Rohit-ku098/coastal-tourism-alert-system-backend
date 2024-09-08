import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema({
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
    timestamps: true,
    expireAfterSeconds: 60
});

// expires after 30 days
userNotificationSchema.index({ sentAt: 1 }, { expireAfterSeconds: 2592000 });

export const UserNotification = mongoose.model("UserNotification", userNotificationSchema);