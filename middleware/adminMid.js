import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';
dotenv.config();      //**** accessing .env file information here 
const JWT_SECRET=process.env.JWT_SECRET_ADMIN

function AdminMiddleware(req,res,next) {
    const token=req.headers.authorization
    const decodedResult=jwt.verify(token, JWT_SECRET)
    
    if(decodedResult){
        req.adminID=decodedResult.id
        next()
    }
    else{
        res.status(403).json({
            message:'You are not logged in.'
        })
    }
}


export default AdminMiddleware;