import AsyncHandler from '../utils/Asynchandler.js'
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js'

 const AccessAndRefreshToken= async(id)=>{
     try {
        const user= await User.findById(id);
        const accessToken =  await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken= refreshToken;
        
         await user.save({validateBeforeSave:false})
         return{accessToken, refreshToken}
     } catch (error) {
         return new ApiError(501,"Something went wrong while generating the token");
     }


 }
const userRegister = AsyncHandler(async(req, res)=>{
     const{fullname, username, password, email}= req.body;
      // check all the fields are there or not
      if([fullname, username, password, email].some((field)=>field?.trim()==="")){
         throw ApiError(400, "All fields are required");
      }
       const existinguser = await User.findOne({
        $or :[{username}, {email}]
       })
        if(existinguser){
            throw new ApiError( 409,"This user is already existing")

        }
        const user = await User.create({fullname,username,password, email});
        const createdUser =  await  User.findById(user._id).select("-password -refreshToken");
         if(!createdUser){
            throw new ApiError(404, "There is error in creating the user");
         }
          return res.status(201).json(
            
                new  ApiResponse(201, createdUser, "User has been Created successfully")
            
          )




})
const loginuser = AsyncHandler(async(req, res)=>{
    const{username, password}= req.body;
     if(!username || !password){
         throw new ApiError(401, "All the fields are neccessary for login");
     }
     // checking this user is existing or not
      const finduser =  await User.findOne({username})
       if(!finduser){
        throw new ApiError(404, "this user is not found");
       }
     const isPasswordvalid= await finduser.isPasswordCorrect(password);
      if(!isPasswordvalid){
        throw new ApiError(409,"Invalid creditionals");
      }
       const {accessToken, refreshToken} =  await AccessAndRefreshToken(finduser._id);
        console.log("Access Token", accessToken, "RefreshToken", refreshToken);
       const loginuser = await User.findById(finduser._id).select("-password -refreshToken");
       const options={
        httponly:true,
        secure:true
       }
       
       res.status(201)
       .cookie("refreshToken",refreshToken, options)
       .cookie("AccessToken", accessToken, options)
       .json( new ApiResponse( 201, loginuser, "User has been logged in sucessfully")
       )


})
export {userRegister, loginuser}