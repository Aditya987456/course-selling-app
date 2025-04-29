import express from "express";
import { z } from 'zod'
import { UserModel, AdminModel, CourseModel, PurchaseModel } from "../database.js";
import bcrypt from "bcrypt";
const saltRounds=5
import jwt from 'jsonwebtoken'
import AdminMiddleware from "../middleware/adminMid.js";

import dotenv from 'dotenv';
import { userModel } from "../../week-7/db.js";
dotenv.config();      //**** accessing .env file information here 
const JWT_SECRET=process.env.JWT_SECRET_ADMIN
// console.log('secret',JWT_SECRET)


const Router=express.Router
const AdminRouter=Router();    //Router()  is just a function
// const UserRouter=express.Router()    //$$ it also works it just take one line code...
const app=express()










// ### signup ->     1.input validate schema using zod,     2.bcrypt password    3.store in db
AdminRouter.post('/signup', async (req,res)=>{
    
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
                message:'ADMIN:Invalid input formate...',
                error:resultInpZOD.error
            })
        }

        const {username, password, emailID}=req.body




    // -- step-2 : bcrypt password...
        const hashedpass = await bcrypt.hash(password, saltRounds)
        



    //--- step-3 : storing in db
        await AdminModel.create({
            username:username,
            password:hashedpass,
            emailID:emailID
        })

        res.status(200).json({
            message:'ADMIN: You have successfully signed up.'
        })

    }catch(err){
        if(err.code===11000){  
            res.status(409).json({
                message:'ADMIN: Email already exist! Try with another emailID.'
            })
        }else{
            res.status(400).json({
                message:'ADMIN: error while signing up...',
                error:err
            })
        }

    }
})







// -------#####-------------- signin--------------------------
AdminRouter.post('/signin', async (req,res)=>{

    try{

        //--- input validation....
        const InputSigninSchema=z.object({
            password:z.string().min(5),
            emailID:z.string().email().min(3)
        })

        const resultInpSigninZOD=InputSigninSchema.safeParse(req.body)

            if(!resultInpSigninZOD.success){
                return res.status(400).json({
                    message:'ADMIN: Invalid input formate...',
                    error:resultInpSigninZOD.error
                })
            }
        
        const {password, emailID }=req.body


    // find the matching emailID becz gmail is unique thing

        const findAdminGmail=await AdminModel.findOne({
            emailID:emailID
        })

        if(!findAdminGmail){
            return res.status(403).json({
                message:'ADMIN: Incorrect ceredentials -> email'
            })
        }

    //if email is found then check the entered password
        const passwordCheck=await bcrypt.compare(password, findAdminGmail.password)

        if(!passwordCheck){
            return res.status(403).json({
                message:'ADMIN: Incorrect ceredentials -> password'
            })
        }



    //-- now generate token using the id (_id default mongoDB id)
        const token=jwt.sign({id:findAdminGmail._id}, JWT_SECRET)

        res.status(200).json({
            message:'ADMIN: Signed in successfully.',
            Token:token
        })

    }catch(err){
        res.status(500).json({
            message:'ADMIN: Error in signing in.',
            error:err.message
        })

    }
 
})





//----------------------------------- newCourse  ---------------------------------------------------
AdminRouter.post('/newCourse', AdminMiddleware, async (req,res)=>{

    try{

        //--- creating schema for input validation of course...using zod
        const newCourseSchema=z.object({
            title:z.string(),
            description:z.string(),
            price:z.number(),
            imageURL:z.string()
        })

        const newCourseInputValidation=newCourseSchema.safeParse(req.body)

        if(!newCourseInputValidation.success){
            res.status(400).json({
                message:`Invalid course's input formate...`,
                error:newCourseInputValidation.error
            })
        }

        const { title, description, price, imageURL }=req.body
        const creatorAdminID=req.adminID

    //$$$$ Check if the course with the same title already exists
          const existingCourse = await CourseModel.findOne({ title });
          if (existingCourse) {
              return res.status(400).json({
                  message: 'Course with this title already exists.'
              });
          }


        const newCourse=await CourseModel.create({
            title:title,
            description,
            price,
            imageURL,
            creatorAdminID
        })

        res.status(200).json({
            message:'You have successfully created a course.',
            CourseID:newCourse._id
        })
            
        }catch(err){

            if(err.code===11000){
                res.status(400).json({
                    message:'Course is already exist.'
                })
            }else{
                res.status(500).json({
                    message:"error in creating course",
                    Error:err
                })
            }
           
        }
})






//----------------------------- updating course  -----------------------------------------------------
AdminRouter.put('/updateCourse', AdminMiddleware, async (req,res)=>{
    try{
        const { CourseID }=req.body
        const adminID=req.adminID

        const { title, description, price, imageURL}=req.body

        const findCourse=await CourseModel.updateOne({
            creatorAdminID:adminID,
            _id:CourseID
        },{
            title,
            description,
            price,
            imageURL
        })

        res.status(200).json({
            message:'Successfully updated the course.',
            courseID:findCourse._id
        })

    }catch(err){
        res.status(400).json({
            message:'Error in updating the course.',
            Error:err
        })

    } 
})






//--------------  get all course that created by a specific admin i.e Admin can see his/her all courses  -------------------
AdminRouter.get('/allCourse', AdminMiddleware, async (req,res)=>{
    try {

        const creatorAdminID =req.adminID

        const AllCreatorCourses=await CourseModel.find({
            creatorAdminID:creatorAdminID
        })

        res.status(200).json({
            message:'Hi admin your all created courses are \n ',
            AllCreatorCourses
        })

    } catch (err) {
        res.status(400).json({
            message:'Error in finding all the courses',
            Error:err
        })
        
    }


    
})






//---------------  delete the course by using id ..-->??? can also implement to delete using title...
AdminRouter.delete('/deleteCourse', AdminMiddleware, async (req,res)=>{

    try {

        const { courseIDforDelete }=req.body

    //-- check if there is no course then message like no course is matching with your id
        const matchcourse=await CourseModel.find({
            _id:courseIDforDelete
        })
        if(matchcourse.length===0){
            res.status(400).json({
                message:'Not available your entered course. May be deleted earlier...'
            })
        }

        await CourseModel.deleteOne({
            _id:courseIDforDelete
        })

        res.status(200).json({
            message:'Successfully deleted the course...'
        })
        
    } catch (err) {
        res.status(400).json({
            message:"Error in deleting the course.",
            Error:err
        })
        
    }
    
})






export default AdminRouter;