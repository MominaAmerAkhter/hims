import { Link,useNavigate } from "react-router-dom";
// import "../css/ViewPatients.css";
import { useState } from 'react';

import NavBarAdmin from "./NavBarAdmin";
import NavBarReception from "./NavBarReception";



const ViewPatients = () => {

    const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    const usertype= sessionStorage.getItem("userRole")

    const navigate= useNavigate()

    const[openModal, setOpenModal] = useState(true);

    const [users, setUsers] = useState([]);

    
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

    return (
        <div>
            {NavBarAdmin}
            <h1 className="welcome-sign">PATIENTS</h1>
            {/* <Modal show={openModal} onHide={()=> setOpenModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Patients</Modal.Title>
                </Modal.Header>
                <Modal.Body></Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> navigate(`/receptionhomepage/${userName}`)}>
                    Okay
                </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    )
   
};
  
export default ViewPatients;