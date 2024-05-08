const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const ProductRefund= db.productRefunds
const Medicine= db.medicines

router.post('/makeRefund', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            console.log("hello in refund")
            const invoice= await ProductRefund.create({
                dateTime: Date.now(),
                patientPhone: req.body.patientPhone,
                refundedAmount: req.body.refundedAmount,
                products: req.body.products
            })

            let productsToBeAdded= req.body.products
            for(i=0; i<productsToBeAdded.length; i++){

                let product= productsToBeAdded[i]

                const medicine = await Medicine.increment('boxQuantity', {
                    by: product.refundQty,
                    where: {
                      medicineId: product.medicineId
                    }
                  });

            }
            
            res.status(200).json()
        }catch (err) {
            res.status(500).json({
                message: "Error: could not save refund",
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
