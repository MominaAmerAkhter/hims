import { Link,useNavigate, useParams } from "react-router-dom";
import "../css/SpecificShift.css";
import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import { Modal} from "react-bootstrap";
import TextField from '@mui/material/TextField';
import { FormControl, FormLabel,FormControlLabel, Select, MenuItem, FormGroup, Checkbox, RadioGroup, Radio} from '@mui/material';

import NavBarAdmin from "./NavBarAdmin";

const SpecificShift = () => {

    // const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    // const usertype= sessionStorage.getItem("userRole")
    // const shiftId= sessionStorage.getItem("shiftId")

    const userName= useParams().username
    const usertype= useParams().userrole
    const shiftId= useParams().shiftid


    const navigate= useNavigate()

    const [callEffect,setCallEffect]= useState(false) 
    const [callEncounter,setCallEncounter]= useState(false) 
    const [callShift,setcallShift]= useState(false) 
    const [callSearchPatientEffect, setcallSearchPatientEffect] = useState(false)

    const[openPhoneModal, setOpenPhoneModal] = useState(false);
    const[openPatientsModal, setopenPatientsModal] = useState(false);
    const[openPaymentModal, setopenPaymentModal] = useState(false);

    const [encounters, setEncounters] = useState([]);
    const [shift, setShift] = useState();
    const [patients, setPatients] = useState([]); //patients returned by search through phone number or id
    const [phoneNumber, setPhoneNumber] = useState(); //patient's phone number that is used to search in order to givee token.
    const [patientId, setPatientId] = useState();
    const [tokenPatient, settokenPatient] = useState([]); //patient selected to alot token to
    const [paymentEncounter, setPaymentEncounter] = useState()
    const [fee, setFee] = useState("");

    const [searchInput, setSearchInput] = useState("");

    const [patientSearch, setPatientSearch] = useState("Search by ID");


    async function createToken() {  
        console.log(`in create token`);
        const response = await fetch(
            `http://localhost:4000/encounter/new/${shiftId}`,
            {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${tokenID}`,
                "Content-Type": "application/json"
                },
            body: JSON.stringify(tokenPatient)
            }
        );
        if(response.status===200){
            console.log("in create token resp 200")
            setCallEncounter(!callEncounter)
            settokenPatient([])
            setopenPatientsModal(false)
            return response.json()
        }else{
            console.log("in error area create token")
            const err= (response.json()).message
        }   
    }
    
    async function searchPatientForToken(httpRequest) {

        setOpenPhoneModal(false)
        console.log(`in find patient by phone number or id`);
        var response = await fetch(
            `http://localhost:4000/patient/${httpRequest}`,
            {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${tokenID}`,
                "Content-Type": "application/json"
                }
            }
        );
        if(response.status===200){
            console.log("in resp 200")
            // console.log(response.json())
            return response.json()
        }else{
            const err= (response.json()).message
            console.log(err)
        }   
    };

    const searchAllPatients = () => {


        var httpRequest=``
        if(patientSearch==="Search by Phone Number"){
            httpRequest= `searchbyphone/${phoneNumber}`
        }else if(patientSearch==="Search by ID"){
            httpRequest= `searchbyid/${patientId}`
        }

        searchPatientForToken(httpRequest).then((response)=>{
            var allPatients= response
            allPatients = allPatients.map((patient) => ({
                ...patient,
                selectStatus: false,
                }));
            setPatients(allPatients)
            console.log( "Patients are",patients)
            setopenPatientsModal(true)
        })
    
    }


    useEffect(() => {
        async function getShift() {
            console.log(`in get shift by ID`);
            const response = await fetch(
                "http://localhost:4000/shift/id",
                {
                method: "POST",
                withCredentials: true,
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${tokenID}`,
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                    shiftId: shiftId
                })
                }
            );
            if(response.status===200){
                return response.json()
            }else{
                const err= (response.json()).message
            }   
        }

        getShift().then((response)=>{
            const shift= response
            setShift(shift)
            console.log("shift is ", shift)
        })
    },  [callShift])


    useEffect(() => {
        async function getShiftEncounters() {
            console.log(`in shift encounter`);
            const response = await fetch(
                "http://localhost:4000/encounter/shiftencounters",
                {
                method: "POST",
                withCredentials: true,
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${tokenID}`,
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                    shiftId: shiftId
                })
                }
            );
            if(response.status===200){
                return response.json()
            }else if (response.status===404){
                const err= "No patients found against this shift"
                console.log("ERROR",err)
            }else if (response.status===401){
                const err= "Unauthorized Access"
                console.log("ERROR",err)
            }    
        }

        getShiftEncounters().then((response)=>{
            const allEncounters= response
            console.log("encounters is ", encounters)
            setEncounters(allEncounters)
        })
    }, [callEncounter]);

    const isCheckedPatient = (patient) => {

        if(patient.selectStatus===false){ 
            return false
        }else{
            return true
        }
    }

    const handlePatientSelectionCheckbox = (patient) => {
        
        if(patient.selectStatus===false){
            patient.selectStatus=true  
            settokenPatient(tokenPatient => [...tokenPatient,patient])
        }else{
            patient.selectStatus=false
            settokenPatient(tokenPatient.filter(patientToBeKept => patientToBeKept!==patient))  
        }
    }

    
    
    const renderTableData = () => {

        console.log("encounters is ",encounters.length)
        return encounters.map((encounter,index) =>{
            const { visitId, patientId, tokenNo, dateTime, payable, paymentRecieved, firstName, lastName, phoneNumber } = encounter; //destructuring
            console.log(visitId)
            const name= firstName+" "+lastName
            var dateTimeParts= dateTime.split("T")
            var datePart = new Date(dateTimeParts[0]) 
            var timePart = dateTimeParts[1];
            return (
                <tr>
                    <td>{tokenNo}</td>
                    <td>{datePart.toDateString()} <ul></ul> {timePart}</td>
                    <td>{patientId}</td>
                    <td>{name}</td>
                    <td>{phoneNumber}</td>
                    <td>{payable}</td>
                    <td>
                        {paymentRecieved==0 ? 
                                <Button onClick={() => {
                                    setPaymentEncounter(encounter)
                                    setopenPaymentModal(true)}}>
                                RECEIVE PAYMENT
                                </Button>
                            :
                        paymentRecieved
                        }
                    </td>
                    <td>
                        <Button onClick={() => navigate(`/mainencounter/${shiftId}/${visitId}/${userName}/${patientId}/${name}`)}>
                        Clinical History
                        </Button>
                    </td>
                </tr>
            )
        })
    }

    async function receivePayment(){

        const visitIdOfPaymentEncounter= paymentEncounter.visitId
        const response = await fetch(
            `http://localhost:4000/encounter/updatefee/${visitIdOfPaymentEncounter}`,
            {
              method: "POST",
              withCredentials: true,
              credentials: "include",
              headers: {
                  Authorization: `Bearer ${tokenID}`,
                  "Content-Type": "application/json"
                },
              body: JSON.stringify({
                paymentRecieved: fee
              })
            }
        );
        if(response.status===200){
            console.log("successful")
            var tempEncounters= encounters
            tempEncounters.map((temp, index)=> {
                if(temp.visitId===paymentEncounter.visitId){
                    temp.paymentRecieved= fee
                }
            })
            setEncounters(tempEncounters)
            setPaymentEncounter()
            setFee("")   
            setopenPaymentModal(false)  
      
        }else{
            const err= (response.json()).message
            console.log("eror is", err)
        } 
        
    }



    return (
        <div>
            <NavBarAdmin/>
            <h1 className="welcome-sign">PATIENTS</h1>
            <div>
                <Button className="button-create-token" variant="contained" onClick={()=> setOpenPhoneModal(true)}>
                    Create Token
                </Button>
            </div>
            <ul></ul>
            {(encounters) ? (
                <div className="user-account-table">
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Time</th>
                            <th>Patient Id</th>
                            <th>Patient's Name</th>
                            <th>Phone Number</th>
                            <th>Payable</th>
                            <th>Payment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{renderTableData()}</tbody>
                </Table>
                </div>
            ) : (
                <div className="no-token-msg-box">
                    <h1>NO TOKENS ARE GENERATED IN THIS SHIFT YET.</h1>
                </div>
                
            )}
        <Modal show={openPhoneModal} onHide={()=> setOpenPhoneModal(false)}>
            <Modal.Header closeButton >
            <Modal.Title>Search Patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RadioGroup
                    className="radio-buttons"
                    defaultValue="Search by ID"
                    name="radio-buttons-group">
                    <FormControlLabel 
                        value="Search by ID" 
                        onClick={() => setPatientSearch('Search by ID')} 
                        control={<Radio />} 
                        label="Search by ID" />
                    <FormControlLabel 
                        value="Search by Phone Number"
                        onClick={(value) => setPatientSearch('Search by Phone Number')}
                        control={<Radio />} 
                        label="Search by Phone Number" />
                </RadioGroup>
                <ul></ul>
                {patientSearch==='Search by Phone Number' ?
                    <div className="text-field">
                        <FormLabel disabled={true}>Phone Number</FormLabel>
                        <TextField  value={phoneNumber} onChange={e => {setPhoneNumber(e.target.value)}}></TextField>
                    </div>                
                :
                <div className="text-field">
                    <FormLabel disabled={true}>Patient ID</FormLabel>
                    <TextField  value={patientId} onChange={e => {setPatientId(e.target.value)}}></TextField>
                </div> 
                }

            </Modal.Body>
            <Modal.Footer>
            <Button className="button" variant="contained" onClick={()=> searchAllPatients()}>
                Search Patient
            </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={openPatientsModal} onHide={()=> setopenPatientsModal(false)}>
            <Modal.Header closeButton >
            <Modal.Title>Patient List</Modal.Title>
            </Modal.Header>
            <Modal.Body className="token-patient-table">
                <FormGroup>
                    <Table striped bordered hover >
                        <thead>
                            <tr>
                                <th>PATIENT ID</th>
                                <th>PATIENT NAME</th>
                                <th>SELECT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient,index)=>{
                            const name=patient.firstName + " " + patient.lastName 
                            return(
                                <tr>
                                    <th>{patient.patientId}</th>
                                    <th>{name}</th>
                                    <th>
                                        {/* {handlePatientSelectionCheckbox(patient)} */}
                                        <Checkbox
                                            checked= {isCheckedPatient(patient)} 
                                            onChange={()=>handlePatientSelectionCheckbox(patient)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </th>
                                </tr>
                            )
                            })}
                        </tbody>
                    </Table>
                 
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
            <Button className="button" variant="contained" onClick={()=> {createToken()}}>
                Select Token(s)
            </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={openPaymentModal} onHide={()=> setopenPaymentModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Receive Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table bordered>
                        <tbody>
                            <tr>
                                <th>
                                    Consultation Fee:
                                </th>
                                <th>
                                    <TextField 
                                        value={fee} 
                                        type="number" 
                                        onChange={e => {
                                            setFee(e.target.value)
                                            let temp= paymentEncounter
                                            temp.paymentRecieved= fee
                                            setPaymentEncounter(temp)
                                            }}>
                                    </TextField>
                                </th>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> receivePayment()}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
        
    )
   
};
  
export default SpecificShift;