import { asyncHandler } from "../utils/asynchandler.utils.js";
import Booking from "../models/booking.model.js";
import CustomError from "../middleware/error_handler.middleware.js";
import { sendEmail } from "../utils/nodemailer.utils.js";

export const getAll=asyncHandler(async(req,res)=>{
    const bookings=await Booking.find({})
    .populate("futsal")
    .populate("user")

    res.status(200).json({
        message:"Booking fetched",
        status:"success",
        data:bookings
    })
})

export const getById=asyncHandler(async(req,res)=>{
    const {id}=req.params

    const booking=await Booking.findOne({_id:id})
    .populate("futsal")
    .populate("user")

    if(!booking)
    {
        throw new CustomError("Booking not found",404)
    }
    res.status(200).json({
        message:"Booking fetched",
        status:"success",
        data:booking
    })
})

export const create=asyncHandler(async(req,res)=>{
    const {futsal,date,start_time,end_time,total_price}=req.body
    const user = req.user._id;

       const conflict = await Booking.findOne({
        futsal,
        date,
        $or: [
            { start_time: { $lt: end_time, $gte: start_time } },
            { end_time: { $gt: start_time, $lte: end_time } },
            { start_time: { $lte: start_time }, end_time: { $gte: end_time } }
        ]
    });

    if (conflict) 
        {
            throw new CustomError("This timeslot is already booked", 400);
        }

     if(date) booking.date=date
     if(start_time) booking.start_time=start_time
     if(end_time) booking.end_time=end_time
     if(total_price) booking.total_price=total_price   

    const booking=new Booking({futsal,user,date,start_time,end_time,total_price})

    await booking.populate("futsal").populate("user");

    await booking.save();

    await sendEmail({
        to:booking.user.email,
        subject:"Your futsal has been booked",
        html:`Your futsal has been booked on ${booking.futsal.name} `

    })

    res.status(201).json({
        message:'Futsal Booked',
        status:"success",
        data:booking
    })
})

export const update=asyncHandler(async(req,res)=>{
    const {futsal,user,date,start_time,end_time,total_price}=req.body
    const {id}=req.params

    const booking=await Booking.findById(id)
    if(!booking)
    {
        throw new CustomError("booking not found",404)
    }
    

     if (date || start_time || end_time) {
        const conflict = await Booking.findOne({
            futsal: booking.futsal,
            _id: { $ne: id },
            date: date || booking.date,
            $or: [
                { start_time: { $lt: end_time || booking.end_time, $gte: start_time || booking.start_time } },
                { end_time: { $gt: start_time || booking.start_time, $lte: end_time || booking.end_time } },
                { start_time: { $lte: start_time || booking.start_time }, end_time: { $gte: end_time || booking.end_time } }
            ]
        });
        if (conflict) throw new CustomError("This timeslot is already booked", 400);
    }

    if (date) booking.date = date;
    if (start_time) booking.start_time = start_time;
    if (end_time) booking.end_time = end_time;
    if (total_price) booking.total_price = total_price;

    await booking.save();

    await sendEmail({
        to:booking.user.email,
        subject:"Booking Updated Successfully "
    })

    res.status(200).json({
        message: "Booking updated",
        status: "success",
        data: booking
    });
});


export const remove=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const booking=await Booking.findById(id).populate("user").populate("futsal")

    if(!booking)
    {
        throw new CustomError("Booking not found",404)
    }

    await booking.deleteOne();

    await sendEmail({
        to:booking.user.email,
        subject:"Booking canceled",
        html:`your booking on ${booking.user.name} has been canceled`,
        
    })

    res.status(200).json({
        message:"booking deleted",
        status:"success",
        data:null
    })
})
