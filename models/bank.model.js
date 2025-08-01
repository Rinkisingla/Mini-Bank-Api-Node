 import mongoose, {Schema} from "mongoose";
  const bankAccountSchema = new Schema({
     userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
     },
     accountNumber:{
        type:String,
        require:true,
        trim:true
     },
     balance:{
        type:Number,
        require:true,
        default:0,
     },
     currency:{
        type:String,
        require:true,
     }

  }, {timestamps:true})
export const Bank =  mongoose.model("Bank", bankAccountSchema);
