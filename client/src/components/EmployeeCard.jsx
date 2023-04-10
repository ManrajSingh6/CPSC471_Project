import "../pages/AdminPagesStyles.css";

export default function EmployeeCard({name, dateOfBirth, SINnum}){

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
            <h3>Dr. {name} | {SINnum}</h3>
            <p><strong>Date of birth: </strong>{dateOfBirth}</p>
            <div style={{marginTop: "25px"}}>
                <button 
                    className="primary-btn" 
                    onClick={manageAppointments}
                    style={{marginTop: "5px", boxShadow: "none"}}>
                    Manage Appointments
                </button>
                <button 
                    className="primary-btn" 
                    onClick={updateAccountInfo}
                    style={{marginTop: "5px", boxShadow: "none"}}>
                    Update Account Information
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