import { useNavigate, useParams } from "react-router-dom";
import "../css/Shifts.css";
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import { Modal} from "react-bootstrap";

import {Select, MenuItem} from '@mui/material';
import NavBarReception from "./NavBarReception";
import NavBarAdmin from "./NavBarAdmin";

const Shifts = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    var indexOfLastRecord = currentPage * recordsPerPage;  // 10 for the first time
    var indexOfFirstRecord = indexOfLastRecord - recordsPerPage; // 0 for the first time
    var totalNumberOfRecords= 0;
    const [paginationNumbers, setPaginationNumbers] = useState([]);

    const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    const usertype= useParams().userrole
    console.log("token id ", tokenID)

    const navigate= useNavigate()

    const[openModal, setOpenModal] = useState(false);
    const[openModalError, setOpenModalError] = useState(false);
    const [ErrorMsg, setErrorMsg] = useState("");
    
    const [callEffect,setCallEffect]= useState(false)
    const [callEffectDoc,setcallEffectDoc]= useState(false)

    const [shifts, setShifts] = useState([]);

    const [doctors, setDoctors] = useState([]);
    const [selectDoc, setselectDoc] = useState("");
    const [selectDocErr, setselectDocErr] = useState(false);
     

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    
    const GetNavbar = () =>{
        if (usertype === "Admin"){
            return(
            <NavBarAdmin/>
            )
        }
        else if (usertype === "Receptionist"){
            return (
            <NavBarReception/>
            )
        }
    }

    useEffect(() => {
        async function getallDoctors() {
            console.log(`in get open shifts`);
            const response = await fetch(
                "http://localhost:4000/doctor/all",
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

        getallDoctors().then((response)=>{
            const allDoctors= response
            console.log(allDoctors)
            setDoctors(allDoctors)
        })
    },  [callEffectDoc])



    useEffect(() => {
        async function getAllShifts() {
            console.log(`in get shifts`, indexOfFirstRecord);
            const response = await fetch(
                `http://localhost:4000/shift/${indexOfFirstRecord}`,
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
                console.log("in shifts resp 200")
                return response.json()
            }else{
                const err= (response.json()).message
            }   
        }

        getAllShifts().then((response)=>{
            console.log("HellOOO")
            const openShifts= response.allShifts
            totalNumberOfRecords= response.numberOfRecords
            console.log("total", totalNumberOfRecords)
            var tempArray=[]
            for (let i = 1; i <= Math.ceil(totalNumberOfRecords / recordsPerPage); i++) {
                tempArray.push(i)
            }
            setPaginationNumbers(tempArray)
            console.log("shifts are",openShifts)
            setShifts(openShifts)
        })

    }, [callEffect]);

    async function createNewShift() {
        console.log(`Create New Shift`);
        console.log(selectDoc.id)
        const response = await fetch(
          "http://localhost:4000/shift/new",
          {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${tokenID}`,
                "Content-Type": "application/json"
              },
            body: JSON.stringify({
                shiftCreator: userName,
                doctorId: selectDoc.id,
                doctorfName: selectDoc.doctorfName,
                doctorlName: selectDoc.doctorlName,
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
    
    const openSpecificShift = async(shiftId) => {

        console.log("shift id is ",shiftId)
        sessionStorage.setItem("shiftId", shiftId)
        navigate(`/shift/${userName}/${usertype}/${shiftId}`)
    };

    const renderTableData = () => {

        return shifts.filter((shift,index) =>{
            const { doctorfName, doctorlName} = shift; //destructuring

            if(searchInput === ""){
                return shift
            }else if (doctorfName.toLowerCase().includes(searchInput.toLowerCase()) || doctorlName.toLowerCase().includes(searchInput.toLowerCase())){
                return shift 
            }

        }).map((shift,index) =>{
            const { shiftId, shiftCreator, doctorfName, doctorlName, shiftStatus, startTime, endTime} = shift; //destructuring
            const name= doctorfName+" "+doctorlName
            var dateTimeParts= startTime.split("T")
            var datePart = new Date(dateTimeParts[0]) 
            return (
                <tr onClick={()=> openSpecificShift(shiftId)}>
                    <td>{shiftId}</td>
                    <td>{shiftCreator}</td>
                    <td>{name}</td>
                    <td>{shiftStatus}</td>
                    <td>{datePart.toDateString()}</td>
                    <td>{dateTimeParts[1]}</td>
                    <td>{endTime}</td>
                </tr>
            )
        })
    }

    
    const goToSelectedPage = (selectedPage) => {
            setCurrentPage(selectedPage)
            indexOfLastRecord = currentPage * recordsPerPage;  // 10 for the first time
            indexOfFirstRecord = indexOfLastRecord - recordsPerPage; // 0 for the first time
            setCallEffect(!callEffect)
    }

    const renderPages = () => {

        return paginationNumbers.filter((number,index) => {

            if(number < currentPage+10){
                if(number > currentPage-10){
                    return number
                }
            }

        }).map((number,index) =>{
            return(
                <li className="page-item">
                            <a className="page-link" 
                                onClick={()=> goToSelectedPage(number)} 
                                href='#'>
                        {number}
                    </a>
                </li>
            )

        })
    }

    const goToNextPage = () => {
        if(currentPage !== paginationNumbers[-1]) 
            setCurrentPage(currentPage + 1)
            indexOfLastRecord = currentPage * recordsPerPage;  // 10 for the first time
            indexOfFirstRecord = indexOfLastRecord - recordsPerPage; // 0 for the first time
            setCallEffect(!callEffect)
    }

    const goToPrevPage = () => {
        if(currentPage !== 1) 
            setCurrentPage(currentPage - 1)
            indexOfLastRecord = currentPage * recordsPerPage;  // 10 for the first time
            indexOfFirstRecord = indexOfLastRecord - recordsPerPage; // 0 for the first time
            setCallEffect(!callEffect)
    }

    return (
        <div>
            {GetNavbar()}
            <div className="select-doctor-for-shift">
                <Select className="select-doctor-dropdown-menu" error={selectDocErr} label="Select Doctor" value={selectDoc} onChange={e => setselectDoc(e.target.value)} sx={{ width: 220}}>
                    {doctors.map((doctor,index)=>{
                        return(
                            <MenuItem value={doctors[index]}>Dr {doctor.doctorfName} {doctor.doctorlName}</MenuItem>
                        )
                    })}
                </Select>
                <Button className="button-create-shift" variant="contained" onClick={createNewShift}>
                    Create Shift
                </Button>
            </div>
            <h1 className="welcome-sign">Shifts</h1>
            <div className="search-bar-div">
                <input
                type="text"
                placeholder="Search by doctor's name"
                onChange={handleChange}
                value={searchInput}
                className="search-bar"/>
            </div>
            <div className="user-account-table">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CREATED BY</th>
                        <th>DOCTOR</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                        <th>START TIME</th>
                        <th>END TIME</th>
                    </tr>
                </thead>
                <tbody>{renderTableData()}</tbody>
            </Table>
            </div>
            <div className='pagination'>
                    <li className="page-item"> 
                            <a className="page-link" 
                                onClick={goToPrevPage}  // Click event handler for navigating to previous page
                                href='#'>
                                
                                Prev
                            </a>
                    </li>
                    {renderPages()}
                    <li className="page-item"> 
                            <a className="page-link" 
                                onClick={goToNextPage}
                                href='#'>  
                                Next
                            </a>
                    </li>

            </div>
            <Modal show={openModal} onHide={()=> {
                setCallEffect(!callEffect)
                setOpenModal(false)}}>
                <Modal.Header closeButton >
                <Modal.Title>Shift Created Succesfully</Modal.Title>
                </Modal.Header>
                <Modal.Body></Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> {
                setCallEffect(!callEffect)
                setOpenModal(false)}}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openModalError} onHide={()=> setOpenModalError(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Error!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ErrorMsg}</Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> setOpenModalError(false)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
   
};
  
export default Shifts;