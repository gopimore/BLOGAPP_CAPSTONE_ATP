import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middlewares/verifyToken.js";
export const commonRouter = exp.Router();

//login
commonRouter.post("/login", async (req, res) => {
  try {

    //get user cred object
    let userCred = req.body;

    //call authenticate service
    let { token, user } = await authenticate(userCred);

    //save token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24,
    });

    //send res
    res.status(200).json({
      message: "login success",
      payload: user,
    });

  } catch (err) {
    res.status(401).json({
      message: "Login failed",
      error: err.message,
    });
  }
});
//get current user
commonRouter.get("/me", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const user = await UserTypeModel.findById(req.user.userId).select("-password");
  res.status(200).json({ payload: user });
});

//logout for User, Author and Admin
commonRouter.get("/logout", (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

//Change password(Protected route)
commonRouter.put("/change-password", async (req, res) => {
  //get current password and new password
  const { role, email, currentPassword, newPassword } = req.body;
  // Prevent same password
  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "newPassword must be different from currentPassword" });
  }

  // Find user by email (works for USER, AUTHOR, ADMIN — all same collection)
  const account = await UserTypeModel.findOne({ email });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, account.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  // Hash and save new password
  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password changed successfully" });
});


//page refresh 
commonRouter.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), (req,res) => {
  res.status(200).json({ 
    message : "authenticated",
    payload : req.user
  });
})