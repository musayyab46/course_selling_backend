const {Router}=require('express');
const courseRouter=Router();
const {userMiddleware}=require('../middleware/user');
const {purchaseModel}=require('../models/Purchases');
const {courseModel}=require("../models/Course");
courseRouter.post('/purchase',userMiddleware, async (req,res)=>{
    const userId=req.userId;
    const {courseId}=req.body;

    const user=await purchaseModel.findOne({
        userId:userId,
        courseId:courseId
    })
    if(user){
        res.json({
            message:"You already bought the course"
        })
        return;
    }
    //Here you will expect the user to pay for course purchase
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message:"You have successfully bought the course"
    })

})
courseRouter.get('/preview',async (req,res)=>{
    //it is the endpoint which will update the given course

    const courses=await courseModel.find({});
    res.json({
        courses
    })

   
})

module.exports={
    courseRouter: courseRouter
}
