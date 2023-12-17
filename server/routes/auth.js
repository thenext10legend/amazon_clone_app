const express=require('express');
const User= require("../models/user")
const bcryptjs=require("bcryptjs");
const authRouter = express.Router();

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

module.exports = authRouter;