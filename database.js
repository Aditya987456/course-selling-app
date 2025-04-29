import dotenv from 'dotenv';
dotenv.config();      //**** accessing .env file information here 



const MONGO_URL = process.env.DATABASE_URL;
console.log('MongoDB URL:', MONGO_URL);     //checking proper load from .env

import mongoose from 'mongoose';
import { Schema } from 'mongoose';




//-------- mongodb connection



export  const connectDB= async ()=>{
   await mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB!');
      }).catch(err => {
        console.error('Errorsss connecting to MongoDB! :', err);
      });  
}

console.log('MongoDB URL:', MONGO_URL);





//-------##  defining schema for user's collections (defininng structure for user table)  ----------

const Usercollection=new Schema({
    username:String,
    password:String,
    emailID:{type:String, required:true, unique:true}
})

export const UserModel=mongoose.model('User', Usercollection)   //**creating collection a/c to structure i.e schema








//---------------------------##  defining schema for Admin's collections  ------------------------------

const Admincollection=new Schema({
    username:String,
    password:String,
    emailID:{type:String, required:true, unique:true}
    
})

export const AdminModel=mongoose.model('Admin', Admincollection)








//---------------------------##  defining schema for Course's collections  ------------------------------

const Coursecollection=new Schema({
    title:{type:String, required:true, unique:true},
    description:{type:String, required:true},
    price:Number,
    imageURL:String,
    creatorAdminID:String
})

export const CourseModel=mongoose.model('Course', Coursecollection)







//---------------------------##  defining schema for Purchase's collections  ------------------------------

const Purchasecollection=new Schema({
    buyerUserID:String,
    courseID:String
})

export const PurchaseModel=mongoose.model('Purchase', Purchasecollection)
