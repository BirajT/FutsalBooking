import mongoose from "mongoose";
import { GENDER, USER_ROLE } from "../constants/enums.constants.js";


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required:[true,'First name is requird'],
    },
     last_name: {
        type: String,
        required:[true,'Last name is requird'],
     },
     email: {
         type: String,
         required: [true, 'Email is required'],
         unique: [true, 'User already exists with provided email'],    
    },
    password: {
        type: String,
        required: [true, 'Password is requird'],
        minLength:6
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default:USER_ROLE.USER
    },
  gender: {
        type: String,
        enum: Object.values(GENDER),
        default:GENDER.MALE
    },
    profile_image: {
        type: {
            path: String,
            public_id:String
        }
    },
    phone: {
        type:String
    }
     
}, { timestamps: true })

// creating user model
const User = mongoose.model('user',userSchema)
export default User