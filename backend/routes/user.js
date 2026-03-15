const express=require('express');
const dotenv=require('dotenv');
const {Router}=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {userModel}=require("../models/User");
dotenv.config();


const userRouter=Router();

userRouter.post("/signup",async (req,res)=>{
    const {email,password,firstName,lastName}=req.body;
    //adding zod validations
    //TODO: hash the password so plaintext is not stored in the DB
    const hashedpassword=await bcrypt.hash(password,10);
    try{
   await userModel.create({
        email:email,
        password:hashedpassword,
        firstName:firstName,
        lastName:lastName
    })
}
catch(err){
    console.log("signup failed");
    return;
}
    res.json({
        message:"signup successful"
    })
})
userRouter.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    //user.find is returning an array but we need single entry 
    //so here we will have to use user.findOne
    const user=await userModel.findOne({
        email:email
    })

    if(!user){
        res.json({
            message:"User not found"
        })
        return;
    }
    const Match=await bcrypt.compare(password,user.password);
    if(!Match){
        res.json({
            message:"password do not match"
        })
        return;
    }
    const token=jwt.sign(user.password,process.env.JWT_USER_SECRET);
    res.json({
        message:"user signedin successfully",
        token:token
    })
})
userRouter.get('/purchase',(req,res)=>{
    res.json({
        message:"purchase endpoint"
    })
})
module.exports={
    userRouter:userRouter
}