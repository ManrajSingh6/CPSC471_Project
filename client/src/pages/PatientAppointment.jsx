import "./PatientAppointment.css";
import PatientAppointmentCard from "../components/patientAppointmentCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PatientAppointmentPage(){
    const {id} = useParams();
    const [appointmentRequestReason, setAppointmentRequestReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [appointmentData, setAppointmentData] = useState('');
    const [patientHealthIssues, setPatientHealthIssues] = useState('');

    useEffect(() => {
        async function fetchAppointmentData(){
            const response = await fetch(`http://localhost:5000/patient-appointments/${id}`);
            const jsonData = await response.json();
            setPatientHealthIssues(jsonData.healthIssues);
            setAppointmentData(jsonData.patientAppointmentInfo);
            // setPatientHealthIssues(jsonData.allPatientHealthIssues);
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
                        <PatientAppointmentCard {...appointment} healthIssues={patientHealthIssues} key={index}/>
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