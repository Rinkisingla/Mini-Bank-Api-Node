 import mongoose from "mongoose";
  const connectdb = async ()=>{
    try {
         const  connectionstring =  await mongoose.connect(process.env.MONGODBURL)
          console.log( "Mongodb  connect " , connectionstring.connection.host)
    } catch (error) {
         console.log("mongoDb connection Error",error);
         process.exit(1);
    }

  }
  export default connectdb;