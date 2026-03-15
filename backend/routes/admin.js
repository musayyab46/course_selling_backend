const {Router}=require('express');
const {adminModel}=require('../models/Admin');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const adminRouter=Router();
adminRouter.post('/signup',async (req,res)=>{
   const {email,password,firstName,lastName}=req.body;
       //adding zod validations
       //TODO: hash the password so plaintext is not stored in the DB
       const hashedpassword=await bcrypt.hash(password,10);
       try{
      await adminModel.create({
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
adminRouter.post('/signin',async (req,res)=>{
    const {email,password}=req.body;
        //user.find is returning an array but we need single entry 
        //so here we will have to use user.findOne
        const user=await adminModel.findOne({
            email:email
        })
    
        if(!user){
            res.json({
                message:"admin not found"
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
        const token=jwt.sign(user.password,process.env.JWT_ADMIN_SECRET);
        res.json({
            message:"admin signedin successfully",
            token:token
        })
    
})
adminRouter.post('/course',(req,res)=>{
    res.json({
        message:"update course endpoint"
    })
})
adminRouter.put('/course',(req,res)=>{
    res.json({
        message:"course endpoint"
    })
})
module.exports={
    adminRouter:adminRouter
}
