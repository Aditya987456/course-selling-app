import express from "express";
import { CourseModel, PurchaseModel, UserModel } from "../database.js";

import UserMiddleware from "../middleware/userMid.js";
import { userMiddleware } from "../../week-8-courseSellingApp/middleware/user.js";



const Router=express.Router
const CourseRouter=Router();    //Router()  is just a function
// const CourseRouter=express.Router()    //$$ it also works it just take one line code...
const app=express()





//------------------  preview all the courses available on the platform: NO need of  middlewares  -------------------
CourseRouter.get('/preview', async (req,res)=>{
    try{
        const PreviewCourses=await CourseModel.find()
        res.status(200).json({
            message:'All Available courses are - ',
            PreviewCourses
        })

    } catch(err){
        res.status(400).json({
            message:'Error in previewing the all courses...',
            Error:err
        })

    }
})







//-----get course details by using courseID :NO need of middleware to see specific course details  -------------------------------------

CourseRouter.get('/getdetails',  async (req,res)=>{
    try {

        const { courseID }= req.body
        const specificCourse=await CourseModel.find({
            _id:courseID
        })

        res.status(200).json({
            message:'Your specigic course details is : ',
            specificCourse      
        })

    } catch (error) {
        res.status(400).json({
            message:'Error in finding the the course',
            Error:error
        })  
    }
})










export default CourseRouter;