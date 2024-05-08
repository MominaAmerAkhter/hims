const express = require('express')
const router = express.Router()
const db= require('../models')
const authenticateJWT = require("../middleware/verifyJwt")


const Encounter= db.encounters
const Shift= db.shifts
const Doctor= db.doctors
const Patient= db.patients

//get patient history
router.get('/patienthistory/:patientId', authenticateJWT, async(req,res) =>{

    const reqPatientId= req.params.patientId
    console.log(req.userObject.role)

    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin"){
        try{    
            console.log("patient Id is " + reqPatientId)
            const allEncounters = await Encounter.findAll({ where: { patientId: reqPatientId } ,
                attributes: ['dateTime', 'doctorId', 'bloodPressure', 'temperature', 'weight', 'BSR', 'heartRate', 'prescribedMeds',
            'notes', 'paymentRecieved' ]}); //can be more than one
            res.status(200).json(allEncounters) // this is causing error because of null in prescribed meds
            console.log("response sent")
        }catch (err) {
            res.status(404).json({
                message: "Error: could not get encounters." + err,
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }


})

//get all patients in a shift
router.post('/shiftencounters', authenticateJWT, async(req,res) =>{

    const reqShiftId= req.body.shiftId
    console.log(req.userObject.role, " ", reqShiftId)
    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        
        try{  
            
            const shift = await Shift.findOne({
                where: {shiftId: reqShiftId}
            });
            const allEncounters = await Encounter.findAll({ where: { shiftId: reqShiftId } ,
                attributes: ['visitId','tokenNo', 'patientId', 'dateTime', 'payable', 'paymentRecieved' ]});
                

                
            if(allEncounters.length>0){

                for(i=0; i< allEncounters.length; i++){
                    encounter= allEncounters[i]
                    const patient = await Patient.findOne({ where: { patientId: encounter.patientId } ,
                        attributes: ['firstName', 'lastName', 'phoneNumber']});

                    // Convert the Sequelize instance to a plain object
                    let encounterData = encounter.get({ plain: true });

                    console.log("encounter data", encounterData, patient)
                    // Add the additional fields to the plain object
                    encounterData.firstName = patient.firstName;
                    encounterData.lastName = patient.lastName;
                    encounterData.phoneNumber = patient.phoneNumber;

                    // Replace the original encounter object with the modified plain object
                    allEncounters[i] = encounterData;
                    
                }

                console.log("before sending", allEncounters)
                res.status(200).json(allEncounters) 

            }else{
                res.status(404).json({
                    message: "No Encounters against this shift"
                  })
            }
           
    
        }catch (err) {
            res.status(401).json({
                message: "Error: could not get encounters." + err,
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }


})

//update an old encounter. // add prescription
router.post('/update/:visitId', authenticateJWT, async(req,res) =>{

    const visitId= req.params.visitId
    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin"){
        
        try{

            console.log(req.body)
            const updatedEncounter = await Encounter.update(
                {
                    temperature: req.body.temperature,
                    bloodPressure: req.body.BP,
                    weight: req.body.weight,
                    BSR: req.body.BSR,
                    heartRate: req.body.heartRate,
                    notes: req.body.notes,
                    prescribedMeds: req.body.prescriptionMeds,
                    paymentRecieved: req.body.paymentRecieved

                },
                {
                  where: { visitId: req.params.visitId },
                }
            )

            res.status(200).json({})
        }catch(err){
            console.log("catch", err)
            res.status(404).json({
                message: "Error: could not update encounter." + err,
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }

})

router.post('/updatefee/:visitId', authenticateJWT, async(req,res) =>{

    const visitId= req.params.visitId
    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        
        try{
            const updatedEncounter = await Encounter.update(
                {
                    paymentRecieved: req.body.paymentRecieved

                },
                {
                  where: { visitId: req.params.visitId },
                }
            )

            res.status(200).json({})
        }catch(err){
            console.log("catch", err)
            res.status(404).json({
                message: "Error: could not update encounter fee." + err,
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }

})


//post a new encounter
router.post('/new/:shiftId', authenticateJWT, async(req,res) =>{

    const reqShiftId= req.params.shiftId
    const tokenPatients= req.body
    if(req.userObject.role=="Doctor" || req.userObject.role=="Admin" || req.userObject.role=="Receptionist"){
        
        try{  
            var tokenNumber=1;
            const shift = await Shift.findOne({
                where: {shiftId: reqShiftId}
            });

            const doctorFee = await Doctor.findOne({ where: { id: shift.doctorId } ,
                attributes: ['consultationFee']}); 

            console.log("doctor's fee i", doctorFee)



            const allEncounters = await Encounter.findAll({ where: { shiftId: reqShiftId } ,
                attributes: ['tokenNo']}); 

            if(allEncounters.length>0){
                
                const lastToken= Math.max(...allEncounters.map(encounter => encounter.tokenNo))
                console.log("last token", lastToken)

                tokenNumber= lastToken +1

                for(i=0; i< tokenPatients.length; i++){
                    tokenPatient= tokenPatients[i]
                    const encounter= await Encounter.create({
                        shiftId: reqShiftId,
                        patientId: tokenPatient.patientId,
                        dateTime: Date.now(),
                        tokenNo: tokenNumber,
                        doctorId: shift.doctorId,
                        originalfee: doctorFee.consultationFee,
                        payable:  doctorFee.consultationFee,
                        paymentRecieved: 0,
                        payStatus: false
                    })

                    tokenNumber= tokenNumber+1
                }
                res.status(200).json({}) 

            }else{
                // no encounters are present for the shift yet. first token number will be 1
                console.log("First token")
                for(i=0; i< tokenPatients.length; i++){
                    tokenPatient= tokenPatients[i]
                    const encounter= await Encounter.create({
                        shiftId: reqShiftId,
                        patientId: tokenPatient.patientId,
                        dateTime: Date.now(),
                        tokenNo: tokenNumber,
                        doctorId: shift.doctorId,
                        originalfee: doctorFee.consultationFee,
                        payable:  doctorFee.consultationFee,
                        paymentRecieved: 0,
                        payStatus: false
                    })

                    tokenNumber= tokenNumber+1
                }

                res.status(200).json({}) 
            }
           
    
        }catch (err) {
            console.log("hello")
            res.status(401).json({
                message: "Error: could not get encounters." + err,
                error: err
              })
        }
    }else{
        res.status(401).send("UNAUTHORIZED ACCESS")
    }


})
module.exports = router;