import { json, useNavigate, useParams } from "react-router-dom";
import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import "../css/CreateInvoice.css"
import { Modal} from "react-bootstrap";
import NavBarAdmin from "./NavBarAdmin";
import { Checkbox,MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';


const CreateSaleInvoice = () => {

    // const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    // const usertype= sessionStorage.getItem("userRole")
    const userName= useParams().userName
    const usertype= useParams().userrole

    const [callEffect,setCallEffect]= useState(false);
    const [selectedMedicines, setSelectedMedicines] = useState([]);

    const [phoneNumber, setPhoneNumber] = useState("");

    const [medicines, setMedicines] = useState([]);

    const [subTotal, setSubtTotal] = useState(0);
    const [overallDiscount, setOverallDiscount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const [searchInput, setSearchInput] = useState("");

    const[medicineModal, setMedicineModal] = useState(false);

    const[paymentModel, setPaymentModal] = useState(false);

    const packingOptions = [
        { value: 'Unit/Tablets', label: 'Unit/Tablets' },
        { value: 'Box/Pack', label: 'Box/Pack' }
    ];

    const navigate= useNavigate()

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

    const isCheckedMedicine = (medicineId) => {

        if(selectedMedicines.some(medicine => medicine.medicineId === medicineId)) {
            return true
        }else{
            return false
        }
    }

    const toggleSelectMedicine = (medicine) => {

        console.log("hello", medicine.medicineName)
        if(selectedMedicines.some(med => med.medicineId === medicine.medicineId)) {
            console.log("in if")
            setSelectedMedicines(selectedMedicines.filter(medToBeKept => medToBeKept.medicineId!==medicine.medicineId))
        }else{
            console.log("in else")
            var tempMed={}
            tempMed.medicineId= medicine.medicineId
            tempMed.medicineName= medicine.medicineName
            tempMed.retailPrice= medicine.retailPrice
            tempMed.retailPricePerUnit= medicine.retailPrice / medicine.unitPerBoxQuantity
            tempMed.unitPerBoxQuantity= medicine.unitPerBoxQuantity
            tempMed.totalQuantityToBuy= 0
            tempMed.priceToBeDisplayed=0
            tempMed.packingType=""
            tempMed.quantity=0
            tempMed.totalBill=0
            tempMed.discount=0
            tempMed.netTotal=0
            setSelectedMedicines(selectedMedicines => [...selectedMedicines, tempMed])

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
                const { medicineId, medicineName, medicineType, boxQuantity, unitPerBoxQuantity, selectStatus}= medicine
                return(
                <tr>
                    <td>
                        {medicineName}
                    </td>
                    <td>
                        {boxQuantity}
                    </td>
                    <td>
                        <Checkbox
                            checked= {isCheckedMedicine(medicineId)} 
                            onChange={()=> toggleSelectMedicine(medicine)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </td>
                </tr>
                )
            }
            )    
        )   

    }
    const calculateTotals= () => {
        
        var subTot=0
        selectedMedicines.map((med,index)=>{
            subTot= subTot + med.netTotal
        })
        setSubtTotal(subTot)

        var grandTot= (subTot * (100-overallDiscount)) /100
        setGrandTotal(grandTot)
        
    }

    const handleMedQuantity= (index,qty) => {

        let newArr = [...selectedMedicines]; 
        newArr[index].quantity = qty; 
        newArr[index].totalBill= qty *  newArr[index].priceToBeDisplayed
        if(newArr[index].discount==0){
            newArr[index].netTotal= newArr[index].totalBill
        }
        if(newArr[index].packingType==="Unit/Tablets"){
            newArr[index].totalQuantityToBuy= qty
 
        }else{ //if its a box
            newArr[index].totalQuantityToBuy= qty * newArr[index].unitPerBoxQuantity
        }
        setSelectedMedicines(newArr);
        calculateTotals()

    }

    const handleMedPacking= (index,packing) => {

        let newArr = [...selectedMedicines]; 
        newArr[index].packingType = packing;
        newArr[index].totalQuantityToBuy= 0
        newArr[index].quantity= 0
        newArr[index].totalBill= 0
        newArr[index].discount= 0
        newArr[index].netTotal= 0
        if(packing==="Unit/Tablets"){
            newArr[index].priceToBeDisplayed= newArr[index].retailPricePerUnit
 
        }
        else{
            newArr[index].priceToBeDisplayed= newArr[index].retailPrice
        }
        setSelectedMedicines(newArr);


    }

    const handleDiscountQuantity= (index,disc) => {

        let newArr = [...selectedMedicines]; 
        newArr[index].discount = disc; 
        newArr[index].netTotal = (newArr[index].totalBill * (100-disc)) / 100; 
        setSelectedMedicines(newArr); 
        calculateTotals()  
    }

    const renderSelectedProducts = () =>{
        return(
            selectedMedicines.map((medicine, index) => {
                const { medicineId, medicineName, packingType, priceToBeDisplayed, retailPrice, quantity, totalBill, discount, netTotal}= medicine
                return(
                <tr>
                    <td>
                        {medicineId}
                    </td>
                    <td>
                        {medicineName}
                    </td>
                    <td>
                        <TextField
                            select
                            value={packingType}
                            onChange={e => {handleMedPacking(index,e.target.value)}}
                            style={{width: '29vh'}}
                            sx={{
                                "& .MuiInputBase-input": { fontSize: 15, height: 1, padding: 2 },
                            }}
                            >
                            {packingOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </td>
                    <td style={{ width: '40vh' }}>
                        Rs. {priceToBeDisplayed}
                    </td>
                    <td style={{ width: '15vh' }}>
                        <TextField 
                            type="number"
                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                            value={quantity} 
                            onChange={e => handleMedQuantity(index,e.target.value)}>
                        </TextField>
                    </td>
                    <td>
                        Rs. {totalBill}
                    </td>
                    <td>
                        <TextField 
                            type="number"
                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                            value={discount} 
                            onChange={e => handleDiscountQuantity(index,e.target.value)}>
                        </TextField>
                    </td>
                    <td>
                        Rs. {netTotal}
                    </td>
                </tr>
                )
            }
            )    
        )
    }

    const setDiscount = (value) => {

        setOverallDiscount(value)
        var grandTot= (subTotal * (100-value)) /100
        setGrandTotal(grandTot)

    }

    async function handleMakePayment() {

        console.log("in oayment")
        const response = await fetch(
            `http://localhost:4000/productSaleInvoice/createSaleInvoice`,
            {
              method: "POST",
              withCredentials: true,
              credentials: "include",
              headers: {
                  Authorization: `Bearer ${tokenID}`,
                  "Content-Type": "application/json"
                },
              body: JSON.stringify({
                patientPhone: phoneNumber,
                overallDiscount: overallDiscount,
                grandTotal: grandTotal,
                products: selectedMedicines
              })
            }
        );
        if(response.status===200 ){
            console.log("successful")
            setPaymentModal(true)
            
        }else{
            console.log("some error")
        } 
    }

    return (
        <div>
            <NavBarAdmin/>
            <h1 className="welcome-sign">Sale Invoice</h1>
                <div className="invoice-whole-body">
                    <div>
                        <span>
                            <h8 className="patient-information">Phone Number: </h8>
                            <TextField
                                style={{ width: '30vh' }} 
                                sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                value={phoneNumber} 
                                // label= "Phone Number"
                                onChange={e => setPhoneNumber(e.target.value)}>
                            </TextField>
                            <Button className="add-prod-button" variant="link" onClick={()=> setMedicineModal(true)}>Add Product +</Button>
                        </span>
                    </div>

                    <div className="invoice-table-div">
                        <Table bordered hover className="table-css"  >
                            <thead className="supplier-table-heading">
                                <tr>
                                        <th>ID</th>
                                        <th>PRODUCT</th>
                                        <th>PACKING</th>
                                        <th>RETAIL PRICE PER UNIT</th>
                                        <th>QTY</th>
                                        <th>TOTAL</th>
                                        <th>DISCOUNT (%)</th>
                                        <th>NET TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderSelectedProducts()}
                            </tbody>
                        </Table>
                    </div>

                    <div className="grand-total-bill">
                        <Table bordered hover className="bill-table-css" >
                                <thead >
                                    <tr>
                                            <th style={{ width: '20vh' }} >SUB-TOTAL</th>
                                            <td>{subTotal}</td>
                                    </tr>
                                    <tr>
                                            <th>DISCOUNT (%)</th>
                                            <td>
                                                <TextField
                                                    style={{ width: '15vh' }} 
                                                    type="number"
                                                    sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                                                    value={overallDiscount} 
                                                    onChange={e => setDiscount(e.target.value)}>
                                                </TextField>
                                            </td>
                                    </tr>
                                    <tr>
                                            <th>GRAND TOTAL</th>
                                            <td>{grandTotal}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </Table>
                            <Button  
                                    className="payment-button" 
                                    variant="contained" 
                                    onClick={() => handleMakePayment()}
                                    >
                                    MAKE PAYMENT
                                </Button>
                    </div>
                </div>
            

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
                                    <th>QUANTITY</th>
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
                <Button className="button" variant="contained" onClick={()=>setMedicineModal(false)}>
                    SELECT MEDICINE
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal className="select-med-table" show={paymentModel} onHide={() => setPaymentModal(false)}>
                <Modal.Header closeButton >
                <Modal.Title>PAYMENT SUCCESSFUL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your payment has been successfully saved.
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
  
export default CreateSaleInvoice;