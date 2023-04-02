import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

import HealthPlusLogo from "../images/healthplusLogo.png";

export default function Navbar(){

    const [active, setActive] = useState("nav__menu");
    const [icon, setIcon] = useState("nav__toggler");
    const navToggle = () => {
        if (active === "nav__menu") {
            setActive("nav__menu nav__active");
        } else setActive("nav__menu");
        if (icon === "nav__toggler") {
            setIcon("nav__toggler toggle");
        } else setIcon("nav__toggler");
    };

    return(
        <nav className="nav">
            <div className="logo-container">
                <Link to="/"><img src={HealthPlusLogo} alt="logo-img"></img></Link>
            </div>
            <ul className={active}>
                {/* STILL NEED TO ADD DYNAMIC IDS TO THE LINK ROUTING */}
                <Link to="/search-hospitals" className="nav__link"><li className="nav__item">View Hospitals</li></Link>
                <Link to="/search-doctors" className="nav__link"><li className="nav__item">View Doctors</li></Link>
                <Link to="/patient/:id/appointments" className="nav__link"><li className="nav__item">Appointments</li></Link>
                <Link to="/patient/:id/record" className="nav__link"><li className="nav__item">Health Record</li></Link> 
                <Link to="patient/:id/profile" className="nav__link"><li className="nav__item">Profile</li></Link>
            </ul>
            <div onClick={navToggle} className={icon}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
        </nav>
    );
}