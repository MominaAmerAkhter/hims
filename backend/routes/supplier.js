const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const Supplier= db.suppliers

//get all suppliers
router.get('/all', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            const allSuppliers = await Supplier.findAll();

            res.status(200).json(allSuppliers)
        }catch (err) {
            res.status(500).json({
                message: "Error: could not get all suppliers.",
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
