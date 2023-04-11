import "../pages/PatientAppointment.css";

export default function DoctorAppointmentCard(props){

    const appointmentDate = new Date(props.appointment).toLocaleDateString();
    const appointmentTime = new Date(props.appointment).toLocaleTimeString();
    const appointmentAddress = props.house_number + " " + props.street_name + ", " + props.city + ", " + props.province + ", " + props.country + ", " + props.postal_code;

    return (
        <div className="appointment-card-container">
            <h3><strong>Patient: </strong>{props.name}</h3>
            <div style={{marginTop: "10px"}}>
                <p><strong>Date:</strong> {appointmentDate}</p>
                <p><strong>Time:</strong> {appointmentTime}</p>
            </div>
            <div>
                <p><strong>Location:</strong> {props.hospital_name}</p>
                <p><strong>Address:</strong> {appointmentAddress}</p>
            </div>
            <p style={{marginTop: "10px"}}>Discuss with the patient about their issues with <strong>{props.patient_health_issues.replaceAll(";", ", ")}.</strong></p>
        </div>
    );
}