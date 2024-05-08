import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBarReception.css";
import { Link } from "react-router-dom";

const NavBarReception = () => {
    return(
        <div>
            <nav className="navbar">   
                <div className="container">
                    <div className="brand">
                        MEDICS
                    </div>
                    <div className="nav-elements">
                        <NavLink to="/" className={"nav-link"}>Patients</NavLink>
                        <NavLink to="/" className={"nav-link"}>Shifts</NavLink>
                    </div>
                </div>
            </nav>
        </div>
    )
};

export default NavBarReception;