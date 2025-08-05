 import mongoose, {Schema} from "mongoose";
 const transactionSchema = new Schema ({
     userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
     },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
        },
    amount:{
        type:Number,
        required:true
     },
     balanceAfter:{
        type:Number,
        required:true,
       
     },
     description:{
    type:String,
    required:true,
     },
     counterpartyAccount:{
    type:String,
    required:true,
     },

 }, {timestamps:true})
  export const  Transaction = mongoose.model('Transaction', transactionSchema)





