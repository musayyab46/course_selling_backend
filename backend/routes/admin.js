const {Router}=require('express');
const {adminModel}=require('../models/Admin');
const {courseModel}=require('../models/Course');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const {adminMiddleware}=require('../middleware/admin');
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
        //if we use the same jwt secret as of user forths then they will get the same jwt 
        //and after the user willalso have access for the admin endpoints as they have same jwt
        const token=jwt.sign({userId:user._id},process.env.JWT_ADMIN_SECRET);
        res.json({
            message:"admin signedin successfully",
            token:token
        })
    
})
adminRouter.post('/addcourse',adminMiddleware,async (req,res)=>{
    const adminId=req.userId;

    const {title,description,imageUrl,price}=req.body;

    //adding to the course model
    
     const Course=await courseModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId:adminId
     })
    
    res.json({
        message:"Course is added",
        CourseId:Course._id
    })


})
adminRouter.put('/courseupdate',adminMiddleware,async (req,res)=>{
    const adminId=req.userId;

    const {title,description,imageUrl,price,courseId}=req.body;

    //adding to the course model
    //Here i HAVE to check whether this course id sent in the req body is created by the same admin or not
    
    const course=await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
     },{
        title,
        description,
        imageUrl,
        price
     }) 
    res.json({
        message:"Course is updated",
        CourseId:courseId
    })
})
module.exports={
    adminRouter:adminRouter
}
