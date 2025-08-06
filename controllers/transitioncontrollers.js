 import AsyncHandler from '../utils/Asynchandler.js'
import ApiError from '../utils/ApiError.js'
import {Bank } from '../models/bank.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import mongoose from 'mongoose'

import {Transaction} from '../models/transition.model.js'

  const transfermoney = AsyncHandler(async(req,res)=>{
        const {recevierAccountNumber, amount} = req.body;
        const senderId = req.user;
        if (!recevierAccountNumber?.trim() || typeof amount !== 'number' || amount <= 0) {
            throw new ApiError(400, "Invalid input or insufficient balance");
        }
         const senderaccount = await Bank.findOne({userId: senderId});
        if(!senderaccount){
             throw new ApiError(404,"Sender account not found")
        }
         console.log(senderaccount);
        if(senderaccount.balance< amount){
             throw  new ApiError(402,"Insuffiecient balance")
        }
        const recevierAccount = await Bank.findOne({accountNumber:recevierAccountNumber});
        if(!recevierAccount){
             throw new  ApiError(404,"Recevier account not found")
        }
        console.log(recevierAccount);
        senderaccount.balance-=amount;
        recevierAccount.balance+=amount;
         await senderaccount.save({validateBeforeSave:false});
         await recevierAccount.save({validateBeforeSave:false});
        const tsender= await Transaction.create([{
                userId: senderaccount.userId,
                type: "debit",
                amount,
                balanceAfter: senderaccount.balance,
                description: `Sent to ${recevierAccountNumber}`,
                counterpartyAccount: recevierAccountNumber,
    }]);
    const treceiver= await Transaction.create([{
                userId: recevierAccount.userId,
                type: "credit",
                amount,
                balanceAfter: recevierAccount.balance,
                description: `Receive  from ${senderaccount.accountNumber}`,
                counterpartyAccount: senderaccount.accountNumber,
    }]);

         console.log(tsender, treceiver)  ;
          res.status(201).json(
             new ApiResponse( 201, {tsender, treceiver}, "Money Transfer successfully")
          )

  })
  const history = AsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id || req.user; // fallback if it's directly the ID
    const { type, limit = 10, page = 1 } = req.query;

    const query = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (type === 'debit' || type === 'credit') {
      query.type = type;
    }

    console.log("Final Query:", query);
    console.log("req.user:", req.user);

    const transaction = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Transaction history successfully fetched",
      transaction,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });

  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching the transaction details",
      error: error.message,
    });
  }
});

   export {transfermoney, history}