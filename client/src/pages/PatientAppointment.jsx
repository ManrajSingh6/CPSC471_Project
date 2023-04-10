import "./PatientAppointment.css";
import PatientAppointmentCard from "../components/patientAppointmentCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    const {id} = useParams();
    const [appointmentRequestReason, setAppointmentRequestReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [appointmentData, setAppointmentData] = useState('');

    useEffect(() => {
        async function fetchAppointmentData(){
            const response = await fetch(`http://localhost:5000/patient-appointments/${id}`);
            const jsonData = await response.json();
            setAppointmentData(jsonData);
            setIsLoading(false);
        }
        fetchAppointmentData();
    }, []);

    function handleAppointmentRequest(ev){
        ev.preventDefault();
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    return (
        <div className="main-appointment-container">
            <h1>Upcoming Appointments</h1>
            <p>Found {appointmentData.length} appointments...</p>
            {
                appointmentData.map((appointment, index) => {
                    return (
                        <PatientAppointmentCard {...appointment} key={index}/>
                    )
                })
            }
            {/* <div className="appointment-card-container">
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
                
            </div> */}
        </div>
    );
}