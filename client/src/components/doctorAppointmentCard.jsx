import "../pages/PatientAppointment.css";

export default function DoctorAppointmentCard({pName, pAppDate, pAppTime, pAppLoc, pAppAddr, pAppMessage}){
    return (
        <div className="appointment-card-container">
            <h3><strong>Patient: </strong>{pName}</h3>
            <div style={{marginTop: "10px"}}>
                <p><strong>Date:</strong> {pAppDate}</p>
                <p><strong>Time:</strong> {pAppTime}</p>
            </div>
            <div>
                <p><strong>Location:</strong> {pAppLoc}</p>
                <p><strong>Address:</strong> {pAppAddr}</p>
            </div>
            <p style={{marginTop: "10px"}}>{pAppMessage}</p>
        </div>
    );
}