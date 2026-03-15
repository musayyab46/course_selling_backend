const {Schema}=require('mongoose');
const mongoose=require('mongoose');

const adminSchema=new Schema({
    email:{type:String, unique:true },
    password:String,
    firstName:String,
    lastName:String,
})

const adminModel=mongoose.model('admin',adminSchema);

module.exports={
    adminModel:adminModel
}
