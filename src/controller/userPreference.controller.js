import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserPreference } from "../models/notification/userPreference.model.js";

export const setUserPreference = asyncHandler(async (req, res) => {
    const user = req.user;
    const beachId = req.params.beachId;

    if (!beachId) {
        throw new ApiError("Beach Id is required", 400);
    }
    
    let userPreference = await UserPreference.findOne({ user: user._id, beach: beachId });

    if (!userPreference) {
        userPreference = new UserPreference({
            user: user._id,
            beach: beachId
        });
        await userPreference.save();
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userPreference,
            "User preference saved successfully"
        )
    );
    
})

export const getUserPreference = asyncHandler(async (req, res) => {
    const user = req.user
    
})