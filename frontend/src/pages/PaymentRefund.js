import { json, useNavigate, useParams } from "react-router-dom";
import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import "../css/PaymentRefund.css"
import { Modal} from "react-bootstrap";
import NavBarAdmin from "./NavBarAdmin";
import { Checkbox,MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';


const PaymentRefund = () => {

    const tokenID= sessionStorage.getItem("accessToken")
    const userName= useParams().userName
    const usertype= useParams().userrole

    const [callEffect,setCallEffect]= useState(false);

    const [selectedPayment, setSelectedPayment] = useState();
    const [medicines, setMedicines] = useState([]);

    const [phoneNumber, setPhoneNumber] = useState("");

    const [payments, setPayments] = useState([]);

    const [refundedAmount, setRefundedAmount] = useState(0);

    const [searchInput, setSearchInput] = useState("");

    const[medicineModal, setMedicineModal] = useState(false);

    const[paymentModel, setPaymentModal] = useState(false);

    const navigate= useNavigate()

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }


    useEffect(() => {
        async function getAllPayments() {
            console.log(`in get all payments`);
            const response = await fetch(
                `http://localhost:4000/productSaleInvoice/all`,
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

        getAllPayments().then((response)=>{
            var allPayments= response
            setPayments(allPayments)
        })

    }, [callEffect]);

    const handleRefundQty= (index,qty) => {

        var tempMedicines= [...medicines]
        console.log(tempMedicines)
        const maxQty= tempMedicines[index].quantity 

        if(qty <= maxQty){
            (tempMedicines[index]).refundQty= qty
            tempMedicines[index].refundedAmount =(((tempMedicines[index]).netTotal/(tempMedicines[index]).quantity) * qty)

            setMedicines(tempMedicines)

            var tempPayment= selectedPayment
            tempPayment.products= tempMedicines

            setSelectedPayment(tempPayment)

            let tempAmount=0
            medicines.map((medicine,index) =>{
                tempAmount= tempAmount + medicine.refundedAmount
            })
            setRefundedAmount(tempAmount)
        }else{
            // give error
        }  



    }

    const renderSelectedProducts = () =>{

        return(
            selectedPayment.products.map((medicine, index) => {
                const { medicineId, medicineName, packingType, priceToBeDisplayed, retailPricePerUnit, quantity, totalBill, discount, netTotal, refundQty}= medicine
                return(
                <tr>
                    <td>
                        {medicineId}
                    </td>
                    <td>
                        {medicineName}
                    </td>
                    <td>
                        {packingType}
                    </td>
                    <td>
                        {retailPricePerUnit}
                    </td>
                    <td>
                        {quantity}
                    </td>
                    <td>
                    <TextField 
                            type="number"
                            sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 5, padding: 2 } }} 
                            value={refundQty} 
                            onChange={e => handleRefundQty(index,e.target.value)}>
                        </TextField>
                    </td>

                    <td style={{ width: '40vh' }}>
                        Rs. {totalBill}
                    </td>
                    <td>
                        Rs. {discount}
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

    const handlePaymentSelection = (payment) => {
         
        let meds= payment.products
        meds.map((medicine,index) =>{
            medicine.refundQty=0
            medicine.refundedAmount=0
        })
        setMedicines(meds)
        payment.products= meds
        setSelectedPayment(payment)

    }

    const renderPayments = () => {

        return(
            payments.filter((payment,index) =>{
                const { id, patientPhone,dateTime, overallDiscount, grandTotal}= payment //destructuring

                if(searchInput === ""){
                    return payment
                }else if (patientPhone.toLowerCase().includes(searchInput.toLowerCase())){
                    return payment 
                }

            }).map((payment, index) => {
                const { id, patientPhone,dateTime, overallDiscount, grandTotal}= payment 
                return(
                <tr onClick={()=> handlePaymentSelection(payment)}>
                    <td>
                        {id}
                    </td>
                    <td>
                        {dateTime}
                    </td>
                    <td>
                        {patientPhone}
                    </td>
                    <td>
                        {grandTotal}
                    </td>
                </tr>
                )
            }
            )    
        )
    }

    async function handleMakeRefund() {

        console.log("in refund")
        const response = await fetch(
            `http://localhost:4000/productRefund/makeRefund`,
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
                refundedAmount: refundedAmount,
                products: selectedPayment.products
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
            <h1 className="welcome-sign">PAYMENT REFUNDS</h1>
            {selectedPayment==null ?
                <div>
                    <div className="search-bar-div">
                        <input
                        type="text"
                        placeholder="Search Payment by Phone Number"
                        onChange={handleChange}
                        value={searchInput}
                        className="search-bar"/>
                    </div>
                    <div className="select-payment-table-div">
                        <Table bordered hover  >
                            <thead className="payment-table-heading">
                                <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>CONTACT INFORMATION</th>
                                        <th>PAYMENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderPayments()}
                            </tbody>
                        </Table>
                    </div>   
                </div>
            
            :
                <div className="invoice-whole-body">
                    <div>
                        <span>
                            <h8 className="patient-information">Phone Number: </h8>
                            {selectedPayment.patientPhone}
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
                                        <th>REFUND QTY</th>
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
                                        <th style={{ width: '20vh' }} >TOTAL</th>
                                        <td>{(selectedPayment.grandTotal * 100)/(100-selectedPayment.overallDiscount)}</td>
                                </tr>
                                <tr>
                                        <th>DISCOUNT (%)</th>
                                        <td>{selectedPayment.overallDiscount}</td>
                                </tr>
                                <tr>
                                        <th>GRAND TOTAL</th>
                                        <td>{selectedPayment.grandTotal}</td>
                                </tr>
                                <tr>
                                        <th>REFUNDABLE AMOUNT</th>
                                        <td>{refundedAmount}</td>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>

                        <Button  
                            className="payment-button" 
                            variant="contained" 
                            onClick={() => handleMakeRefund()}
                            >
                            REFUND
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
                                    <th>QUANTITY</th>
                                    <th>SELECT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {selectMedicinesFunction()} */}
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
                    Your refund has been successfully saved.
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
  
export default PaymentRefund;