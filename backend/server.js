const dotenv=require('dotenv');
const express=require('express');
const cors=require('cors');
const router=require('express')
const app=express();

dotenv.config();

app.use(cors());



app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+process.env.PORT);
})