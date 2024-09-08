import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserNotification } from "../models/notification/userNotification.model.js";
import { Notification } from "../models/notification/notification.model.js";

export const getUserNotifications = asyncHandler(async (req, res) => {
    const user = req.user;
    
    const notifications = await UserNotification.find({ user: user._id }).populate("notification");
    // const notifications = await UserNotification.find({ user: user._id }).populate("notification");

    if (!notifications) {
        throw new ApiError(404, "Notifications not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully"
        )
    );
})

export const deleteUserNotification = asyncHandler(async (req, res) => {
    const user = req.user;
    const notificationId = req.params.notificationId;

    if (!notificationId) {
        throw new ApiError(400, "Notification Id is required");
    }
    
    const notification = await UserNotification.findOneAndDelete({ user: user._id, _id: notificationId });

    if(!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Notification deleted successfully"
        )
    );
})

export const readUserNotification = asyncHandler(async (req, res) => {

    const notificationId = req.params.notificationId;

    if (!notificationId) {
        throw new ApiError(400, "Notification Id is required");
    }
    
    const notification = await UserNotification.findByIdAndUpdate(
        notificationId,
        { status: "READ" },
        { new: true }
    );

    if(!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            notification,
            "Notification read successfully"
        )
    );
})