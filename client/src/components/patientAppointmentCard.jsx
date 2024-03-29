import "../pages/PatientAppointment.css";

export default function PatientAppointmentCard(props){

    const appointmentDate = new Date(props.appointment).toLocaleDateString();
    const newTime = new Date(props.appointment);
    newTime.setHours(newTime.getHours() - 6);
    const appointmentTime = new Date(newTime).toLocaleTimeString();
    const appointmentAddress = props.house_number + " " + props.street_name + ", " + props.city + ", " + props.province + ", " + props.country + ", " + props.postal_code;
    
    return (
        <div className="appointment-card-container">
            <h3>Appointment with <strong>Dr. {props.name}</strong></h3>
            <div style={{marginTop: "10px"}}>
                <p><strong>Date:</strong> {appointmentDate}</p>
                <p><strong>Time:</strong> {appointmentTime}</p>
            </div>
            <div>
                <p><strong>Location:</strong> {props.hospital_name}</p>
                <p><strong>Address:</strong> {appointmentAddress}</p>
            </div>
            <p style={{marginTop: "10px"}}>This appointment is to check on the status of the following health issue(s): <strong>{props.healthIssues.map((iss, index) => {return <span key={index} style={{marginLeft: "5px"}}>{iss.health_issue},</span>})}</strong></p>
        </div>
    );
}
    
    
