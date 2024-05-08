const express = require('express')
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")


const Shift= db.shifts
const Doctor= db.doctors

//Starting a new shift
router.post('/new', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        try{
            console.log("new shift", req.body.doctorId,req.userObject.userName,req.body.doctorfName,req.body.doctorlName)
            const shift= await Shift.create({
                shiftCreator: req.userObject.userName,
                doctorId: req.body.doctorId,
                doctorfName: req.body.doctorfName,
                doctorlName: req.body.doctorlName,
                startTime: Date.now(),
                shiftStatus: "open"
            })
            console.log("here")
            res.status(200).json({
                shiftId: shift.shiftId,
                message: "Shift started successfully."
            })
        }catch (err) {
            res.status(401).json({
                message: "Error: Shift not created",
                error: err
                })
        }
    }else {
        res.status(401).json({
            message: "UNAUTHORIZED ACCESS"
        })
    }



})

//Ending a shift
router.post('/end', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        try{

            await Shift.update({ endTime: Date.now() }, {
                where: {
                    shiftId: req.body.shiftId
                }
            });
            const shift = await Shift.findOne({ where: { shiftId: req.body.shiftId } });
    
            res.status(200).json({
                shift: shift,
                message: "Shift ended successfully."
            })
        }catch (err) {
            res.status(401).json({
                message: "Error: Shift not ended.",
                error: err
                })
        }
    }else {
        res.status(401).json({
            message: "UNAUTHORIZED ACCESS"
        })
    }



})


//get open shifts of all doctors
router.get('/open', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Receptionist" || req.userObject.role=="Doctor" || req.userObject.role=="Admin"){
        try{    
            const openShifts = await Shift.findAll({ where: { shiftStatus: "open" } }); //can be more than one
    
            res.status(200).json(openShifts)
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get all shifts.",
                error: err
              })
        }

    }else{
        res.status(401).json({message: "UNAUTHORIZED ACCESS"})
    }

})

//get all shifts in parts (PAGINATION)
router.get('/:indexOfFirstRecord', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Receptionist" || req.userObject.role=="Doctor" || req.userObject.role=="Admin"){
        const indexOfFirstRecord= Number(req.params.indexOfFirstRecord)
        console.log("indexOfFirstRecord", indexOfFirstRecord)
        console.log("in here")
        try{
    
            // const numberOfRecords= await Shift.count()
    
            const {count, rows} = await Shift.findAndCountAll({
                limit: 10,
                offset: indexOfFirstRecord,
                order: [['shiftId', 'DESC']]
              });
    
            console.log("blah blah")
            const allShifts= rows
            const numberOfRecords= count
    
            res.status(200).json({numberOfRecords,allShifts})
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get all shifts.",
                error: err
              })
        }
    }else{
        res.status(401).json({message: "UNAUTHORIZED ACCESS"})
    }


})

//get shift by ID
router.post('/id', authenticateJWT, async(req,res) =>{

    if(req.userObject.role=="Receptionist" || req.userObject.role=="Doctor" || req.userObject.role=="Admin"){
        try{
            const shift = await Shift.findOne({ where: { shiftId: req.body.shiftId } });
    
            res.status(200).json(shift)
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get shift.",
                error: err
              })
        }
    }else{
        res.status(401).json({message: "UNAUTHORIZED ACCESS"})
    }


})

module.exports = router;