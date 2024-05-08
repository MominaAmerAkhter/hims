const express = require('express')
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")


const Patient= db.patients
const Encounter= db.encounters

//Registering a new pateint.  -> corner case: check if patient is already registered
router.post('/new', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Receptionist" || req.userObject.role=="Admin"){
        try{
            const patient= await Patient.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                gender: req.body.gender,
                age: req.body.age,
                houseAddress: req.body.houseAddress,
                regDate: Date.now()
            })
    
            res.status(200).json({
                message: "Patient registered successfully."
            })
        }catch (err) {
            res.status(404).json({
                message: "Error: User not registered",
                error: err
              })
        }
    }else{
        res.status(401).json({message: "UNAUTHORIZED ACCESS"})
    }


})

//get all patients
router.get('/all', authenticateJWT, async(req,res) =>{

        try{
            const allPatients = await Patient.findAll();
    
            res.status(200).json(allPatients)
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get all patients.",
                error: err
              })
        }
   
})

//search a patient by phone number
router.get('/searchbyphone/:phoneNumber', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        try{    
            const allPatients = await Patient.findAll({where: {phoneNumber: req.params.phoneNumber}}); //can be more than one
    
            res.status(200).json(allPatients)
            
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get patient.",
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }

})

//search a patient by ID
router.get('/searchbyid/:patientId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        try{    
            const allPatients = await Patient.findOne({where: {patientId: req.params.patientId}}); //can be more than one
    
            res.status(200).json(allPatients)
            
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get patient.",
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }

})

//get patient by id
router.get('/patientinfobyid/:patientId', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){

        try{    
            const patient = await Patient.findOne({where: {patientId: req.params.patientId}}, {attributes: ['phoneNumber', 'houseAddress', 'age'] }); //can be more than one
    
            const { count, rows } = await Encounter.findAndCountAll({
                where: {patientId: req.params.patientId}
              });
            console.log("Count is", count, rows)
    
            var totalPayments=0
            for(i=0; i<rows.length; i++){
                var temp= rows[i].paymentRecieved
                totalPayments= totalPayments + temp
            }
    
            let patientData = patient.get({ plain: true });
            patientData.totalVisits= count
            patientData.totalPayments= totalPayments
    
            res.status(200).json(patientData)
            
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get patient.",
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }

})

module.exports = router;
