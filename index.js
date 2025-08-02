import express from "express"
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js"
 import bankrouter from "./router/bankRouter.js"
import connectdb from "./Database/index.js";
import cookieParser from "cookie-parser";
dotenv.config();
 
const app = express();
  connectdb();
 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/app/user/vi', userRouter);
app.use('/app/bank/v1', bankrouter);

app.get( '/',(req, res)=>{
    res.send("we are working on this path fine");
})
app.listen(4000, ()=>{
    console.log("we are working on this port fine");
})