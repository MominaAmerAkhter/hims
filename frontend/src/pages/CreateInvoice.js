import { json, useNavigate, useParams } from "react-router-dom";
import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import "../css/CreateInvoice.css"
import { Modal} from "react-bootstrap";
import NavBarAdmin from "./NavBarAdmin";
import { Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';



const CreateInvoice = () => {

    // const userName= sessionStorage.getItem("userName")
    const tokenID= sessionStorage.getItem("accessToken")
    // const usertype= sessionStorage.getItem("userRole")
    const userName= useParams().userName
    const usertype= useParams().userrole

    const [callEffect,setCallEffect]= useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState();
    const [selectedMedicines, setSelectedMedicines] = useState([]);

    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [subTotal, setSubtTotal] = useState(0);
    const [overallDiscount, setOverallDiscount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const [searchInput, setSearchInput] = useState("");

    const[medicineModal, setMedicineModal] = useState(false);

    const[paymentModel, setPaymentModal] = useState(false);

    const navigate= useNavigate()

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }


    async function getSupplierMedicines(supplier) {
        console.log(`in get supplier  medicines`, supplier);
        const response = await fetch(
            `http://localhost:4000/medicine/supplierMedicines/${supplier.supplierId}`,
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

    async function handleSupplierSelection(supplier) {
        
        setSelectedSupplier(supplier)
        getSupplierMedicines(supplier).then((response)=>{
            var allMeds= response
            setMedicines(allMeds)
        })
    }

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
            tempMed.boxTradePrice= medicine.boxTradePrice
            tempMed.quantityOfBox=0 // number of box
            tempMed.unitPerBoxQuantity= medicine.unitPerBoxQuantity // box * unit per box
            tempMed.totalQuantity=0 // box * unit per box
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
                    return medicine 
                }else if (medicineName.toLowerCase().includes(searchInput.toLowerCase())){
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
        newArr[index].quantityOfBox = qty; 
        console.log("unit", newArr[index].unitPerBoxQuantity)
        newArr[index].totalQuantity = qty * newArr[index].unitPerBoxQuantity; 
        console.log("unit", newArr[index].totalQuantity)
        newArr[index].totalBill= qty *  newArr[index].boxTradePrice
        if(newArr[index].discount==0){
            newArr[index].netTotal= newArr[index].totalBill
        }
        setSelectedMedicines(newArr);
        calculateTotals()

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
                const { medicineId, medicineName, boxTradePrice, quantityOfBox, totalBill, discount, netTotal}= medicine
                return(
                <tr>
                    <td>
                        {medicineId}
                    </td>
                    <td>
                        {medicineName}
                    </td>
                    <td style={{ width: '40vh' }}>
                        Rs. {boxTradePrice}
                    </td>
                    <td style={{ width: '15vh' }}>
                        <TextField 
                            type="number"
                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                            value={quantityOfBox} 
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


    const renderSuppliersData = () => {

        return(
            suppliers.filter((supplier,index) =>{
                const { supplierId, supplierName, companyName}= supplier //destructuring

                if(searchInput === ""){
                    return supplier
                }else if (supplierName.toLowerCase().includes(searchInput.toLowerCase())){
                    return supplier 
                }

            }).map((supplier, index) => {
                const { supplierId, supplierName, companyName}= supplier
                return(
                <tr onClick={()=> handleSupplierSelection(supplier)}>
                    <td>
                        {supplierName}
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

        const response = await fetch(
            `http://localhost:4000/productRecInvoice/createInvoice`,
            {
              method: "POST",
              withCredentials: true,
              credentials: "include",
              headers: {
                  Authorization: `Bearer ${tokenID}`,
                  "Content-Type": "application/json"
                },
              body: JSON.stringify({
                supplierId: selectedSupplier.supplierId,
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
            <h1 className="welcome-sign">Create Invoice</h1>
            {selectedSupplier==null ?
                <div>
                    <div className="search-bar-div">
                        <input
                        type="text"
                        placeholder="Search Supplier"
                        onChange={handleChange}
                        value={searchInput}
                        className="search-bar"/>
                    </div>
                    <div className="select-supplier-table-div">
                        <Table bordered hover  >
                            <thead className="supplier-table-heading">
                                <tr>
                                        <th>SUPPLIERS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderSuppliersData()}
                            </tbody>
                        </Table>
                    </div>   
                </div>:
                <div className="invoice-whole-body">
                    <div>
                        <span>
                            <h8 className="supplier-info">Company Name: </h8>
                            {selectedSupplier.companyName}
                        </span>
                        <ul></ul>
                        <span>
                            <h8 className="supplier-info">Address: </h8>
                            {selectedSupplier.supplierAddress}
                        </span>
                        <ul></ul>
                        <span>
                            <h8 className="supplier-info">Phone Number: </h8>
                            {selectedSupplier.companyPhone}
                            <Button className="add-prod-button" variant="link" onClick={()=> setMedicineModal(true)}>Add Product +</Button>
                        </span>
                    </div>

                    <div className="invoice-table-div">
                        <Table bordered hover className="table-css"  >
                            <thead className="supplier-table-heading">
                                <tr>
                                        <th>ID</th>
                                        <th>PRODUCT</th>
                                        <th>TRADE PRICE PER BOX</th>
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
            }

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
  
export default CreateInvoice;