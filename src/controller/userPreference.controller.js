import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserPreference } from "../models/notification/userPreference.model.js";

export const setUserPreference = asyncHandler(async (req, res) => {
    const user = req.user;
    const beachId = req.params.beachId;

    if (!beachId) {
        throw new ApiError(400, "Beach Id is required");
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

export const removeUserPreference = asyncHandler(async (req, res) => {
    const user = req.user;
    const beachId = req.params.beachId;

    if (!beachId) {
        throw new ApiError(400,"Beach Id is required");
    }
    
    const userPreference = await UserPreference.findOneAndDelete({ user: user._id, beach: beachId });
    
    if(!userPreference) {
        throw new ApiError(404,"User preference not found");
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "User preference removed successfully"
        )
    );
})

export const getUserPreferenceBeaches = asyncHandler(async (req, res) => {
    const user = req.user;

    const userPreferenceBeaches = await UserPreference.aggregate([
      {
        $match: {
          user: user._id,
        },
      },
      {
        $lookup: {
          from: "beaches",
          localField: "beach",
          foreignField: "_id",
          as: "beach",
          pipeline: [
            {
              $lookup: {
                from: "alerts",
                localField: "OBJECTID",
                foreignField: "OBJECTID",
                as: "beachAlerts",
              },
            },
            {
              $addFields: {
                HWA: {
                  alert: {
                    $first: "$beachAlerts.hwa.alert",
                  },
                  color: {
                    $first: "$beachAlerts.hwa.color",
                  },
                },
                SSA: {
                  alert: {
                    $first: "$beachAlerts.ssa.alert",
                  },
                  color: {
                    $first: "$beachAlerts.ssa.color",
                  },
                },
                oceanCurrent: {
                  alert: {
                    $first: "$beachAlerts.oceanCurrent.alert",
                  },
                  color: {
                    $first: "$beachAlerts.oceanCurrent.color",
                  },
                },
              },
            },
            {
              $project: {
                beachAlerts: 0,
              },
            },
          ],
        },
      },
    ]);

    if(!userPreferenceBeaches) {
        throw new ApiError(404,"User preference not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userPreferenceBeaches,
            "User preference saved successfully"
        )
    );
})