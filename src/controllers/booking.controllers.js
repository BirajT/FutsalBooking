import { asyncHandler } from "../utils/asynchandler.utils.js";
import CustomError from "../middleware/error_handler.middleware.js";
import { sendEmail } from "../utils/nodemailer.utils.js";
import Booking from "../models/booking.model.js";
import Futsal from "../models/futsal.model.js";
import User from "../models/user.model.js";

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

    // Validate that futsal exists
    const futsalExists = await Futsal.findById(futsal);
    if (!futsalExists) {
        throw new CustomError("Futsal not found", 404);
    }

    // Check for any time overlap including exact matches
    const conflict = await Booking.findOne({
        futsal,
        date,
        $or: [
            // Case 1: New booking starts during existing booking
            { 
                start_time: { $lte: start_time }, 
                end_time: { $gt: start_time } 
            },
            // Case 2: New booking ends during existing booking  
            { 
                start_time: { $lt: end_time }, 
                end_time: { $gte: end_time } 
            },
            // Case 3: New booking completely contains existing booking
            { 
                start_time: { $gte: start_time }, 
                end_time: { $lte: end_time } 
            },
            // Case 4: Exact same time slot
            { 
                start_time: start_time, 
                end_time: end_time 
            }
        ]
    });

    if (conflict) {
        throw new CustomError("This timeslot is already booked", 400);
    }

    const booking = new Booking({futsal, user, date, start_time, end_time, total_price})

    await booking.save();

    // Populate the booking with futsal and user details
    const populatedBooking = await Booking.findById(booking._id)
        .populate("futsal")
        .populate("user");

    if (!populatedBooking.futsal || !populatedBooking.user) {
        throw new CustomError("Failed to load booking details", 500);
    }

    await sendEmail({
        to: populatedBooking.user.email,
        subject: "Your futsal has been booked",
        html: `<h1>Booking Confirmation</h1><p>Your futsal has been booked at ${populatedBooking.futsal.name}</p>`
    });

    res.status(201).json({
        message: 'Futsal Booked',
        status: "success",
        data: populatedBooking
    })
})


export const update=asyncHandler(async(req,res)=>{
    const {date,start_time,end_time,total_price}=req.body
    const {id}=req.params

    const booking=await Booking.findById(id).populate("user")
    if(!booking)
    {
        throw new CustomError("booking not found",404)
    }
    

    if (date || start_time || end_time) {
        const newDate = date || booking.date;
        const newStartTime = start_time || booking.start_time;
        const newEndTime = end_time || booking.end_time;
        
        const conflict = await Booking.findOne({
            futsal: booking.futsal,
            _id: { $ne: id },
            date: newDate,
            $or: [
                // Case 1: New booking starts during existing booking
                { 
                    start_time: { $lte: newStartTime }, 
                    end_time: { $gt: newStartTime } 
                },
                // Case 2: New booking ends during existing booking  
                { 
                    start_time: { $lt: newEndTime }, 
                    end_time: { $gte: newEndTime } 
                },
                // Case 3: New booking completely contains existing booking
                { 
                    start_time: { $gte: newStartTime }, 
                    end_time: { $lte: newEndTime } 
                },
                // Case 4: Exact same time slot
                { 
                    start_time: newStartTime, 
                    end_time: newEndTime 
                }
            ]
        });
        
        if (conflict) {
            throw new CustomError("This timeslot is already booked", 400);
        }
    }
    
    if (date) booking.date = date;
    if (start_time) booking.start_time = start_time;
    if (end_time) booking.end_time = end_time;
    if (total_price) booking.total_price = total_price;

    await booking.save();

    await sendEmail({
        to: booking.user.email,
        subject: "Booking Updated Successfully",
        html: "<h1>Booking Updated</h1><p>Your booking has been updated successfully.</p>"
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
