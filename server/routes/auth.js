//jshint esversion:6

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../keys");
const requireLogin = require('../middleware/requireLogin');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "brute.force.nhv@gmail.com",
        pass: "zgaqbkylxtvygdhs"
    }
})

router.post("/signup", (req, res) => {
    const { name, email, password,pic } = req.body;
    if (!email || !password || !name) {
        res.status(422).json({ error: "please add all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user is already exist with the email" });
            }

            bcrypt.hash(password, 12)  //for hashing the password(password will not shows now on database)
            .then(hashedpassword => {

                const user = new User({
                    email,
                    password:hashedpassword,
                    name,
                    pic
                });

                user.save() 
                .then(user => {
                    res.json({ message: "saved Sucessfully" });
                })
                .catch(err => {
                    console.log(err);
                });

            });

        });

});

//Login/Signin
router.post("/login",(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password)
    {
       return  res.status(422).json({error : "please add email and password"});
    }

    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
             return res.status(422).json({error : "Invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch)
            {
                // res.json("Sucessfully signed in");
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET); //saving user id to _id 
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else
            {
                return res.status(422).json({error : "Invalid email or password"});
            }
        })
        .catch(err=>{
            console.log(err);
        });
    });

});

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User don't exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"brute.force.nhv@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})



module.exports = router;


