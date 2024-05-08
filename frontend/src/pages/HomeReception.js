import { useNavigate, useParams } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import "../css/homeReception.css";

import NavBarReception from "./NavBarReception";
import NavBarAdmin from "./NavBarAdmin";

const HomeReception = () => {

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

    const navigateRegisterPatient = async() => {

        navigate(`/registerpatient/${userName}/${usertype}`)
    };

    return (
        <div>
            {GetNavbar()}
            <h1 className="welcome-sign">Welcome {userName}!</h1>
            <div>
                <Card className="card-reception">
                <CardActionArea> 
                    <CardContent onClick={()=> navigate(`/shifts/${userName}/${usertype}`)}>
                    SHIFTS
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
            <ul></ul>
            <div>
                <Card className="card-reception">
                <CardActionArea> 
                    <CardContent onClick={navigateRegisterPatient}>
                    PATIENT REGISTRATION
                    </CardContent>
                </CardActionArea>
                </Card>
            </div>
        </div>
    )
   
};
  
export default HomeReception;