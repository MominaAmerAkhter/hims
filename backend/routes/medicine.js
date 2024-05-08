const express = require('express')
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")


const Medicine= db.medicines
const TradePrice= db.tradePrices

//get medicines inventory
router.get('/all', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Pharmacy"){
        try{
            const allMedicines = await Medicine.findAll();
    
            res.status(200).json(allMedicines)
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get all medicines.",
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }


})

router.get('/supplierMedicines/:supplierId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Pharmacy" || req.userObject.role=="Admin"){
        try{
            const allMedicines = await Medicine.findAll({where: {supplierId: req.params.supplierId }});

            const tradePrices = await TradePrice.findAll({
                where: {supplierId: req.params.supplierId },
                attributes: ['productId','boxTradePrice']
            });

        // Now, combine the tradePrices with allMedicines based on productId
        const medicinesWithTradePrices = allMedicines.map(medicine => {
            const tradePrice = tradePrices.find(tp => tp.productId === medicine.medicineId);
            return {
            ...medicine.toJSON(),
            boxTradePrice: tradePrice ? tradePrice.boxTradePrice : null
            };
        });
            
    
            res.status(200).json(medicinesWithTradePrices)
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get supplier medicines.",
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }


})

router.post('/old/:medicineId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Pharmacy" || req.userObject.role=="Admin"){
        try{
            const medicine = await Medicine.update(
                {retailPrice: req.body.retailPrice},
                {where: {medicineId: req.params.medicineId }
            });
    
            res.status(200).json()
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get shift.",
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }


})

// router.post('/new/:medicineId', authenticateJWT, async(req,res) =>{

//     const medicine = req.body.medicine
//     try{
//         const medicine = await TradePrice.create({
//             medicineId: req.params.medicineId,
//             medicineName: medicine.medicineName,
//             medicineType: medicine.medicineType,
//             boxQuantity: 0,
//             unitPerBoxQuantity: req.body.boxTradePrice,
//             retailPrice: req.body.retailPrice
//         });
//         res.status(200).json()
//     }catch (err) {
//         res.status(401).json({
//             message: "Error: could not get shift.",
//             error: err
//           })
//     }

// })

module.exports = router;