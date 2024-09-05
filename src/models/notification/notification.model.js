import mongoose from "mongoose";
import { UserPreference } from "./userPreference.model.js";
import { UserNotification } from "./userNotification.model.js";
import { sendNotification } from "../../firebase/index.js";


const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notificationFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beach"
    }
}, {
    timestamps: true,
});



notificationSchema.post("save", async function (doc) {
    try {
        const users = await UserPreference.find({
            beach: doc.notificationFor
        })
        .populate("user");
        
        users.forEach(async (user) => {
            await sendNotification(
                user.user.fcmToken,
                doc.title,
                doc.body,
            )

            await UserNotification.create({
                user: user.user._id,
                notification: doc._id
            })

        })
    } catch (error) {
        console.log("Error in notification model while sending notification", error);
    }
})
export const Notification = mongoose.model("Notification", notificationSchema);