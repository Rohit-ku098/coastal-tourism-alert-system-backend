import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
    beach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beach"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

export const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);