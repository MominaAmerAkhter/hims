const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const ProductSaleInvoice= db.productSaleInvoices
const Medicine= db.medicines

//get all users
router.post('/createSaleInvoice', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            console.log("hello  in here", req.body.products)
            const invoice= await ProductSaleInvoice.create({
                dateTime: Date.now(),
                patientPhone: req.body.patientPhone,
                overallDiscount: req.body.overallDiscount,
                grandTotal: req.body.grandTotal,
                products: req.body.products
            })

            let productsToBeRemoved= req.body.products
            for(i=0; i<productsToBeRemoved.length; i++){

                let product= productsToBeRemoved[i]

                const medicine = await Medicine.decrement('boxQuantity', {
                    by: product.totalQuantityToBuy,
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


router.get('/all', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            const allSaleInvoices = await ProductSaleInvoice.findAll();
    
            res.status(200).json(allSaleInvoices)
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get allSaleInvoices.",
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
