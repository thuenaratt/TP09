const express = require('express')
const router = express.Router()
const User=require('../model/user')
const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 require("dotenv").config();
 const {check_register,check_login,check_credentail}=require('../middleware/check_user_req')
 const TokenValidation = require('../middleware/Token')

// router.post('/Register', async(req,res)=>{
//     const user=new User({
//          username:"Test",
//             email:"Test",
//             password:"Test",
//             firstname:"Test",
//             lastname:"Test",
    
//     })
//     try{
//             const userSaved=await user.save();
           
//             res.json(userSaved)
//         }catch{
//            res.status(see).send({"Message":"Not work"})

//         }
//         res.json({msg:"hello login"})
    
       

    
// })



router.post('/login',check_login,async(req,res)=>{
    const data=req.body;

    let user=await User.findOne({username:data.EUID},{password:0})
    if(!user) user=await User.findOne({email:data.EUID},{password:0})
    if(!user) return res.status(400).send({"message":"Email or Password invalid"})
    
    const token=generateGToken({id:user._id})
    res.json({
        token:token,
        user:user,
        msg:"Login successfull"
    })
})

router.post('/register', check_register,check_credentail,async(req,res)=>{

    
    const data=req.body
    if(data.password!=data.repeat_password) return  res.status(400).send({"msg":"Password and Repeat password not match"})
    const salt= await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(data.password,salt)
    const user=new User({
        username:data.username,
        email:data.email,
        password:hashPassword,
        firstname:data.firstname,
        lastname:data.lastname,
    })

    try{
        const userSaved=await user.save();
        // console.log(userSaved)
        const token=generateGToken({id:userSaved._id})
        res.json({
            token:token,
            user:userSaved,
            msg:"Register successfull"
        })
    }catch(err){
        res.send({"Message":err});
    }

    

})
// router.post('/logout',check_logout,async(req,res)=>{
//     const data=req.body;

//     let user=await User.findOne({username:data.EUID},{password:0})
//     if(!user) user=await User.findOne({email:data.EUID},{password:0})
//     if(!user) return res.status(400).send({"message":"Email or Password invalid"})
    
//     const token=generateGToken({id:user._id})
//     res.json({
//         token:token,
//         user:user,
//         msg:"Logout successfull"
//     })
// })
router.get("/me",TokenValidation,(req,res)=>{
    const user=req.user;
    delete user.password;
    res.json(req.user)
})
const generateGToken=(obj)=>{
    return jwt.sign(obj,process.env.ACCESS_TOKEN_SECRET)
}



module.exports = router