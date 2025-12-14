import CustomError from "../middleware/error_handler.middleware.js"
import Futsal from "../models/futsal.model.js"
import { asyncHandler } from "../utils/asynchandler.utils.js"
import { uploadToCloud,deleteFile } from "../utils/cloudinary.utils.js";
import {getPagination} from "../utils/pagination.utils.js"



const dir='/futsals'

export const getAll=asyncHandler(async(req,res)=>{

    const{query,
        page=1,
        limit=10,
        minPrice,
        maxPrice}=req.query

        const currentPage = Number(page);
        const perPageLimit = Number(limit);
        const skip = (currentPage - 1) * perPageLimit;

        let filter={}

        if(query){
            filter.$or=[
                {
                name:{
                    $regex:query,
                    $options:"i",
                    }},
                {address:{
                    $regex:query,
                    $options:"i",
                }}    
                ,  
                    ]
                }

            if (minPrice || maxPrice) {
            filter.price_per_hour = {};
  
            if (minPrice) filter.price_per_hour.$gte = minPrice;
            if (maxPrice) filter.price_per_hour.$lte = maxPrice;
}    
    const futsals=await Futsal.find(filter)
    .sort({ createdAt: -1 }).skip(skip).limit(perPageLimit);
    

    const total_counts=await Futsal.countDocuments(filter)
    const pagination=getPagination(total_counts,currentPage,perPageLimit)
    
    res.status(200).json({
        message:"Futsal fetched",
        status:"success",
        data:futsals,
        pagination
    });
});

export const getById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    const futsal=await Futsal.findOne({_id:id})
    if(!futsal)
    {
        throw new CustomError("Futsal not found",404)
    }

    res.status(200).json({
        message:"Futsal fetched",
        status:"success",
        data:futsal
        
    })
})

export const create=asyncHandler(async(req,res)=>{
    const {name,address,contact,opening_time,closing_time,price_per_hour}=req.body
    const file=req.file;

    if(!file){
        throw new CustomError('image is required',400)
    }

    const futsal=new Futsal({name,address,contact,opening_time,closing_time,price_per_hour})

     const { path, public_id } = await uploadToCloud(file.path,dir);
    
    futsal.futsal_image = {
        path,
        public_id
    }

    await futsal.save();

    res.status(201).json({
        message: 'Futsal created.',
        status: 'success',
        data:futsal
    })

})

export const update=asyncHandler(async(req,res)=>{

    const {name,address,contact,opening_time,closing_time,price_per_hour}=req.body
    const {id}=req.params
    const file=req.file

    const futsal=await Futsal.findOne({_id:id})

    if(!futsal)
    {
        throw new CustomError('Futsal not found',404)
    }
    if(name) futsal.name=name
    if(address) futsal.address=address
    if(contact) futsal.contact=contact
    if(opening_time) futsal.opening_time=opening_time
    if(closing_time) futsal.closing_time=closing_time
    if(price_per_hour) futsal.price_per_hour=price_per_hour

     if (file) {
        const { path, public_id } = await uploadToCloud(file.path, dir);
        if (futsal.futsal_image) {
            await deleteFile(futsal.futsal_image?.public_id)
        }
        futsal.futsal_image = {
            path,
            public_id
        }
    }
    await futsal.save()

    res.status(200).json({
    message: "Futsal updated",
    status: "success",
    data: futsal
})
})

export const remove=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const futsal=await Futsal.findOne({_id:id})

    if(!futsal){
        throw new CustomError("Futsal not found",404)
    }

    if(futsal.futsal_image)
    {
         await deleteFile(futsal.futsal_image?.public_id)
    }
    await futsal.deleteOne()

    res.status(200).json({
        message:"Futsal deleted",
        status:"success",
        data:null
    })
})