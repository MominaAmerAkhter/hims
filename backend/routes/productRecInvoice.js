const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const ProductRecInvoice= db.productRecInvoices
const Medicine= db.medicines

router.post('/createInvoice', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            console.log("hello in rec")
            const invoice= await ProductRecInvoice.create({
                dateTime: Date.now(),
                supplierId: req.body.supplierId,
                overallDiscount: req.body.overallDiscount,
                grandTotal: req.body.grandTotal,
                products: req.body.products
            })

            let productsToBeAdded= req.body.products
            for(i=0; i<productsToBeAdded.length; i++){

                let product= productsToBeAdded[i]

                const medicine = await Medicine.increment('boxQuantity', {
                    by: product.totalQuantity,
                    where: {
                      medicineId: product.medicineId
                    }
                  });

            }
            
            res.status(200).json()
        }catch (err) {
            res.status(500).json({
                message: "Error: could not save invoice",
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
