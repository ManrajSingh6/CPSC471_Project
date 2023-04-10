import React, {useState, useEffect, useContext} from "react";
import { Link, Navigate } from "react-router-dom";
import "./navbar.css";
import HealthPlusLogo from "../images/healthplusLogo.png";
import { UserContext } from "../contexts/UserContext";

export default function Navbar(){

    const [active, setActive] = useState("nav__menu");
    const [icon, setIcon] = useState("nav__toggler");
    const {userInfo, setUserInfo} = useContext(UserContext);

    const userType = userInfo?.usertype;

    useEffect(() => {
        fetch('http://localhost:5000/verifyprofile', {
            credentials: 'include'
        }).then(response => {
            response.json().then(verifiedUserInfo => {
                setUserInfo(verifiedUserInfo);
            });
        });
    }, []);

    const navToggle = () => {
        if (active === "nav__menu") {
            setActive("nav__menu nav__active");
        } else setActive("nav__menu");
        if (icon === "nav__toggler") {
            setIcon("nav__toggler toggle");
        } else setIcon("nav__toggler");
    };

    function logout() {
        fetch('http://localhost:5000/logout', {
          credentials: 'include',
          method: 'POST',
        });
        setUserInfo(null);
        window.location.href = "http://localhost:8000/";
    }

    const username = userInfo?.username;

    return(
        <nav className="nav">
            <div className="logo-container">
                <img src={HealthPlusLogo} alt="logo-img"></img>
            </div>
            { userType === 'patient' && username ? (
                <ul className={active}>
                    <Link to="/search-hospitals" className="nav__link"><li className="nav__item">View Hospitals</li></Link>
                    <Link to="/search-doctors" className="nav__link"><li className="nav__item">View Doctors</li></Link>
                    <Link to={`/patient/${userInfo.userSIN}/appointments`} className="nav__link"><li className="nav__item">Appointments</li></Link>
                    <Link to={`/patient/${userInfo.userSIN}/record`} className="nav__link"><li className="nav__item">Health Record</li></Link> 
                    <Link to={`/patient/${userInfo.userSIN}/profile`} className="nav__link"><li className="nav__item">Profile</li></Link>
                    <li className="nav__item" onClick={logout}>Logout</li>
                </ul> ) : (null)
            }

            { userType === 'doctor' && username ? (
                <ul className={active}>
                    <Link to={`/doctor/${userInfo.userSIN}/appointments`} className="nav__link"><li className="nav__item">Appointments</li></Link>
                    <Link to="/searchpatients" className="nav__link"><li className="nav__item">View Patients</li></Link>
                    <Link to="/search-hospitals" className="nav__link"><li className="nav__item">Hospital Info</li></Link> 
                    <Link to={`/doctor/${userInfo.userSIN}/profile`} className="nav__link"><li className="nav__item">Profile</li></Link>
                    <li className="nav__item" onClick={logout}>Logout</li>
                </ul> ) : (null)
            }

            { userType === 'admin' && username ? (
                <ul className={active}>
                    <Link to="/admin/manage-employees" className="nav__link"><li className="nav__item">Manage Employees</li></Link>
                    <Link to="/admin/manage-patients" className="nav__link"><li className="nav__item">Manage Patients</li></Link>
                    <Link to="/admin/manage-equipment" className="nav__link"><li className="nav__item">Manage Equipment</li></Link>
                    <Link to="/admin/manage-medications" className="nav__link"><li className="nav__item">Manage Medications</li></Link>
                    <Link to="/admin/view-rooms" className="nav__link"><li className="nav__item">Rooms</li></Link> 
                    <Link to={`/admin/${userInfo.userSIN}/profile`} className="nav__link"><li className="nav__item">Profile</li></Link>
                    <li className="nav__item" onClick={logout}>Logout</li>
                </ul> ) : (null)
            }
            
            <div onClick={navToggle} className={icon}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
        </nav>
    );
}