import { useNavigate,  useParams } from "react-router-dom";
import "../css/MainEncounter.css";
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import { Modal} from "react-bootstrap";
import { TextField, Select, MenuItem, Checkbox} from '@mui/material';
import NavBarReception from "./NavBarReception";
import NavBarAdmin from "./NavBarAdmin";

const MainEncounter = () => {

    const tokenID= sessionStorage.getItem("accessToken")
    const userName= useParams().username
    const usertype= useParams().userrole

    const navigate= useNavigate()

    const[openModal, setOpenModal] = useState(false);
    const[openSucessModal, setOpenSucessModal] = useState(false);

    const [callEffect,setCallEffect]= useState(false)
    const [callEffectDoc,setcallEffectDoc]= useState(false)

    const [encounters, setEncounters] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [renderedMedicines, setRenderedMedicines] = useState([]);
    const [prescriptionMeds, setPrescriptionMeds] = useState([]);
    const [patientInfo, setPatientInfo] = useState([]);

    const [searchInput, setSearchInput] = useState("");

    const patientId = useParams().patientid;
    const visitId = useParams().visitid
    const shiftId = useParams().shiftId

    const [temp, setTemp] = useState("");
    const [bP, setbP] = useState("");
    const [weight, setWeight] = useState("");
    const [BSR, setBSR] = useState("");
    const [heartRate, setHeartRate] = useState(""); 
    const [notes, setNotes] = useState(""); 
    const [fee, setFee] = useState(""); 


    const dosage=['morning', 'morning, before meal', 'morning, noon', 'morning, noon, night, before meal', 'night before meal' ]

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    
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

    useEffect(() => {
        async function getPatientInfo() {
            console.log(`in get patient info`);
            const response = await fetch(
                `http://localhost:4000/patient/patientinfobyid/${patientId}`,
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
                return response.json()
            }else{
                const err= (response.json()).message
            }   
        }

        getPatientInfo().then((response)=>{
            var info= response
            console.log("patient ", info)
            setPatientInfo(info)
        })

    }, [callEffect]);

    async function savePrescription() {

        let tempArray= [...prescriptionMeds]
        for(var i=0; i<prescriptionMeds.length;i++){
            

            delete tempArray[i].id
            delete tempArray[i].medicineId
            delete tempArray[i].medicineType
            delete tempArray[i].selectStatus

        }
        setPrescriptionMeds(tempArray)
        console.log("in save prescription", fee)

        const response = await fetch(
            `http://localhost:4000/encounter/update/${visitId}`,
            {
              method: "POST",
              withCredentials: true,
              credentials: "include",
              headers: {
                  Authorization: `Bearer ${tokenID}`,
                  "Content-Type": "application/json"
                },
              body: JSON.stringify({
                temperature: temp,
                BP: bP,
                weight: weight,
                BSR: BSR,
                heartRate: heartRate,
                notes: notes,
                prescriptionMeds: prescriptionMeds,
                paymentRecieved: fee
              })
            }
        );
        if(response.status===200){
            console.log("successful")
            setOpenSucessModal(true)            
        }else{
            const err= (response.json()).message
            console.log("eror is", err)
        } 
    }

    useEffect(() => {
        async function getAllMedicines() {
            console.log(`in get all medicines`);
            const response = await fetch(
                `http://localhost:4000/medicine/all`,
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
                return response.json()
            }else{
                const err= (response.json()).message
            }   
        }

        getAllMedicines().then((response)=>{
            var allMeds= response
            allMeds = allMeds.map((medicine) => ({
                ...medicine,
                selectStatus: false,
                selectDosage: '',
                selectQuantity: 0,
                selectDays: 0,
              }));
            setMedicines(allMeds)
        })

    }, [callEffect]);

    useEffect(() => {
        async function getAllEncounters() {
            console.log(`in get all patient encounters`);
            const response = await fetch(
                `http://localhost:4000/encounter/patienthistory/${patientId}`,
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
                return response.json()
            }else{
                const err= (response.json()).message
            }   
        }

        getAllEncounters().then((response)=>{
            const allEncounters= response
            console.log("medicines are",allEncounters)
            setEncounters(allEncounters)
        })

    }, [callEffect]);

    const isCheckedMedicine = (medicine) => {

        if(medicine.selectStatus===false){ 
            return false
        }else{
            return true
        }
    }

    const handleMedicineSelectionCheckbox = (medicine) => {
        
        if(medicine.selectStatus===false){
            medicine.selectStatus=true  
            setPrescriptionMeds(prescriptionMeds => [...prescriptionMeds,medicine])
        }else{
            medicine.selectStatus=false
            setPrescriptionMeds(prescriptionMeds.filter(medToBeKept => medToBeKept!==medicine))
        }
    }

    const selectMedicinesFunction = () => {
        return(
            medicines.filter((medicine,index) =>{
                const { medicineId, medicineName, medicineType}= medicine //destructuring

                if(searchInput === ""){

                }else if (medicineName.toLowerCase().includes(searchInput.toLowerCase()) && searchInput.length>2){
                    return medicine 
                }

            }).map((medicine, index) => {
                const { medicineId, medicineName, medicineType, selectStatus}= medicine
                return(
                <tr>
                    <td>
                        {medicineName}
                    </td>
                    <td>
                        {medicineType}
                    </td>
                    <td>
                        <Checkbox
                            checked= {isCheckedMedicine(medicine)} 
                            onChange={()=>handleMedicineSelectionCheckbox(medicine)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </td>
                </tr>
                )
            }
            )    
        )   

    }

    const updateMedQuantity = (index,value) => {

        let newArr = [...prescriptionMeds]; 
        newArr[index].selectQuantity = value; 
        setPrescriptionMeds(newArr);   
    }

    const updateMedDays = (index,value) => {

        let newArr = [...prescriptionMeds]; 
        newArr[index].selectDays = value; 
        setPrescriptionMeds(newArr);   
    }

    const updateMedDosage = (index,value) => {

        console.log("here",prescriptionMeds[index].selectDosage)
        let newArr = [...prescriptionMeds]; 
        newArr[index].selectDosage = value; 
        setPrescriptionMeds(newArr);   
    }

    const renderMedicines = () => {
        
        if(prescriptionMeds.length>0){
            return prescriptionMeds.map((prescriptionMed, index) =>{
                var { medicineName, selectDosage, selectQuantity,selectDays }= prescriptionMed
                return(
                    <tr>
                        <td>
                            {medicineName}
                        </td>
                        <td>
                            <Select value={selectDosage} onChange={e => updateMedDosage(index,e.target.value)} sx={{ width: 220}}>
                                {dosage.map((dose,index)=>{
                                    return <MenuItem value={dose}>{dose}</MenuItem>
                                })}
                            </Select>
                        </td>
                        <td>
                            <TextField 
                                type="number" 
                                inputProps={{min:0}}
                                value={selectQuantity} 
                                onChange={event=>updateMedQuantity(index,event.target.value)}>
                            </TextField>
                        </td>
                        <td>
                            <TextField 
                                type="number" 
                                inputProps={{min:0}}
                                value={selectDays} 
                                onChange={event=>updateMedDays(index,event.target.value)}>
                            </TextField>
                        </td>
                    </tr>
                )
            })
        }else{
            return(
                <tr className="no-meds-row">
                    No medicines have been added.
                </tr>
            )
        }
    }

    
    const displayPatientInfo = () => {
        return(
            <div >
                <Table className="patient-info" >
                        <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <td>{patientInfo.patientId}</td>
                                    <th>Address</th>
                                    <td>{patientInfo.houseAddress}</td>
                                </tr>
                                <tr>
                                    <th>Age</th>
                                    <td>{patientInfo.age}</td>
                                    <th>Total Visits</th>
                                    <td>{patientInfo.totalVisits}</td>
                                </tr>
                                <tr>
                                    <th>Phone Number</th>
                                    <td>{patientInfo.phoneNumber}</td>
                                    <th>Total Payments</th>
                                    <td>{patientInfo.totalPayments}</td>
                                </tr>
                                {/* <tr>
                                    <th>Address</th>
                                    <td>{patientInfo.houseAddress}</td>
                                </tr>
                                <tr>
                                    <th>Total Visits</th>
                                    <td>{patientInfo.totalVisits}</td>
                                </tr>
                                <tr>
                                    <th>Total Payments</th>
                                    <td>{patientInfo.totalPayments}</td>
                                </tr> */}
                        </thead>
                </Table>
            </div>
        )
    }

    const renderEncounters = () => {

        return encounters.map((encounter,index) =>{
            const { dateTime, doctorId, bloodPressure, temperature, weight, BSR, heartRate, prescribedMeds, 
                notes, paymentRecieved} = encounter; //destructuring
            var dateTimeParts= dateTime.split("T")
            var datePart = new Date(dateTimeParts[0]) 
            var timePart = dateTimeParts[1];
                  
            return (
                <tr>
                    <td>
                        {datePart.toDateString()}
                        <ul></ul>
                        {doctorId}   
                    </td>
                    <td>
                        <Table bordered className="vitals-history">
                            <thead>
                            <tr>
                                <th>BP:</th>
                                <td>{bloodPressure}</td>
                                 
                            </tr>
                            <tr>
                                <th>TEMP:</th>
                                <td>{temperature}</td>    
                            </tr>
                            <tr>
                                <th>WEIGHT:</th>
                                <td>{weight}</td>
                            </tr>
                            <tr>
                                <th>BSR:</th>
                                <td>{BSR}</td>
                            </tr>
                            <tr>
                                <th>HEARTRATE:</th>
                                <td>{heartRate}</td>
                            </tr>
                            </thead>

                        </Table>
                    </td>
                    <td>
                        <div  className="medicine-column">
                        <Table bordered >
                            <tbody>
                                {(prescribedMeds != null) ?
                                    prescribedMeds.map((med, index) => {
                                        return (
                                            <tr key={index}>
                                                <th>{index + 1}. {med.medicineName}</th>
                                                <td>
                                                    <Table bordered>
                                                        <tbody>
                                                            <tr>
                                                                <th>Dosage:</th>
                                                                <td>{med.selectDosage}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Quantity:</th>
                                                                <td>{med.selectQuantity}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Days:</th>
                                                                <td>{med.selectDays}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )
                                    }) : null}

                            </tbody>
                        </Table>
                        </div>

                    </td>
                    <td>{notes}</td>
                    <td>{paymentRecieved}</td>
                </tr>
            )
        })
    }

    return (
        <div>
            {GetNavbar()}
            <h2 className="welcome-sign">{useParams().patientname}</h2>
            {displayPatientInfo()}
            <div className="row">
                <div className="column">
                    <h4 className="heading-sign">OPD HISTORY</h4>
                    <hr class="dashed"></hr>
                    <div className="encounter-history-div">
                    <Table className="encounter-history-table" bordered>
                        <thead>
                            <tr>
                                <th>VISIT</th>
                                <th>VITALS</th>
                                <th>MEDICATIONS</th>
                                <th>NOTES</th>
                                <th>PAYMENT</th>
                            </tr>
                        </thead>
                        <tbody>{renderEncounters()}</tbody>
                    </Table>
                    </div>
                </div>
                <div class="vl"></div>
                <div className="column">
                    <h4 className="heading-sign">TODAY'S PRESCRIPTION</h4>
                    <hr class="dashed"></hr>
                    <div className="scrollable-pres">
                        <Table striped bordered hover>
                            <thead>
                                <tr style={{ width: '20vh' }}>
                                    <th >TEMP</th>
                                    <td>
                                        <TextField 
                                            type="number"
                                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                            value={temp} 
                                            onChange={e => setTemp(e.target.value)}>
                                        </TextField>
                                    </td>
                                    <th>BP</th>
                                    <td>
                                        <TextField 
                                            type="number"
                                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                            value={bP} 
                                            onChange={e => setbP(e.target.value)}>
                                        </TextField>
                                    </td>
                                </tr>
                                <tr>
                                    <th >BSR</th>
                                    <td>
                                        <TextField 
                                            type="number"
                                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                            value={BSR} 
                                            onChange={e => setBSR(e.target.value)}>
                                        </TextField>
                                    </td>
                                    <th>WEIGHT (kg)</th>
                                    <td>
                                        <TextField 
                                            type="number"
                                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                            value={weight} 
                                            onChange={e => setWeight(e.target.value)}>
                                        </TextField>
                                    </td>
                                </tr>
                                <tr>
                                    <th>HEART RATE</th>
                                    <td>
                                        <TextField 
                                            type="number"
                                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                            value={heartRate} 
                                            onChange={e => setHeartRate(e.target.value)}>
                                        </TextField>
                                    </td>
                                    <th></th>
                                    <td></td>     
                                </tr>
                            </thead>
                        </Table>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>NOTES</th>
                                    <td>
                                        <TextField 
                                            multiline rows={4} 
                                            style={{ width: '100%' }}
                                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 0 } }} 
                                            value={notes} 
                                            onChange={e => setNotes(e.target.value)}>
                                        </TextField>
                                    </td>
                                </tr>
                            </thead>
                        </Table>
                        <hr
                        style={{
                            background: 'black',
                            color: 'black',
                            borderColor: 'black',
                            height: '3px',
                        }}
                        />
                        {prescriptionMeds.length>0 ?
                            <div >
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>MEDICINE NAME</th>
                                            <th>DOSAGE</th>
                                            <th>QUANTITY</th>
                                            <th>DAYS</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderMedicines()}</tbody>
                                </Table>
                            </div>:
                            <div className="no-meds-alert" >
                                <h7 >No medications have been added yet</h7>
                            </div>                    
                        }
                        <Button  className="medication-button" variant="contained" onClick={() => setOpenModal(true)} >
                            ADD MEDICATION
                        </Button>
                        <ul></ul>
                        <hr
                        style={{
                            background: 'black',
                            color: 'black',
                            borderColor: 'black',
                            height: '3px',
                        }}
                        />
                        <Table bordered>
                            <tbody>
                                <tr>
                                    <th>
                                        Consultation Fee:
                                    </th>
                                    <th>
                                        <TextField value={fee} type="number" onChange={e => setFee(e.target.value)}></TextField>
                                    </th>
                                </tr>
                            </tbody>
                        </Table>

                        <Button className="save-presc-button" variant="contained" onClick={() => savePrescription()}>
                            SAVE PRESCRIPTION
                        </Button>
                    </div>

                </div>
            </div>

            <Modal className="select-med-table" show={openModal} onHide={() => setOpenModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Select Medication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="search-bar-div">
                        <input
                        type="text"
                        placeholder="Search Medicines"
                        onChange={handleChange}
                        value={searchInput}
                        className="search-bar"/>
                    </div>
                    <div className="select-medicine-table-div">
                        <Table striped bordered hover  >
                        <thead>
                            <tr>
                                <th>MEDICINE NAME</th>
                                <th>MEDICINE TYPE</th>
                                <th>SELECT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectMedicinesFunction()}
                        </tbody>
                    </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={() => setOpenModal(false)}>
                    SELECT MEDICINE(S)
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openSucessModal} onHide={()=> setOpenSucessModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Prescription Saved</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your prescription has been saved successfully.</Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> navigate(`/shift/${userName}/${usertype}/${shiftId}`)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
   
};
  
export default MainEncounter;