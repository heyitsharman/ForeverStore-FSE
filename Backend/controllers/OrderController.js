//placing orders using cod
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const currency = "INR";
const deliveryCharge = 10;
// getway initialized
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async(req,res) =>{
    try {
        const {userId,items,amount,address,paymentMethod}= req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod,
            payment:false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true, message:'Order Placed'});
    } catch (error) {
        console.log(error);
        res.json({success:false,message: error.message});
        
    }
}

//using stripe

const placeOrderStripe = async(req,res) =>{
    try{
        const {userId,items,amount,address,paymentMethod}= req.body;
        const {origin}= req.headers;

         const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=>({
            price_data :{
                currency:currency,
                product_data:{
                    name: item.name,
                },
                unit_amount : item.price * 100,

            },
            quantity: item.quantity,
        }))
        line_items.push({
            price_data :{
                currency:currency,
                product_data:{
                    name: "Shipping Charges",
                },
                unit_amount : deliveryCharge * 100,
            },
            quantity:1,
        }
        )
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({success:true, session_url: session.url}); 

    }
    catch(error){
        console.log(error);
        res.json({success:false,message: error.message});
    }
}

// veify stripe
const verifyStripe = async(req,res)=>{
    const {orderId,success,userId}= req.body;
    try {
        if(success===true){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}});
            res.json({success:true});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false});
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message: error.message});
    }
}
//using razorpay
const placeOrderRazorpay = async(req,res) =>{
    // TODO: Implement Razorpay integration
    res.json({success:false, message: 'Razorpay not implemented yet'});
}


// all order data for admin panel
const allOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,orders});
    } catch (error) {
          console.log(error);
        res.json({success:false,message: error.message});
    }
}

// for user data in frontend
const userOrders = async(req,res)=>{
    try {
         const {userId} = req.body;
         const orders = await orderModel.find({userId})
         res.json({success: true,orders});
    } catch (error) {
         console.log(error);
        res.json({success:false,message: error.message});
        
    }
}

//update status of order from admin
const updateStatus = async(req,res)=>{
    try {
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId,{status});
        res.json({success:true,message:'Status Updated'});
    } catch (error) {
        console.log(error);
        res.json({success:false,message: error.message});
    }
}


export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe};