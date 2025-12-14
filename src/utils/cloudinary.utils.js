import CustomError from "../middleware/error_handler.middleware.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

export const uploadToCloud = async (file, dir = "/") => {
  try {
    const folder = "8_am" + dir;
    const { public_id, secure_url } = await cloudinary.uploader.upload(file, {
      folder: folder,
      unique_filename: true,
    });

    //! delete image after upload

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return {
      public_id,
      path: secure_url,
    };
  } catch (error) {
      console.log(error)
    throw new CustomError("upload file error", 500);
  }
};


// delete file

export const deleteFile = async (public_id) => {
  try {

    await cloudinary.uploader.destroy(public_id);
    
  } catch (error) {
      console.log(error)
    throw new CustomError("delete file error", 500);
  }
  
}