import { json, useNavigate } from "react-router-dom";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import "../css/RegisterPatient.css"
import { Modal} from "react-bootstrap";

import NavBarReception from "./NavBarReception";
import NavBarAdmin from "./NavBarAdmin";


const RegisterPatient = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    
    const[fNameError, setfNameError] = useState(false);
    const[lNameError, setlNameError] = useState(false);
    const[phoneNoError, setPhoneNoError] = useState(false);
    const[genderError, setGenderError] = useState(false);
    const[ageError, setAgeError] = useState(false);
    const[addressError, setAddressError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const[openModal, setOpenModal] = useState(false);
    const[openModalError, setOpenModalError] = useState(false);

    const tokenID= sessionStorage.getItem("accessToken")
    const userName= sessionStorage.getItem("userName")
    const genders=["Male","Female","Other"]
    const usertype= sessionStorage.getItem("userRole")

    const navigate= useNavigate()

    const GetNavbar = () =>{
        if (usertype == "Admin"){
            return(
            <NavBarAdmin/>
            )
        }
        else if (usertype == "Receptionist"){
            return (
            <NavBarReception/>
            )
        }
    }

    const RegisterPatient = async() => {

        setfNameError(false)
        setlNameError(false)
        setPhoneNoError(false)
        setGenderError(false)
        setAgeError(false)
        setAddressError(false)


        if(firstName===""){
            setfNameError(true)
        }
        if(lastName===""){
            setlNameError(true)
        }
        if(phoneNo==="" || phoneNo.length<11){
            setPhoneNoError(true)
        }
        if(gender===""){
            setGenderError(true)
        }
        if(age===""){
            setAgeError(true)
        }
        if(address===""){
            setAddressError(true)
        }
        if(firstName && lastName && phoneNo && gender && age && address){
            const resp= await postData()
            setOpenModal(true)
        }

    };

    const handleClose = () => setOpenModal(false)

    async function postData() {
        console.log(`Post Data for register`);
        const response = await fetch(
          "http://localhost:4000/patient/new",
          {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${tokenID}`,
                "Content-Type": "application/json"
              },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNo,
                gender: gender,
                age: age,
                houseAddress: address,
            })
          }
        );
        if(response.status===200){
            console.log("successful")
            return
        }else{
            const err= (response.json()).message
            setErrorMsg(err)
            setOpenModalError(true)
        }   
    }

    return (
        <div>
            {GetNavbar()}
            <h1 className="welcome-sign">PATIENT REGISTRATION</h1>
            <FormControl className="patient-registration-form">
                <div className="full-name-field">
                    <div className="text-field">
                        <FormLabel disabled={true}>First Name</FormLabel>
                        <TextField  error={fNameError} value={firstName} onChange={e => {setFirstName(e.target.value)}}></TextField>
                    </div>
                    <ul></ul>
                    <div className="text-field">
                        <FormLabel disabled={true}>Last Name</FormLabel>
                        <TextField error={lNameError} value={lastName} onChange={e => setLastName(e.target.value)}></TextField>
                    </div>

                </div>
                <ul></ul>
                <FormLabel disabled={true}>Phone Number</FormLabel>
                <TextField error={phoneNoError} value={phoneNo} onChange={e => {
                    setPhoneNo(e.target.value)
                    if (e.target.value.length < 11) {
                        return setPhoneNoError(true);
                    }
                    setPhoneNoError(false);
                    }}></TextField>
                <ul></ul>
                <div className="gender-age-field">
                    <div className="text-field">
                        <FormLabel disabled={true}>Gender</FormLabel>
                        <Select error={genderError} value={gender} onChange={e => setGender(e.target.value)} sx={{ width: 220}}>
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                    </div>
                    <ul></ul>
                    <div className="text-field">
                        <FormLabel disabled={true}>Age</FormLabel>
                        <TextField error={ageError} value={age} onChange={e => setAge(e.target.value)}></TextField>
                    </div>
                </div>
                <ul></ul>
                <FormLabel disabled={true}>Address</FormLabel>
                <TextField error={addressError} value={address} onChange={e => setAddress(e.target.value)}></TextField>
                <ul></ul>
            </FormControl>
            <div className="register-button">
                <Button className="button" variant="contained" onClick={RegisterPatient}>
                    REGISTER PATIENT
                </Button>
            </div>
            <Modal show={openModal} onHide={()=> setOpenModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Patient Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>Patient {firstName} {lastName} has been registered successfully!</Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> navigate(`/receptionhomepage/${userName}`)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openModalError} onHide={()=> setOpenModalError(false)}>
                <Modal.Header closeButton >
                <Modal.Title>ERROR</Modal.Title>
                </Modal.Header>
                <Modal.Body>Patient {firstName} {lastName} could not be registered. Please try again.</Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> setOpenModalError(false)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
   
};
  
export default RegisterPatient;