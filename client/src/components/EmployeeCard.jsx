import "../pages/AdminPagesStyles.css";

export default function EmployeeCard(props){

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
        {
            props.cardType === "doctor" ? (<h3>Dr. {props.name} | {props.sin}</h3>) : (<h3>Nurse: {props.name} | {props.sin}</h3>)
        }
            <p><strong>Date of birth: </strong>{new Date(props.date_of_birth).toLocaleDateString()}</p>
            <div style={{marginTop: "25px"}}>
            {
                props.cardType === "doctor" ? (
                    <button 
                        className="primary-btn" 
                        onClick={manageAppointments}
                        style={{marginTop: "5px", boxShadow: "none"}}>
                        Manage Appointments
                    </button>
                ) : (null)
            }
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