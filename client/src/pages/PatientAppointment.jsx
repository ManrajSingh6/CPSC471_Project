import "./PatientAppointment.css";
import PatientAppointmentCard from "../components/patientAppointmentCard";
import { useState } from "react";

const tempPatientAppointmentData = [
    {
        doctorName: "Mark Zuckerberg",
        appointmentDate: "November 25th, 2004",
        appointmentTime: "4:30 PM",
        appointmentLocation: "Rockyview General Hospital",
        appointmentAddress: "123 Rocky St, Edmonton, Alberta, Canada, T3R 0B3",
        appointmentMessage: "This appointment will be a general appointment to get your yearly physical checkup done."
    },
    {
        doctorName: "Mark Zuckerberg",
        appointmentDate: "November 25th, 2004",
        appointmentTime: "4:30 PM",
        appointmentLocation: "Rockyview General Hospital",
        appointmentAddress: "123 Rocky St, Edmonton, Alberta, Canada, T3R 0B3",
        appointmentMessage: "This appointment will be a general appointment to get your yearly physical checkup done."
    }
]

export default function PatientAppointmentPage(){

    const [appointmentRequestReason, setAppointmentRequestReason] = useState('');

    function handleAppointmentRequest(ev){
        ev.preventDefault();
    }

    return (
        <div className="main-appointment-container">
            <h1>Upcoming Appointments</h1>
            <p>Found {tempPatientAppointmentData.length} appointments...</p>
            {
                tempPatientAppointmentData.map((appointment, index) => {
                    return (
                        <PatientAppointmentCard {...appointment} key={index}/>
                    )
                })
            }
            <div className="appointment-card-container">
                <h1>Request An Appointment Booking</h1>
                <p>Reason for appointment:</p>
                <form onSubmit={handleAppointmentRequest}>
                    <textarea 
                        value={appointmentRequestReason}
                        onChange={(ev) => setAppointmentRequestReason(ev.target.value)}
                        required
                    />
                    <button className="primary-btn" style={{width: "200px", alignSelf: "center", marginTop: "20px"}}>Submit Request</button>
                </form>
                
            </div>
        </div>
    );
}