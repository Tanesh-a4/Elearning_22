import mongoose from "mongoose";


// const MONGODB_URI = "";
export const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("database connected");
    }catch(error){
        console.log(error);
    }
}