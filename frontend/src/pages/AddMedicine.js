import { Link,useNavigate, useParams } from "react-router-dom";
import "../css/AddMedicine.css";
import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import { Modal} from "react-bootstrap";
import { Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import {MenuItem, Radio,FormControlLabel, RadioGroup } from '@mui/material';
import NavBarAdmin from "./NavBarAdmin";



const AddMedicines = () => {

    // const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    // const usertype= sessionStorage.getItem("userRole")
    const userName= useParams().userName
    const usertype= useParams().userrole

    const navigate= useNavigate()

    const [callEffect,setCallEffect]= useState(false);

    const[isProductNew, setIsProductNew] = useState(false);

    const[saveModal, setSaveModal] = useState(false);
    const[openModal, setOpenModal] = useState(false);
    const[medicineModal, setMedicineModal] = useState(false);

    const [medicines, setMedicines] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState([]);

    const [medName, setMedName] = useState("");
    const [medType, setMedType] = useState(""); 
    const [unitPerBox, setUnitPerBox] = useState("");
    const [retPrice, setRetPrice] = useState("");
    const [tradePrice, setTradePrice] = useState("");

    const [searchInput, setSearchInput] = useState("");

    const [isMedButtonDisabled, setIsMedButtonDisabled] = useState(true);

    const options = [
        { value: 'Tablets/Capsules', label: 'Tablets/Capsules' },
        { value: 'Sachet', label: 'Sachet' },
        { value: 'Injection', label: 'Injection' },
        { value: 'Syrup', label: 'Syrup' },
        { value: 'Lotion', label: 'Lotion' },
        { value: 'Cream', label: 'Cream' },
        { value: 'Ointment', label: 'Ointment' },
        { value: 'Drops', label: 'Drops' },
        { value: 'Gel', label: 'Gel' },
        { value: 'Soap', label: 'Soap' },
        { value: 'Paste', label: 'Paste' },
        { value: 'Other', label: 'Other' },
    ];


    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
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
            setMedicines(allMeds)
        })

    }, [callEffect]);

    useEffect(() => {
        async function getAllSuppliers() {
            console.log(`in get all suppliers`);
            const response = await fetch(
                `http://localhost:4000/supplier/all`,
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

        getAllSuppliers().then((response)=>{
            var allSuppliers= response
            setSuppliers(allSuppliers)
        })

    }, [callEffect]);

    const toggleSelectSupplier = (supplier) => {

        if(supplier.supplierName===selectedSupplier.supplierName){
            setSelectedSupplier([])
            setIsMedButtonDisabled(true)
        }else{
            setSelectedSupplier(supplier)
            setIsMedButtonDisabled(false)
        }
    }

    async function handleSaveMedicine(){

        var newOldProd="old"
        if(isProductNew){
            newOldProd="new"
        }

        const responseTrade = await fetch(
            `http://localhost:4000/tradeprice/${newOldProd}/${selectedSupplier.supplierId}/${selectedMedicine.medicineId}`,
            {
              method: "POST",
              withCredentials: true,
              credentials: "include",
              headers: {
                  Authorization: `Bearer ${tokenID}`,
                  "Content-Type": "application/json"
                },
              body: JSON.stringify({
                boxTradePrice: tradePrice,
                unitTradePrice: (tradePrice/unitPerBox)
              })
            }
        );
        const responseMed = await fetch(
            `http://localhost:4000/medicine/${newOldProd}/${selectedMedicine.medicineId}`,
            {
              method: "POST",
              withCredentials: true,
              credentials: "include",
              headers: {
                  Authorization: `Bearer ${tokenID}`,
                  "Content-Type": "application/json"
                },
              body: JSON.stringify({
                medicine: selectedMedicine,
                unitPerBoxQuantity: unitPerBox,
                retailPrice: retPrice
              })
            }
        );
        if(responseTrade.status===200 && responseMed.status===200){
            console.log("successful")
            setSaveModal(true)
            
        }else{
            console.log("some error")
        } 
    }

    const handleSelectMedicine = async () => {

        const response = await fetch(
            `http://localhost:4000/tradeprice/${selectedSupplier.supplierId}/${selectedMedicine.medicineId}`,
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
            var respTradePrice= response.json()
            respTradePrice.then((response)=>{
                setTradePrice(response)
                console.log("trade pride", tradePrice)
            })

        }else{
            const err= (response.json()).message
        } 
        setMedicineModal(false)
    }

    const isCheckedSupplier = (supplier) => {

        if(supplier===selectedSupplier.supplierName){
            return true
        }else{
            return false
        }
    }
    

    const isCheckedMedicine = (medicine) => {

        if(medicine===selectedMedicine.medicineName){
            return true
        }else{
            return false
        }
    }

    const setMedicine = (medicine) => {
        setSelectedMedicine(medicine)
        console.log("selected medicine is", medicine)
        setMedName(medicine.medicineName)
        setMedType(medicine.medicineType)
        setUnitPerBox(medicine.unitPerBoxQuantity)
        setRetPrice(medicine.retailPrice)
    }

    const renderSuppliersData = () => {

        return(
            suppliers.filter((supplier,index) =>{
                const { supplierId, supplierName, companyName}= supplier //destructuring

                if(searchInput === ""){
                    return supplier
                }else if (supplierName.toLowerCase().includes(searchInput.toLowerCase()) && searchInput.length>2){
                    return supplier 
                }

            }).map((supplier, index) => {
                const { supplierId, supplierName, companyName, selectStatus}= supplier
                return(
                <tr>
                    <td>
                        {supplierName}
                    </td>
                    <td>
                        {companyName}
                    </td>
                    <td>
                        <Checkbox
                            checked= {isCheckedSupplier(supplierName)} 
                            onChange={()=>toggleSelectSupplier(supplier)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </td>
                </tr>
                )
            }
            )    
        )
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
                            checked= {isCheckedMedicine(medicineName)} 
                            onChange={()=> {setMedicine(medicine)}}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </td>
                </tr>
                )
            }
            )    
        )   

    }

    const handleNewMedicine = (value) => {

        console.log("the value is",value)
        if(value==="old"){
            setIsProductNew(false)
        }else{
            setIsProductNew(true)
        }
        
    }

    return (
        <div>
            <NavBarAdmin/>
            <h1 className="welcome-sign">Add/Update Medicine</h1>
            <div className="row">
                <div className="column">
                    <div className="supplier-medicine-selection">
                        {selectedSupplier.length!==0 ?
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>SUPPLIER NAME</th>
                                        <td>{selectedSupplier.supplierName}</td>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </Table>:
                            <Table striped bordered hover>
                                <thead>
                                    <tr className="no-supplier-alert">
                                        <td>No supplier has been selected yet</td>    
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </Table>                   
                            }
                        <Button  className="medication-button" variant="contained" onClick={() => setOpenModal(true)} >
                            SELECT SUPPLIER
                        </Button>
                    </div>
                    <hr class="dashed"></hr>
                    <div className="supplier-medicine-selection">
                        {selectedMedicine.length!==0 ?
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>MEDICINE NAME</th>
                                            <td>{selectedMedicine.medicineName}</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </Table>:
                                <Table striped bordered hover>
                                    <thead>
                                        <tr className="no-supplier-alert">
                                            <td>No medicine has been selected yet</td>    
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </Table>                   
                        }
                            <Button  
                                className="medication-button" 
                                variant="contained" 
                                onClick={() => setMedicineModal(true)}
                                disabled={isMedButtonDisabled}>
                                SELECT MEDICINE
                            </Button>                    
                    </div>

                </div>
                <div className="column">
                    <RadioGroup
                        className="radio-buttons"
                        defaultValue="old"
                        name="radio-buttons-group">
                        <FormControlLabel 
                            value="new" 
                            onClick={()=> handleNewMedicine("new")} 
                            control={<Radio />} 
                            label="Add New Medicine" />
                        <FormControlLabel 
                            value="old"
                            onClick={()=> handleNewMedicine("old")}
                            control={<Radio />} 
                            label="Update Medicine" />
                    </RadioGroup>
                    <ul></ul>
                    <Table striped bordered hover>
                    <thead>
                            <tr>
                                <th style={{ width: '30vh' }}>MEDICINE NAME</th>
                                <td>
                                    <TextField 
                                        sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                        value={medName} 
                                        onChange={e => setMedName(e.target.value)}></TextField>
                                </td>
                            </tr>
                            <tr>
                                <th>MEDICINE TYPE</th>
                                <td>
                                    <TextField
                                    select
                                    value={medType}
                                    onChange={e => {setMedType(e.target.value)}}
                                    style={{width: '29vh'}}
                                    sx={{
                                        "& .MuiInputBase-input": { fontSize: 15, height: 1, padding: 2 },
                                    }}
                                    >
                                    {options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                </td>
                            </tr>
                        </thead>
                    </Table>
                    <Table striped bordered hover>
                    <thead>
                            <tr>
                                <th style={{ width: '30vh' }}>UNIT PER BOX</th>
                                <td>
                                    <TextField 
                                        sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                        value={unitPerBox} 
                                        type="number"
                                        onChange={e => setUnitPerBox(e.target.value)}></TextField>
                                </td>
                            </tr>
                            <tr>
                                <th>RETAIL PRICE PER BOX</th>
                                <td>
                                    <TextField 
                                        sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                        value={retPrice} 
                                        type="number"
                                        onChange={e => setRetPrice(e.target.value)}></TextField>
                                </td>
                            </tr>
                            <tr>
                                <th>TRADE PRICE PER BOX</th>
                                <td>
                                    <TextField 
                                        sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                        value={tradePrice} 
                                        type="number"
                                        onChange={e => setTradePrice(e.target.value)}></TextField>
                                </td>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </Table>
                </div>
            </div>
            <div className="text-center"> 
                <Button  
                    className="save-button" 
                    variant="contained" 
                    onClick={() => handleSaveMedicine()}>
                    SAVE
                </Button> 
            </div>


            <Modal className="select-med-table" show={openModal} onHide={() => setOpenModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Select Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="search-bar-div">
                        <input
                        type="text"
                        placeholder="Search Supplier"
                        onChange={handleChange}
                        value={searchInput}
                        className="search-bar"/>
                    </div>
                    <div className="select-medicine-table-div">
                        <Table striped bordered hover  >
                            <thead>
                                <tr>
                                        <th>SUPPLIER NAME</th>
                                        <th>COMPANY NAME</th>
                                        <th>SELECT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderSuppliersData()}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={() => setOpenModal(false)}>
                    SELECT SUPPLIER
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal className="select-med-table" show={medicineModal} onHide={() => setMedicineModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>Select Medicine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="search-bar-div">
                        <input
                        type="text"
                        placeholder="Search Medicine"
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
                <Button className="button" variant="contained" onClick={()=>handleSelectMedicine()}>
                    SELECT MEDICINE
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal className="select-med-table" show={saveModal} onHide={() => setSaveModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>SUCCESSFULLY SAVED</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Medicine {selectedMedicine.medicineName} has been saved successfully.
                </Modal.Body>
                <Modal.Footer>
                <Button className="button" variant="contained" onClick={()=> navigate(`/pharmacyhomepage/${userName}/${usertype}`)}>
                    BACK
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
   
};
  
export default AddMedicines;