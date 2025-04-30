import express from "express";
import { z } from 'zod'
import { UserModel, AdminModel, CourseModel, PurchaseModel } from "../database.js";
import bcrypt from "bcrypt";
const saltRounds=5
import jwt from 'jsonwebtoken'
import UserMiddleware from "../middleware/userMid.js";

import dotenv from 'dotenv';

dotenv.config();      //**** accessing .env file information here 
const JWT_SECRET=process.env.JWT_SECRET_USER


const Router=express.Router
const UserRouter=Router();    //Router()  is just a function
// const UserRouter=express.Router()    //$$ it also works it just take one line code...
const app=express()










// ### signup ->     1.input validate schema using zod,     2.bcrypt password    3.store in db
UserRouter.post('/signup', async (req,res)=>{
    
    try{
    //--- step-1 input validate schema defining in zod
        const InputSchema=z.object({
                username:z.string().min(3).max(100),
                password:z.string().min(5),
                emailID:z.string().email().min(3)
            })
        
        const resultInpZOD=InputSchema.safeParse(req.body)

        if(!resultInpZOD.success){
            return res.status(400).json({
                message:'Invalid input formate...',
                error:resultInpZOD.error
            })
        }

        const {username, password, emailID}=req.body




    // -- step-2 : bcrypt password...
        const hashedpass = await bcrypt.hash(password, saltRounds)
        



    //--- step-3 : storing in db
        await UserModel.create({
            username:username,
            password:hashedpass,
            emailID:emailID
        })

        res.status(200).json({
            message:'You have successfully signed up.'
        })

    }catch(err){
        if(err.code===11000){  
            res.status(409).json({
                message:'Email already exist! Try with another emailID.'
            })
        }else{
            res.status(400).json({
                message:'error while signing up...',
                error:err
            })
        }

    }
})




// ----------------------------------- signin--------------------------------------------
UserRouter.post('/signin', async (req,res)=>{

    try{

        //--- input validation....
        const InputSigninSchema=z.object({
            password:z.string().min(5),
            emailID:z.string().email().min(3)
        })

        const resultInpSigninZOD=InputSigninSchema.safeParse(req.body)

            if(!resultInpSigninZOD.success){
                return res.status(400).json({
                    message:'Invalid input formate...',
                    error:resultInpSigninZOD.error
                })
            }
        
        const {password, emailID }=req.body


    // find the matching emailID becz gmail is unique thing

        const findUserGmail=await UserModel.findOne({
            emailID:emailID
        })

        if(!findUserGmail){
            return res.status(403).json({
                message:'Incorrect ceredentials -> email'
            })
        }

    //if email is found then check the entered password
        const passwordCheck=await bcrypt.compare(password, findUserGmail.password)

        if(!passwordCheck){
            return res.status(403).json({
                message:'Incorrect ceredentials -> password'
            })
        }



    //-- now generate token using the id (_id default mongoDB id)
        const token=jwt.sign({id:findUserGmail._id}, JWT_SECRET)

        res.status(200).json({
            message:'Signed in successfully.',
            Token:token
        })

    }catch(err){
        res.status(500).json({
            message:'Error in signing in.',
            error:err
        })

    }
 
})








UserRouter.post('/purchasing', UserMiddleware, async (req,res)=>{
    try {
        const { CourseToPurchase }=req.body


    //-- firstly checking is that course available or not.
        const courseAvailable=await CourseModel.find({
            _id:CourseToPurchase
        })

        if(courseAvailable.length===0){
            return res.status(400).json({
                Message:'Sorry sir, this course is not available.'
            })
        }


    //--checking is course is alredy purchased bu user...
        const isalreadyhave=await PurchaseModel.find({
            buyerUserID:req.userID,
            courseID:CourseToPurchase
        })

        if(isalreadyhave.length){
            return res.status(200).json({
                message:'Sir you have already purchased this course',
                CourseID:CourseToPurchase
            })
        }


        const buyerUserID=req.userID

        const purchasedCourse=await PurchaseModel.create({
            buyerUserID,
            courseID:CourseToPurchase
        })

        res.status(200).json({
            message:'You have successfully purchase the course, whose ID is: ',
            PurchasedCourseID:CourseToPurchase,
            purchasingID:purchasedCourse._id
        })

        
    } catch (err) {
        return res.status(400).json({
            message:'Errorin purchasing course',
            Error:err
        })
        
    }
})






UserRouter.get('/allpurchased', UserMiddleware, async (req,res)=>{
    try {
        const  allPurchasesByUserID =req.userID

        const allpurchases=await PurchaseModel.find({
            buyerUserID:allPurchasesByUserID
        })

        if(allpurchases.length===0){
            return res.status(200).json({
                message:"You have not purchased and courses. your course bucket is empty",
                CourseBucket:allpurchases
            })
        }

        res.status(200).json({
            mesaage:'Your all purchased courses are : ',
            YourPurchasedCourses:allpurchases
        })

    } catch (err) {
        res.status(400).json({
            message:'Error in finding the purchased courses',
            Error:err
           
        })
        
    }
})











export default UserRouter;