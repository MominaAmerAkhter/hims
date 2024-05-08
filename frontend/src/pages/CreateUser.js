import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, Select, MenuItem} from '@mui/material';
import "../css/UserAccounts.css"
import { Modal} from "react-bootstrap";

import NavBarAdmin from "./NavBarAdmin";


const CreateUser = () => {

    //specific input fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); 
    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [gender, setGender] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [licenseNo, setLicenseNo] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    
    //errors related to input fields
    const[usernameError, setUsernameError] = useState(false);
    const[passwordError, setPasswordError] = useState(false);
    const[roleError, setRoleError] = useState(false);
    const[fNameError, setfNameError] = useState(false);
    const[lNameError, setlNameError] = useState(false);
    const[phoneNoError, setPhoneNoError] = useState(false);
    const[genderError, setGenderError] = useState(false);
    const[specializationError, setSpecializationError] = useState(false);
    const[licenseNoError, setLicenseNoError] = useState(false);
    const[consultationFeeError, setConsultationFeeError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    //modals
    const[openModal, setOpenModal] = useState(false);
    const[openModalError, setOpenModalError] = useState(false);

    //session storages
    const tokenID= sessionStorage.getItem("accessToken")
    const userName= sessionStorage.getItem("userName")

    const navigate= useNavigate()


    const CreateNewUser = async() => {

        setUsernameError(false)
        setPasswordError(false)
        setfNameError(false)
        setlNameError(false)
        setPhoneNoError(false)
        setGenderError(false)
        setSpecializationError(false)
        setConsultationFeeError(false)
        setLicenseNoError(false)
        setPasswordError(false)
        setRoleError(false)


        if(username===""){
            setUsernameError(true)
        }
        if(password===""){
            setPassword(true)
        }
        if(firstName===""){
            setfNameError(true)
        }
        if(lastName===""){
            setlNameError(true)
        }
        if(phoneNo==="" || phoneNo.length<11){
            setPhoneNoError(true)
        }
        if(role===""){
            setRoleError(true)
        }
        if(role==="Doctor"){
            if(specialization===""){
                setSpecializationError(true)
            }
            if(consultationFee===""){
                setConsultationFeeError(true)
            }
            if(licenseNo===""){
                setLicenseNoError(true)
            }
            if(gender===""){
                setGenderError(true)
            }
            if(firstName && lastName && username && phoneNo && password && specialization && consultationFee && licenseNo && gender ){
                await postDataDoctor()
                setOpenModal(true)
            }
        }else{
            if(firstName && lastName && username && phoneNo && password ){
                await postDataNormal()
                setOpenModal(true)
            }        
        }
        
    };

    // const handleClose = () => setOpenModal(false)

    async function postDataDoctor() {
        console.log(`Post Data for create Doctor user`);
        const response = await fetch(
          "http://localhost:4000/user/new",
          {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${tokenID}`,
                "Content-Type": "application/json"
              },
            body: JSON.stringify({
                userName: username,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNo,
                userRole: role,
                password: password,
                specialization: specialization,
                gender: gender,
                licenseNumber: licenseNo,
                consultationFee: consultationFee
            })
          }
        );
        if(response.status===200){
            console.log("successful")
            setOpenModal(true)
            
        }else{
            const err= (response.json()).message
            console.log("eror is", err)
            setErrorMsg(err)
            setOpenModalError(true)
        }   
    }

    async function postDataNormal() {
        console.log(`Post Data for create normal user`);
        const response = await fetch(
          "http://localhost:4000/user/new",
          {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${tokenID}`,
                "Content-Type": "application/json"
              },
            body: JSON.stringify({
                userName: username,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNo,
                userRole: role,
                password: password
            })
          }
        );
        if(response.status===200){
            console.log("successful")
            setOpenModal(true)
        }else{
            const err= (response.json()).message
            setErrorMsg(err)
            setOpenModalError(true)
        }   
    }

    const handleChange = (e) => {
        e.preventDefault();
        setRole(e.target.value);
        setUsername("")
        setPassword("")
        setFirstName("")
        setLastName("")
        setPhoneNo("")
        setGender("")
        setSpecialization("")
        setLicenseNo("")
        setUsernameError(false)
        setPasswordError(false)
        setfNameError(false)
        setlNameError(false)
        setPhoneNoError(false)
        setGenderError(false)
        setSpecializationError(false)
        setConsultationFeeError(false)
        setLicenseNoError(false)
        setPasswordError(false)
        setRoleError(false)
    }
    
    const renderForm = () => {

        if(role==="Doctor"){
            return(
                <div>
                    <div className="text-field">
                    <FormLabel disabled={true}>Specialization</FormLabel>
                    <TextField error={specializationError} value={specialization} onChange={e => {setSpecialization(e.target.value)}}></TextField>
                    </div>
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
                            <FormLabel disabled={true}>License Number</FormLabel>
                            <TextField error={licenseNoError} value={licenseNo} onChange={e => setLicenseNo(e.target.value)}></TextField>
                        </div>
                    </div>                  
                    <ul></ul>
                    <div className="text-field">
                        <FormLabel disabled={true}>Consultation Fee</FormLabel>
                        <TextField error={consultationFeeError} value={consultationFee} onChange={e => setConsultationFee(e.target.value)}></TextField>
                    </div>
                </div>

            )
        }else{
            return null
        }
    }


    return (
        <div>
            <NavBarAdmin/>
            <h1 className="welcome-sign">Create User</h1>
            <div className="select-user-role">
            <FormLabel disabled={true}>Role</FormLabel>
                <Select error={roleError} label="Role" value={role} onChange={handleChange} sx={{ width: 220}}>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Doctor"}>Doctor</MenuItem>
                    <MenuItem value={"Receptionist"}>Receptionist</MenuItem>
                    <MenuItem value={"Pharmacy"}>Pharmacy</MenuItem>
                </Select>
            </div>
            <hr class="dashed"></hr>
            <FormControl className="patient-registration-form">
                <div className="full-name-field">
                    <div className="text-field">
                        <FormLabel disabled={true}>Username</FormLabel>
                        <TextField  error={usernameError} value={username} onChange={e => {setUsername(e.target.value)}}></TextField>
                    </div>
                    <ul></ul>
                    <div className="text-field">
                        <FormLabel disabled={true}>Password</FormLabel>
                        <TextField type="password" error={passwordError} value={password} onChange={e => setPassword(e.target.value)}></TextField>
                    </div>
                </div>
                <ul></ul>
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
                <div className="text-field">
                    <FormLabel disabled={true}>Phone Number</FormLabel>
                    <TextField error={phoneNoError} value={phoneNo} onChange={e => {
                        setPhoneNo(e.target.value)
                        if (e.target.value.length < 11) {
                            return setPhoneNoError(true);
                        }
                        setPhoneNoError(false);
                    }}></TextField>
                </div>
                <ul></ul>
                {renderForm()}
            </FormControl>
            
            <div className="register-button">
                <Button className="button" variant="contained" onClick={CreateNewUser}>
                    CREATE USER
                </Button>
            </div>
            <Modal show={openModal} onHide={()=> setOpenModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>User Creation</Modal.Title>
                </Modal.Header>
                <Modal.Body>User Account for {firstName} {lastName} has been created successfully!</Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> navigate(`/adminhomepage/${userName}`)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openModalError} onHide={()=> setOpenModalError(false)}>
                <Modal.Header closeButton >
                <Modal.Title>ERROR</Modal.Title>
                </Modal.Header>
                <Modal.Body>User Account for {firstName} {lastName} could not be created. Please try again.</Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> setOpenModalError(false)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
   
};
  
export default CreateUser;