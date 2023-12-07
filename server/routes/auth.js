const express=require('express');
const User= require("../models/user")

const authRouter = express.Router();

authRouter.post('/api/signup', async (req,res)=>{
    //get the data from the client
    const {name,email,password}= req.body;

    //checking if the email already exists
    const existingUser=await User.findOne({email});
    if(existingUser){
        res.status(400).json({msg: "User with same email already exists!"})
    }

    //creating user model
    let user = new User({
        email,
        password,
        name,
    })

    user=await user.save();
    res.json(user);
    //post that data in database

    //return that data to the user
})

module.exports = authRouter;