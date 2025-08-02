import AsyncHandler from '../utils/Asynchandler.js'
import ApiError from '../utils/ApiError.js'
import {Bank } from '../models/bank.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'

const registerbankaccount = AsyncHandler(async(req, res)=>{
     const {id} = req.user
     const  {accountNumber, balance, currency} = req.body;
      if([accountNumber, balance, currency].some((field)=>field?.trim()==="")){
         throw new ApiError( 400, "All information is required");
      }
    const user =  await User.findById(id);
     if(!user){
         throw new ApiError(404,"We are not able to find the user");
     }
        const existingAccount = await Bank.findOne({ userId: id });
    if (existingAccount) {
    throw new ApiError(400, "User already has a bank account");
    }
     const bank =  await Bank.create({
         userId:id,
         accountNumber, balance, currency
     })
    const findbankaccount = await Bank.findById(bank._id);
     if(!findbankaccount){
         throw new ApiError(404,"There is error in creating the bank account");
     }
      res.status(201).json(
        new ApiResponse(201, bank, "Bank Account is created successfully")
      )

     
})
 const viewBalance =AsyncHandler(async(req,res)=>{
     const {id} = req.user;
     const bankaccountdetails =  await Bank.findOne({ userId: id }).select("-currency");
     console.log(bankaccountdetails);
     const user = await  User.findById(id).select("fullname");
     if(!bankaccountdetails){
         throw new ApiError(404, "Bank Account not found");
     }
     res.status(200).json(
        new ApiResponse( 200,{
        fullname: user.fullname,
        accountNumber: bankaccountdetails.accountNumber,
        balance: bankaccountdetails.balance
      },  " we have successfuly viewed our balance")
     )




 }) 
 export {registerbankaccount, viewBalance}