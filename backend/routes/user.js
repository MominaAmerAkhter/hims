const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const User= db.users
const Doctor= db.doctors
//upon login, return a token.
//login for admin
router.post('/login', async(req,res) =>{

    console.log("request was made")
    const { userName, password } = req.body;

    try {
        console.log(req.body.userName)
        const user = await User.findOne({
            where: {userName}
        });
        
        if (!user) {
            return res.status(404).json('User not found');
        }
        // Verify password
        const passwordValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordValid) {
            return res.status(404).json('Incorrect email and password combination');
        }

        // Authenticate user with jwt
        const token = jwt.sign({ role: user.userRole, userName: user.userName}, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({
            userRole: user.userRole,
            accessToken: token,
        });
    } catch (err) {
        return res.status(500).send(err);
    }

})

//create a new user
router.post('/new',authenticateJWT, async(req,res) =>{

    console.log("user object")
    console.log(req.userObject.role)

    if(req.userObject.role=="Admin"){
        
        try {
            const { userName, password } = req.body;
            const userExists = await User.findOne({
                where: {userName}
            });
            console.log("user ex",userExists)
            if (userExists) {
                return  res.status(400).json({
                    message: "This username is already taken.",
                    error: err
                  })
            }
            if(req.body.userRole=="Doctor"){
                console.log("here1")
                await User.create({
                    userName: req.body.userName,
                    password: await bcrypt.hash(password, 15),
                    userRole: req.body.userRole,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                });
                console.log("here12")
                await Doctor.create({
                    doctorfName: req.body.firstName,
                    doctorlName: req.body.lastName,
                    specialization: req.body.specialization, 
                    gender: req.body.gender,
                    phoneNumber: req.body.phoneNumber,
                    licenseNumber: req.body.licenseNumber,
                    consultationFee: req.body.consultationFee
                })
                console.log("here13")
                return res.status(200).json({
                    message: "User Account Created"
                  })
                console.log("sent")
            }else{
                await User.create({
                    userName: req.body.userName,
                    password: await bcrypt.hash(password, 15),
                    userRole: req.body.userRole,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber
        
                });
                return res.status(200).json({
                    message: "User Account Created"
                  })
                console.log("sent")
            }

        } catch (err) {
            return res.status(500).json({
                message: "Error in creating user account",
                error: err
              })
        }
    }else {
        res.status(401).json({
            message: "UNAUTHORIZED ACCESS"
        })
    }


})

//get all users
router.get('/all', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin"){
        try{
            const allUsers = await User.findAll({attributes: ['id', 'firstName', 'lastName','userRole', 'phoneNumber']});

            res.status(200).json(allUsers)
        }catch (err) {
            res.status(500).json({
                message: "Error: could not get all users.",
                error: err
              })
        }
    }else {
        res.status(401).json({
            message: "UNAUTHORIZED ACCESS"
        })
    }


})

module.exports = router;
