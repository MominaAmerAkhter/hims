import { useNavigate, useParams } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "../css/homeAdmin.css";
import CardActionArea from '@mui/material/CardActionArea';

import NavBarAdmin from "./NavBarAdmin";



const HomeAdmin = () => {

    const userName= sessionStorage.getItem("userName")
    const navigate= useNavigate()
    const tokenID= sessionStorage.getItem("accessToken")
    console.log("tokenID",tokenID)
    const usertype= useParams().userrole


    return (
        <div>
            <NavBarAdmin/>
            {/* <NavBarReception/> */}
            <h1 className="welcome-sign">Welcome {userName}!</h1>
            <div>
                <Card className="card-admin">
                <CardActionArea> 
                    <CardContent onClick={()=> navigate(`/useraccounts/${userName}/${usertype}`)}>
                        USER ACCOUNTS
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div >
                <Card className="card-admin">
                <CardActionArea>
                    <CardContent onClick={()=> navigate(`/shifts/${userName}/${usertype}`)}>
                    SHIFTS
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div >
                <Card className="card-admin">
                <CardActionArea>
                    <CardContent onClick={()=> navigate(`/pharmacyhomepage/${userName}/${usertype}`)}>
                        PHARMACY
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div >
                <Card className="card-admin">
                <CardActionArea>
                    <CardContent onClick={()=> navigate(`/viewpatients/${userName}/${usertype}`)}>
                        PATIENTS
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
        </div>
    )
   
};
  
export default HomeAdmin;