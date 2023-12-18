const express=require('express');
const User= require("../models/user")
const bcryptjs=require("bcryptjs");
const authRouter = express.Router();
const jwt=require('jsonwebtoken');

//sign up route
authRouter.post('/api/signup', async (req,res)=>{
    try{
        //get the data from the client
        const {name,email,password}= req.body;

        //checking if the email already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            res.status(400).json({msg: "User with same email already exists!"})
        }

        const hashedPassword=await bcryptjs.hash(password, 8);

        //creating user model
        let user = new User({
            email,
            password: hashedPassword,
            name,
        })

        //post that data in database
        user=await user.save();

         //return that data to the user
        res.json(user);
    }
    catch(e){
        res.status(500).json({ error: e.message });
    }
})

//sign in route
authRouter.post('/api/signin', async (req,res)=>{
    try{
        //get the data from the client
        const {email,password}= req.body;

         //checking if the email exists
         const user= await User.findOne({email});  
         if(!user){
            return res.status(400).json({msg: "User with this email does not exists!"})
         }

         const isMatch=await bcryptjs.compare(password,user.password);
         if(!isMatch){
                return res.status(400).json({msg: "Incorrect password."})  
         }

         const token = jwt.sign({id: user._id},"passwordKey");
         res.json({token, ...user._doc});
    }catch(e){
        res.status(500).json({ error: e.message });
    }
})

//valid token route
authRouter.post('/api/tokenIsValid', async (req,res)=>{
    try {
        const token=req.header('x-auth-token');
        if(!token) return res.json(false);

        const isVerified=jwt.verify(token,'passwordKey');
        if(!isVerified) return res.json(false);

        const user=await User.findById(isVerified.id)
        if(!user) return res.json(false);

        res.json(true);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

//get user data


module.exports = authRouter;