import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage(){

    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(ev){
        ev.preventDefault();
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