import exp from 'express'
import multer from "multer";
import { register } from "../services/authService.js";
import { UserTypeModel } from '../Models/UserModel.js'
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const upload = multer({ storage: multer.memoryStorage() });

export const adminRoute=exp.Router()

//Register admin(public)
adminRoute.post("/users", upload.single("profileUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    let userObj = req.body;

    //  Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "ADMIN",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "admin created",
      payload: newUserObj,
    });

  } catch (err) {

    // Step 3: rollback
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); // send to your error middleware
  }
});

//Get all users (protected - admin only)
adminRoute.get("/users", verifyToken("ADMIN"), async (req, res) => {
  try {
    const users = await UserTypeModel.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json({
      message: "users retrieved successfully",
      payload: users
    });
  } catch (err) {
    next(err);
  }
});

//Soft delete user (set isActive to false) - different from block
adminRoute.delete("/users/:userId", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user and check if exists
    const user = await UserTypeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete by setting isActive to false
    await UserTypeModel.findByIdAndUpdate(userId, { isActive: false });

    res.status(200).json({
      message: "User soft deleted successfully"
    });
  } catch (err) {
    next(err);
  }
});

//Block user (protected - admin only)
adminRoute.put("/block/:_id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const userId = req.params._id;

    // Find user and check if exists
    const user = await UserTypeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block user by setting isActive to false
    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      message: "User blocked successfully",
      payload: updatedUser
    });
  } catch (err) {
    next(err);
  }
});

//Unblock user (protected - admin only)
adminRoute.put("/unblock/:_id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const userId = req.params._id;

    // Find user and check if exists
    const user = await UserTypeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Unblock user by setting isActive to true
    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    res.status(200).json({
      message: "User unblocked successfully",
      payload: updatedUser
    });
  } catch (err) {
    next(err);
  }
});