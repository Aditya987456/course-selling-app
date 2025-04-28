import dotenv from 'dotenv';
dotenv.config();      //**** accessing .env file information here 



const MONGO_URL = process.env.DATABASE_URL;
console.log('MongoDB URL:', MONGO_URL);     //checking proper load from .env

import mongoose from 'mongoose';





export const connectDB=()=>{
    mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB!');
      }).catch(err => {
        console.error('Errorsss connecting to MongoDB! :', err);
      });  
}

console.log('MongoDB URL:', MONGO_URL);




