import { Link,useNavigate, useParams } from "react-router-dom";
import "../css/UserAccounts.css";
import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import { Modal} from "react-bootstrap";

import NavBarAdmin from "./NavBarAdmin";



const UserAccounts = () => {

    // const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    // const usertype= sessionStorage.getItem("userRole")
    const userName= useParams().userName
    const usertype= useParams().userrole

    const navigate= useNavigate()

    const [callEffect,setCallEffect]= useState(false)

    const[openModal, setOpenModal] = useState(false);

    const [users, setUsers] = useState([]);

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    const createNewUser = () => {
        setOpenModal(true)
    }

    useEffect(() => {
        async function getUsers() {
            console.log(`in get request users`);
            const response = await fetch(
                "http://localhost:4000/user/all",
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
                return response.json()
            }else{
                const err= (response.json()).message
            }   
        }

        getUsers().then((response)=>{
            const allusers= response
            setUsers(allusers)
        })
    }, [callEffect]);

    
    
    const renderTableData = () => {

        return users.filter((user,index) =>{
            const { firstName, lastName, userRole} = user; //destructuring

            if(searchInput === ""){
                return user
            }else if (firstName.toLowerCase().includes(searchInput.toLowerCase()) || lastName.toLowerCase().includes(searchInput.toLowerCase()) || 
                userRole.toLowerCase().includes(searchInput.toLowerCase())){
                return user 
            }

        }).map((user,index) =>{
            const { id, firstName, lastName, userRole, phoneNumber } = user; //destructuring
            console.log(id, firstName, lastName, userRole, phoneNumber)
            const name= firstName+" "+lastName
            return (
                <tr>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{userRole}</td>
                    <td>{phoneNumber}</td>
                </tr>
            )
        })
    }



    return (
        <div>
            <NavBarAdmin/>
            <h1 className="welcome-sign">User Accounts</h1>
            <div>
                <Button className="button-create-user" variant="contained" onClick={()=> navigate(`/createuser/${userName}/${usertype}`)}>
                    Create New User
                </Button>
            </div>
            <div className="search-bar-div">
                <input
                type="text"
                placeholder="Search by name/role."
                onChange={handleChange}
                value={searchInput}
                className="search-bar"/>
            </div>
            <div className="user-account-table">
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
                <tbody>{renderTableData()}</tbody>
            </Table>
            </div>
        </div>
    )
   
};
  
export default UserAccounts;