import { json, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Button from '@mui/material/Button';
import "../css/Login.css"
import { Modal} from "react-bootstrap";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("")
    const[openModalError, setOpenModalError] = useState(false);

    const navigate= useNavigate()

    const onSubmitHandler = async() => {
        const responseToken= await postData()
        if(responseToken!=null){
            setToken((responseToken.accessToken))
            console.log(token)
            sessionStorage.setItem("accessToken",responseToken.accessToken)
            sessionStorage.setItem("userName",userName)
            sessionStorage.setItem("userRole",responseToken.userRole)
            //add navigation
            if(responseToken.userRole=="Receptionist"){
                navigate(`/receptionhomepage/${userName}/${responseToken.userRole}`)
            }else if(responseToken.userRole=="Admin"){
                navigate(`/adminhomepage/${userName}/${responseToken.userRole}`)
            }
        }

    };


    async function postData() {
        console.log(`Post Data for login`);
        // const userName = sessionStorage.getItem("use");
        const response = await fetch(
          "http://localhost:4000/user/login",
          {
            method: "POST",
            withCredentials: false,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userName: userName,
              password: password
            })
          }
        );
        if(response.status==200){
            return response.json();
        }
        else{
            setOpenModalError(true)
            return null
        }

      }

    return (
        <div>
            <div className="form">
            <h1 className="title">Login</h1>
                <form>
                    <div className="individual-text-field">
                        <label className="labels">
                            Username
                        </label>
                        <ul></ul>
                        <input
                            type="text"
                            value={userName}
                            placeholder="Enter username"
                            onChange={(e) => setUserName(e.target.value)}
                            className="input-field"
                        />
                        <ul></ul>
                    </div>
                    <div className="individual-text-field">
                        <label className="labels">
                            Password
                        </label>
                        <ul></ul>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        <ul></ul>
                    </div>
                    <Button className="submit-button" variant="contained" onClick={onSubmitHandler}>
                        Log in
                    </Button>
                </form>
            </div>
        <Modal show={openModalError} onHide={()=> setOpenModalError(false)}>
            <Modal.Header closeButton >
            <Modal.Title>ERROR</Modal.Title>
            </Modal.Header>
            <Modal.Body>Incorrect username or password. Please try again</Modal.Body>
            <Modal.Footer>
            <Button className="button" variant="contained" onClick={()=> setOpenModalError(false)}>
                Okay
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
   
};
  
export default Login;