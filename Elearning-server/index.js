import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import cors from 'cors';
import Razorpay from 'razorpay';
import { errorHandler } from './middlewares/TryCatch.js';


dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

  // const corsOptions = {
  //   origin: '*',  // Allow all origins
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  //   credentials: true,
  //   optionsSuccessStatus: 200
  // };


const app = express();
const port = process.env.PORT || 5000;

//using middleware
app.use(express.json()); 
app.use(cors());

app.get('/',(req,res) => {
  res.send("Server is working")

});
app.use('/uploads',express.static('uploads/'))

//importing routes
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
//using routes


app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); 
  connectDb(); 
});
