const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;

const courseSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const courseModel=mongoose.model('course',courseSchema)

module.exports={
    courseModel:courseModel
}