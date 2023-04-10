import React, {useContext, useState} from "react";
import { Link, Navigate } from "react-router-dom";
import "./LoginPage.css";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../contexts/UserContext";

export default function LoginPage(){

    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const {userInfo, setUserInfo} = useContext(UserContext);

    async function handleLogin(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            body: JSON.stringify({usertype, username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if (response.ok){
            response.json().then(userInfoRes => {
                setUserInfo(userInfoRes);
                setRedirect(true);
            });
        } else {
            toast.error('Invalid Login Credentials');
        }
    }

    if (redirect) {
        return <Navigate to={`/${usertype}/${userInfo.userSIN}/profile`} />
    }

    return(
        <div className="main-login-container">
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p style={{marginBottom: "10px"}}>I am a:</p>
                    <fieldset>
                        <div><input required type="radio" id="radioChoice1" value="patient" name="usertype" onChange={(ev) => setUsertype(ev.target.value)}/><label htmlFor="radioChoice1" style={{marginLeft: "5px"}}>Patient</label></div>
                        <div><input type="radio" id="radioChoice2" value="doctor" name="usertype" onChange={(ev) => setUsertype(ev.target.value)}/><label htmlFor="radioChoice2" style={{marginLeft: "5px"}}>Doctor</label></div>
                        <div><input type="radio" id="radioChoice3" value="admin" name="usertype" onChange={(ev) => setUsertype(ev.target.value)}/><label htmlFor="radioChoice3" style={{marginLeft: "5px"}}>Admin</label></div>
                    </fieldset>
                    <input
                        required 
                        className="login-input-field" 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                        />
                    <input
                        required 
                        className="login-input-field" 
                        type="password" 
                        placeholder="Password"
                        value={password} 
                        onChange={(ev) => setPassword(ev.target.value)}
                        />
                    <button className="login-btn">Login</button>
                    <p style={{marginTop: "25px"}}>Need to register for a patient account? <Link to="/register-patient-account" style={{color: "#f07900", textDecoration: "none"}}>Click here.</Link></p>
                </form>
            </div>
        </div>
    );
}