const express=require('express');
const dotenv=require('dotenv');
const {Router}=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {userMiddleware}=require('../middleware/user');
const {userModel}=require("../models/User");
const {purchaseModel}=require("../models/Purchases");
const {courseModel}=require("../models/Course");
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
    const token=jwt.sign({userId:user._id},process.env.JWT_USER_SECRET);
    res.json({
        message:"user signedin successfully",
        token:token
    })
})
userRouter.get('/purchase',userMiddleware,async (req,res)=>{
    const userId=req.userId;

    const purchases=await purchaseModel.find({
        userId
    })
    //alternative for mapping the purchase course
    // let purchasedCourseIds=[];
    // for(let i=0;i<purchases.length;i++){
    //     purchasedCourseIds.push(purchases[i].courseId)
    // }

    //here purchases.map(x=>x.courseId) will provide array of ids but it
    //cannotbe directly passed into the _id as it expects only a single id
    const courseData=await courseModel.find({
        _id:{ $in : purchases.map(x=>x.courseId)}
    })
    //this will provide all the courses that are purchased by the user
    res.json({
        purchases,
        courseData
    })
})
module.exports={
    userRouter:userRouter
}