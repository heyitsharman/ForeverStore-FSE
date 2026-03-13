import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import CartRouter from './routes/CartRoute.js';
import orderRouter from './routes/orderRoute.js';


//App config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://forever-store-74q5.vercel.app', 'https://forever-admin.vercel.app', 'https://forever-store-delta.vercel.app', 'https://forever-store-admin.vercel.app'],
    credentials: true
}))

//api endpoints
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',CartRouter);
app.use('/api/order',orderRouter);


app.get('/',(req,res)=>{
  res.send('api working');
})





app.listen(port,()=>{
    console.log('server started on PORT : '+ port);
})