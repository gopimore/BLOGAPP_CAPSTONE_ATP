import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../Models/UserModel.js";
//import { ArticleModel } from "../Models/ArticleModel.js";
import {config} from 'dotenv'
config()

//register function
export const register = async (userObj) => {
  //Create document
  const userDoc = new UserTypeModel(userObj);
  //validate for emprty passwords
  await userDoc.validate();
  //hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);
  //save
  const created = await userDoc.save();
  //convert document to object to remove password
  const newUserObj = created.toObject();
  //remove password
  delete newUserObj.password;
  //return user obj without password
  return newUserObj;
};

//authenticate function
export const authenticate = async ({ email, password }) => {
    //check user with email
  const user = await UserTypeModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email ");
    err.status = 401;
    throw err;
  }

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }
  //check isActive state
  if(user.isActive===false){
    const err = new Error("Your account blocked. plz contact admin ");
    err.status= 403;
    throw err;
  }

  //generate token
  const token = jwt.sign({ userId: user._id, 
    role: user.role.toUpperCase(), email: user.email }, 
    process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};


