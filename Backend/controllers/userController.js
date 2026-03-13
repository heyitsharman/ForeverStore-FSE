import userModel from '../models/userModel.js';
import validator from 'validator';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//route for user login

const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}


const loginUser =async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false, message: 'User not found'});
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if(isMatch){
            const token= createToken(user._id);
            res.json({success:true, token});
        }
        else{
            res.json({success:false, message: 'Invalid credentials'});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});

    }
}


//route for user registration
const registerUser = async (req,res)=>{

    try{
        const {name,email,password} = req.body;
        //checking user already exists or not
        const exists = await userModel.findOne({email});

        if(exists){
            return res.json({success: false, message: 'User already exists'});
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: 'Invalid email format'});
            
        }
        if(password.length < 8){
            return res.json({success: false, message: 'please enter a strong password'});
        }
        
        
        //hashing user password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password,salt);

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({success:true, token});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//route for admin login
const adminLogin = async (req,res)=>{
    try{
        const {email,password}= req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true,token});
        }
        else{
            res.json({success:false, message:'Invalid credentials'});
        }
    }
    catch(error){
         console.log(error);
        res.json({success:false, message:error.message});
    }
}

export {loginUser,registerUser,adminLogin};