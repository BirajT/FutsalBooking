import mongoose from "mongoose";

const futsalSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    address:{
        type:String,
        required:[true,"address is required"]
    },
    contact:{
        type:String,
        required:[true,"number is required"]
    },
    opening_time:{
        type:String,
        required:[true,"time is required"]
    },
    closing_time:{
        type:String,
        required:[true,"time is required"]
    },
    price_per_hour:{
        type:Number,
        required:[true,"price is required"]
    },
    futsal_image:{
        type:{
            path:String,
            public_id:String
        }
    }
},{timestamps:true})

//creating futsal model
const Futsal=mongoose.model('futsal',futsalSchema)
export default Futsal