
/*

Create a Course Selling App  -
Initialize a new Node.js project  *
Add Express, jsonwebtoken, mongoose to it as a dependency
Create index.js
Add route skeleton for user login, signup, purchase a course, sees all course, see the purchased course
Add routes for admin login, admin signup, create a course, delete a course, add course content.
Add middlewares for user and admin auth
Add a database (mongodb), use dotenv to store the database connection string
Define the schema for User, Admin, Course, Purchase
Complete the routes for user login, signup, purchase a course, see course

*/




//-------------------------------------------------------------------------------------------------------------------------------------

//#### importing --> important files and functions.

import dotenv from 'dotenv';
dotenv.config();      //**** accessing .env file information here 

import express from 'express';
import {connectDB, UserModel, AdminModel, CourseModel, PurchaseModel} from './database.js';
import AdminRouter from './routes/admin.js';
import UserRouter from './routes/user.js';
import CourseRouter from './routes/courses.js';

const app=express()
//app.use(express.json())  //$$ parse the incoming json i.e Real object you can work with and if we use this then
//we need to pass the body even in the GET method.

//--$$$$ ---this is good as compare to above.
// app.use(express.json({
//     strict: true,
//     verify: (req, res, buf) => {
//       if (buf.length === 0 && req.method !== 'GET') {
//         throw new Error('Empty body not allowed');
//       }
//     }
//   }));

//this works above not works?????
app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      express.json({
        strict: true,
        verify: (req, res, buf) => {
          if (buf.length === 0 && req.method !== "GET") {
            throw new Error("Empty body not allowed");
          }
        }
      })(req, res, next);
    } else {
      next();
    }
  });
  
  





//##  connecting database.
connectDB()






// ###----------------- handling requests for user route.
app.use('/user', UserRouter )



// ###------------------ handling requests for admin route.
app.use('/admin', AdminRouter )



// ###------------------ handling requests for courses route.
app.use('/course', CourseRouter )


















const PORT=process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Your server running on the port ${PORT}`)
} )



