const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
function adminMiddleware(req,res,next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,process.env.JWT_ADMIN_SECRET);
    if(decoded){
        req.userId=decoded.userId;
        next();
    }
    else{
        res.status(403).json({
            message:"You are not signed in"
        })
    }
}
module.exports={
    adminMiddleware:adminMiddleware
}