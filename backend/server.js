const dotenv=require('dotenv');
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const Router=require('express');
const {userRouter}=require('./routes/user');
const {courseRouter}=require('./routes/course');
const {adminRouter}=require('./routes/admin');
const app=express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Welcome to courseselling backend");
})
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter)

//Connecting the database
const dbconnect=async ()=>{
    try{
        await mongoose.connect(process.env.MONGOURI);
        console.log("MongoDb connected successfully");
    }
    catch(err){
        console.error(err);
    }
}

dbconnect();

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+process.env.PORT);
})