import mongoose from 'mongoose';
import { Beach } from '../models/beach.model.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getBeaches = asyncHandler(async (req, res) => {
  console.log(req.query)
    const { query="", limit=15, page=1 } = req.query;  

     const searchWords = query?.split(" ").map((word) => word.trim());

     // Create an array of regex conditions for each field and word
     const searchConditions = searchWords?.map((word) => ({
       $or: [
         { name: { $regex: word, $options: "i" } },
         { state: { $regex: word, $options: "i" } },
         { place: { $regex: word, $options: "i" } },
         { district: { $regex: word, $options: "i" } },
       ],
     }));

    const beaches = await Beach.aggregate([
      {
        $match: {
          $and: searchConditions,
        },
      },
      {
        $facet: {
          metadata: [
            { 
              $count: "total" 
            }, 
            { 
              $addFields: { 
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
              } 
            }
          ],
          beaches: [
            { 
              $skip: (Number.parseInt(page) - 1) * Number.parseInt(limit) 
            },
            { 
              $limit: Number.parseInt(limit) 
            },
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
      {
        $unwind: "$metadata",
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