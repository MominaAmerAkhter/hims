import { useNavigate, useParams } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import "../css/homeReception.css";

import NavBarReception from "./NavBarReception";
import NavBarAdmin from "./NavBarAdmin";

const HomePharmacy = () => {

    const userName= sessionStorage.getItem("userName")
    const navigate= useNavigate()
    const tokenID= sessionStorage.getItem("accessToken")
    console.log("tokenID",tokenID)
    const usertype= useParams().userrole

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

    return (
        <div>
            {GetNavbar()}
            <h1 className="welcome-sign">Welcome {userName}!</h1>
            <div>
                <Card className="card-reception">
                <CardActionArea> 
                    <CardContent onClick={()=> navigate(`/pharmacyhomepage/addmedicine/${userName}/${usertype}`)}>
                    ADD MEDICINES
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div>
                <Card className="card-reception">
                <CardActionArea> 
                    <CardContent onClick={()=> navigate(`/pharmacyhomepage/createsaleinvoice/${userName}/${usertype}`)}>
                    POINT OF SALE
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div>
                <Card className="card-reception">
                <CardActionArea> 
                    <CardContent onClick={()=> navigate(`/pharmacyhomepage/createinvoice/${userName}/${usertype}`)}>
                    CREATE SUPPLIER INVOICE
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div>
                <Card className="card-reception">
                <CardActionArea> 
                    <CardContent onClick={()=> navigate(`/pharmacyhomepage/paymentrefund/${userName}/${usertype}`)}>
                    PAYMENT REFUNDS
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
        </div>
    )
   
};
  
export default HomePharmacy;