import "../pages/PatientAppointment.css";

export default function PatientAppointmentCard({doctorName, appointmentDate, appointmentTime, appointmentLocation, appointmentAddress, appointmentMessage}){
        return (
            <div className="appointment-card-container">
                <h3>Appointment with <strong>Dr. {doctorName}</strong></h3>
                <div style={{marginTop: "10px"}}>
                    <p><strong>Date:</strong> {appointmentDate}</p>
                    <p><strong>Time:</strong> {appointmentTime}</p>
                </div>
                <div>
                    <p><strong>Location:</strong> {appointmentLocation}</p>
                    <p><strong>Address:</strong> {appointmentAddress}</p>
                </div>
                <p style={{marginTop: "10px"}}>{appointmentMessage}</p>
            </div>
        );
    }
    
    
