const express = require('express')
const app = express()
const mongoose = require('mongoose');
 const userRouter=require('./src/router/user')
 var cors = require('cors')
require('dotenv').config()

app.use(cors("*"))
 app.use(express.json())

app.get('/',(req,res)=>{
    res.sendFile("./src/templates/index.html",{root:'./'})
})

app.use('/user',userRouter)

const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.DB_CONNECTION}`);
        console.log("CONNECTED");
      } catch (error) {
        console.log("SOMETHING WHEN WRONG");
        handleError(error);
      }
}
connectDB()
app.listen(process.env.PORT,()=>{
    console.log(`Server run successfull on http://localhost:${process.env.PORT}`);
})
