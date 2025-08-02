import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/Asynchandler.js";
 import jwt from "jsonwebtoken";


const verifyjwt= AsyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();
        if(!token){
             throw new ApiError(401, "Token not found");
        }
        const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         if(!decodedtoken){
              throw new ApiError(401, "Invalid Token");
         }
          const user =  await User.findById(decodedtoken.id).select("-password, -refreshToken")
           if(!user){
              throw new ApiError(400, "User not found");
           }
           req.user= user;
        next();
    } catch (error) {
         throw new ApiError(402,error?.message ||"invalid access token")
    }
})
 export  default verifyjwt