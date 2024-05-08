import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBarAdmin.css";
import { Link } from "react-router-dom";

const NavBarAdmin = () => {
    return(
        <div>
            <nav className="navbar-admin">   
                <div className="container-admin">
                    <div className="brand">
                        MEDICS
                    </div>
                    <div className="nav-elements-admin">
                        <NavLink to="/" className={"nav-link-admin"}>Shifts</NavLink>
                        <NavLink to="/" className={"nav-link-admin"}>Reception</NavLink>
                        <NavLink to="/" className={"nav-link-admin"}>Doctors</NavLink>
                        <NavLink to="/" className={"nav-link-admin"}>Pharmacy</NavLink>
                        <NavLink to="/" className={"nav-link-admin"}>Patients</NavLink>
                    </div>
                </div>
            </nav>
        </div>
    )
};

export default NavBarAdmin;