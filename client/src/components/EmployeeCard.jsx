import "../pages/AdminPagesStyles.css";
import { useState } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmployeeCard(props){
    const [confirmToggled, setConfirmToggled] = useState(false);

    async function deleteAccount(ev){
        ev.preventDefault();
        // console.log(props.sin);
        // console.log(props.cardType);
        const response = await fetch(`http://localhost:5000/delete-employee-account`, {
            method: 'POST',
            body: JSON.stringify({employeeSIN: props.sin, employeeType:props.cardType}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            window.location.reload();
            toast.success("Successfully deleted account.");
        } else {
            toast.error("Error deleting employee.");
        }
    }      
    return(
        <div className="room-card">
        {
            props.cardType === "doctor" ? (<h3>Dr. {props.name} | {props.sin}</h3>) : (<h3>Nurse: {props.name} | {props.sin}</h3>)
        }
            <p><strong>Date of birth: </strong>{new Date(props.date_of_birth).toLocaleDateString()}</p>
            <div style={{marginTop: "25px"}}>
                <button 
                    className="primary-btn" 
                    onClick={() => setConfirmToggled(prevToggle => !prevToggle)}
                    style={{marginTop: "5px", boxShadow: "none",backgroundColor: "red"}}>
                    Delete Account
                </button>
                {
                    confirmToggled ? (
                        <p>Are you sure?
                        <strong><span style={{color: "red", cursor: "pointer"}} onClick={deleteAccount}> Yes </span></strong> 
                         or <strong><span style={{color: "green", cursor: "pointer"}} onClick={() => setConfirmToggled(prevToggle => !prevToggle)}>No</span></strong></p>
                    ) : (null)
                }
            </div>
        </div>
    );
}