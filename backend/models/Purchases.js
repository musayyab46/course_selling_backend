const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;

const purchaseSchema=new Schema({
    userId:ObjectId,
    courseId:ObjectId,
});

const purchaseModel=mongoose.model("purchase",purchaseSchema);

module.exports={
    purchaseModel:purchaseModel
}