import mongoose from "mongoose"
import { MONGO_CONFIG } from "./config.js"
import dotenv from "dotenv" 
dotenv.config()

export const connectDB=()=>{
    mongoose
    .connect(MONGO_CONFIG.URI,{
        dbName:MONGO_CONFIG.db_name,
        autoCreate:true,
    })
    .then(()=>{
        console.log("Database Connected");
    })
    .catch((error)=>{
        console.log(error);
    })
}
