import mongoose from "mongoose";

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
    timestamps: true
});