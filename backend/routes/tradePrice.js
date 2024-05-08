const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")

const TradePrice= db.tradePrices

router.get('/:supplierId/:medicineId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            console.log("In trade prices", req.params.medicineId, req.params.supplierId)
            const tradePrices = await TradePrice.findOne({
                where: {productId: req.params.medicineId, supplierId: req.params.supplierId  }
            });
            
            res.status(200).json(tradePrices.boxTradePrice)
        }catch (err) {
            res.status(500).json({
                message: "Error: could not get trade price.",
                error: err
              })
        }
    }else {
        res.status(401).json({
            message: "UNAUTHORIZED ACCESS"
        })
    }

})

router.post('/old/:supplierId/:medicineId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            const tradePrices = await TradePrice.update(
                {boxTradePrice: req.body.boxTradePrice, unitTradePrice: req.body.unitTradePrice},
                {where: {productId: req.params.medicineId, supplierId: req.params.supplierId  }
            });
    
            res.status(200).json()
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get shift.",
                error: err
              })
        }
    }else {
        res.status(401).json({
            message: "UNAUTHORIZED ACCESS"
        })
    }


})

router.post('/new/:supplierId/:medicineId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            const tradePrices = await TradePrice.create({
                productId: req.params.medicineId,
                supplierId:  req.params.supplierId,
                boxTradePrice: req.body.boxTradePrice,
                unitTradePrice: req.body.unitTradePrice
            });
    
            res.status(200).json()
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get shift.",
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
