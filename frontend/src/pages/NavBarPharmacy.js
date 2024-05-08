import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBarReception.css";
import { Link } from "react-router-dom";

const NavBarPharmacy = () => {
    return(
        <div>
            <nav className="navbar">   
                <div className="container">
                    <div className="brand">
                        MEDICS
                    </div>
                    <div className="nav-elements">
                        <NavLink to="/" className={"nav-link"}>Medicines</NavLink>
                        <NavLink to="/" className={"nav-link"}>Sales</NavLink>
                        <NavLink to="/" className={"nav-link"}>Receiving</NavLink>
                        <NavLink to="/" className={"nav-link"}>Refund</NavLink>
                    </div>
                </div>
            </nav>
        </div>
    )
};

export default NavBarPharmacy;