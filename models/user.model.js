import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 const userSchema =  new Schema({
     fullname:{
        type: String,
        required: true,
        unique: true,
        trim:true
     },
      username:{
        type: String,
        required: true,
        unique: true,
        lowercase:true
     },
     password:{
        type: String,
        required: true,
        
     },
      email:{
        type: String,
        required: true,
     },
     refreshToken :{
         type: String,
     }

 }, {timestamps:true})
  // save password
 userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
     try {
         const salt =  await bcrypt.genSalt(10);
           this.password =  await  bcrypt.hash(this.password,salt);
           next();
     } catch (error) {
        
           return   next(error);
     }
    
 })
  //verifypassword

  userSchema.methods.isPasswordCorrect = async function (password) {
     return  await bcrypt.compare(password, this.password);
  }
// refreshand access Tokem
userSchema.methods.generateAccessToken =  async function(){
    return await jwt.sign({
        id:this._id,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.AccessTokenExpireIn
    }
)
}
userSchema.methods.generateRefreshToken =  async function(){
    return await jwt.sign({
        id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.RefreshTokenExpireIn
    }
)
}
 export const User = mongoose.model('User', userSchema)
