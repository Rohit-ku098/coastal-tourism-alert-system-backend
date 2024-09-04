import mongoose from 'mongoose';
import { Beach } from '../models/beach.model.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getBeaches = asyncHandler(async (req, res) => {
    const beaches = await Beach.aggregate([
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
      }
    ]);
    
    if(!beaches) {
        throw new ApiError(404, 'No beaches found')
    }

    return res.json( new ApiResponse(
        200, 
        beaches,
        "Beaches found successfully"
    ));
})

export const getBeachInfo = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const beach = await Beach.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup: {
                from: "alerts",
                localField: "OBJECTID",
                foreignField: "OBJECTID",
                as: "beachAlerts",
                pipeline: [
                    {
                        $project: {
                            hwa: {
                                alert: 1,
                                color: 1,
                                message: 1,
                                issueDate: 1
                            },
                            ssa: {
                                alert: 1,
                                color: 1,
                                message: 1,
                                issueDate: 1
                            },
                            oceanCurrent: {
                                alert: 1,
                                color: 1,
                                message: 1,
                                issueDate: 1
                            },
                        }
                    }
                ]
            }
        }
    ]);

    if(!beach) {
        throw new ApiError(404, 'No beach found')
    }

    return res.json( new ApiResponse(
        200, 
        beach,
        "Beach found successfully"
    ));
})