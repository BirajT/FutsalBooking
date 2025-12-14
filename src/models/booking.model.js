import mongoose from "mongoose";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../constants/enums.constants";

const bookingSchema=new mongoose.Schema({
    futsal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Futsal",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    start_time:{
        type:String,
        required:true,
    },
    end_time:{
        type:String,
        required:true,
    },
    total_price:{
        type:Number,
        required:true
    },
    payment_status:{
        type:String,
        enum:Object.values(PAYMENT_STATUS),
        default:PAYMENT_STATUS.PENDING
    },
    booking_status:{
        type:String,
        enum:Object.values(BOOKING_STATUS),
        default:BOOKING_STATUS.PENDING
    }



},{timestamps:true})
const Booking=mongoose.model("booking",bookingSchema)
export default Booking
