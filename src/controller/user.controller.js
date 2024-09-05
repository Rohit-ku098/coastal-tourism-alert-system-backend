import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user/user.model.js";
import { validateEmail, validatePassword } from "../utils/regexValidation.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password, fcmToken } = req.body;

  if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid Email");
  }

  if (!validatePassword(password)) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  const isEmailExist = await User.find({ email });
  if (isEmailExist.length > 0) {
    throw new ApiError(400, "Email already exist");
  }

  const isMobileExist = await User.find({ mobile });
  if (isMobileExist.length > 0) {
    throw new ApiError(400, "Mobile number already exist");
  }
  if (!fcmToken) {
    throw new ApiError(400, "Allow for notifications");
  }

  const createdUser = await User.create({ name, email, mobile, password, fcmToken });
  if (!createdUser) {
    throw new ApiError(500, "Unable to create user");
  }
  
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    createdUser._id
  );

  const user = await User.findOne({ _id: createdUser._id }).select("-password -fcmToken -refreshToken");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };


  return res
  .status(201)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(
    new ApiResponse(201, { user, accessToken, refreshToken }, "User created successfully")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { emailOrMobile, password, fcmToken } = req.body;
    if(!emailOrMobile?.trim() || !password) {
        throw new ApiError(400, "All fields are required");
    }
    if (!fcmToken) {
      throw new ApiError(400, "Allow for notifications");
    }

    const user = await User.findOne(
        {
            $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] 
        }
    );

    if(!user) {
        throw new ApiError(400, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid credentials");
    }

    user.fcmToken = fcmToken;
    await user.save({ validateBeforeSave: false });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findOne({ _id: user._id }).select("-password -fcmToken -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(200, { loggedInUser, accessToken, refreshToken }, "User logged in successfully")
    );
})

export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req?.user._id

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          fcmToken: 1, 
          refreshToken: 1
        }
      }
    )

    if(!user) {
        throw new ApiError(404, "User not found")
    }

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    };
    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"))

})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required")
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    )

    if(!decodedToken) {
        throw new ApiError(400, "Invalid refresh token")
    }

    const user = await User.findById(decodedToken._id);

    if(!user) {
        throw new ApiError(400, "Invalid refresh token");
    }
    if(user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(400, "Refresh token expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          refreshToken,
          accessToken
        },
        "New access token generated successfully"
      )
    )
})

export 
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new ApiError(400, "Old password and new password are required");

  if (!validatePassword(newPassword))
    throw new ApiError(
      400,
      "Password must be at least 6 characters"
    );

  const user = await User.findById(req.user._id);

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect)
    throw new ApiError(400, "Old password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});