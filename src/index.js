import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config'
import { connectDB } from "./config/db.config.js"
import authRoutes from './routes/auth.routes.js'
import futsalRoutes from './routes/futsal.routes.js'
import bookingRoutes from "./routes/booking.routes.js"
import { errorHandler } from "./middleware/error_handler.middleware.js"

const PORT=process.env.PORT || 8080
const app=express()

connectDB()

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/futsal',futsalRoutes)
app.use('/api/booking',bookingRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"server is up and running "
    });
});

// Add error handling middleware
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Database is connected at http://localhost ${PORT}`);
})  