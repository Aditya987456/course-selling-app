
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
const app=express()

import {connectDB} from './database.js';









//--------- connecting database.
connectDB()






















const PORT=process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Your server running on the port ${PORT}`)
} )



