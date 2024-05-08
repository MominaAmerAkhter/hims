const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const User= db.users
const Doctor= db.doctors


//get all users
router.get('/all', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        try{
            const allDoctors = await Doctor.findAll({attributes: ['id', 'doctorfName', 'doctorlName']});

            res.status(200).json(allDoctors)
        }catch (err) {
            res.status(500).json({
                message: "Error: could not get all doctors.",
                error: err
              })
        }
    }else {
        res.status(401).json({
            message: "You are not authorized to view all doctors."
        })
    }


})

module.exports = router;
