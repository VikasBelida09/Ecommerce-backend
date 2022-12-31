const router=require('express').Router();
 const User=require('../models/User');
 const cryptoJs=require('crypto-js');
 const jwt=require('jsonwebtoken');

 router.post('/register',async (req,res)=>{
    const {username,email, password}=req.body;
    if(!username || !password)return res.status(400);
    const newUser=new User(
        {
            username,
            email,
            password: cryptoJs.AES.encrypt(password,process.env.PASS_SEC).toString()
        }
    );
    try {
        const savedUser= await newUser.save();
        res.status(201).json(savedUser); 
    } catch (error) {
        console.log(error) 
    }
 })
 router.post('/login',async (req,res)=>{
    const {username , password}=req.body;
    try {
        const user=await User.findOne({username});
        if(!user)return res.status(401).json("no username found");
    
        const hashedPassword=cryptoJs.AES.decrypt(user.password,process.env.PASS_SEC);
        const pswd=hashedPassword.toString(cryptoJs.enc.Utf8)
        if(password!==pswd)return  res.status(401).json("incorrect password");
        const accessToken=jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SEC,{expiresIn:'3d'});
         const {password:originalPassword, ...rest }=user._doc;
        return  res.status(200).json({...rest,accessToken});
    } catch (error) {
        res.status(500).json(error);
    }
 
 })
module.exports=router;