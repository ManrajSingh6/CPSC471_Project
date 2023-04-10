import { Link } from "react-router-dom";
import "../pages/AdminPagesStyles.css";

export default function AdminPatientCard({name, dateOfBirth, SINnum}){

    function manageAppointments(ev){
        ev.preventDefault();
    }
    function updateAccountInfo(ev){
        ev.preventDefault();
    }   
    function deleteAccount(ev){
        ev.preventDefault();
    }      
    return(
        <div className="room-card">
            <h3>{name} | {SINnum}</h3>
            <p><strong>Date of birth: </strong>{dateOfBirth}</p>
            <div style={{marginTop: "25px"}}>
                <Link to="/patient/:id/record">
                    <button 
                        className="primary-btn" 
                        style={{marginTop: "5px", boxShadow: "none"}}>
                        View Medical Record
                    </button>
                </Link>
                <button 
                    className="primary-btn" 
                    onClick={updateAccountInfo}
                    style={{marginTop: "5px", boxShadow: "none"}}>
                    Update Patient Account Information
                </button>
                <button 
                    className="primary-btn" 
                    onClick={manageAppointments}
                    style={{marginTop: "5px", boxShadow: "none"}}>
                    Manage Appointments
                </button>
                <button 
                    className="primary-btn" 
                    onClick={deleteAccount}
                    style={{marginTop: "5px", boxShadow: "none",backgroundColor: "red"}}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}