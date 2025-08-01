 import mongoose, {Schema} from "mongoose";
 const transactionschema = new Schema ({
     userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
     },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
        },
    accountNumber:{
        type:String,
        require:true,
     },
     balanceAfter:{
        type:Number,
        require:true,
       
     },
     description:{
    type:String,
    require:true,
     },
     counterpartyAccount:{
    type:String,
    require:true,
     },

 }, {timestamps:true})
  export const  Transaction = mongoose.model('Transaction', transactionschema)





