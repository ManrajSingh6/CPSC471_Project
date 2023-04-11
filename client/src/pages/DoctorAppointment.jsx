import "./DoctorAppointment.css";
import DoctorAppointmentCard from "../components/doctorAppointmentCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DoctorAppointmentPage(){

    const [allAppointments, setAllAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        async function fetchAllAppointments(){
            const response = await fetch(`http://localhost:5000/doctor-appointments/${id}`);
            const jsonData = await response.json();
            setAllAppointments(jsonData);
            setIsLoading(false);
        }
        fetchAllAppointments();
    }, []);

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    return(
        <div className="main-appointment-container">
            <h1>Upcoming Appointments</h1>
            <p>Found {allAppointments.length} appointments...</p>
            {
                allAppointments.map((appointment, index) => {
                    return (
                        <DoctorAppointmentCard {...appointment} key={index}/>
                    )
                })
            }
        </div>
    );
}