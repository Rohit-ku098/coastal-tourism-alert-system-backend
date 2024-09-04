import mongoose, { Mongoose } from "mongoose";

const beachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    place: {
        type: String,
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    OBJECTID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    coverImage: {
        type: String
    }

}, {
    timestamps: true
});

export const Beach = mongoose.model('Beach', beachSchema);