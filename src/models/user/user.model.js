import mongoose from "mongoose";

// TODO
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fcmToken: {
        type: String
    }
}, {
    timestamps: true
});