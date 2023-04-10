import "./DoctorAppointment.css";
import DoctorAppointmentCard from "../components/doctorAppointmentCard";

const tempDoctorAppointmentData = [
    {
        pName: "Firstname Lastname",
        pAppDate: "November 25th, 2004",
        pAppTime: "4:30 PM",
        pAppLoc: "Rockyview General Hospital",
        pAppAddr: "123 Rocky St, Edmonton, Alberta, Canada, T3R 0B3",
        pAppMessage: "Patient Appointment Reason"
    },
    {
        pName: "Firstname Lastname",
        pAppDate: "November 25th, 2004",
        pAppTime: "4:30 PM",
        pAppLoc: "Rockyview General Hospital",
        pAppAddr: "123 Rocky St, Edmonton, Alberta, Canada, T3R 0B3",
        pAppMessage: "Patient Appointment Reason"
    }
    
]

export default function DoctorAppointmentPage(){
    return(
        <div className="main-appointment-container">
            <h1>Upcoming Appointments</h1>
            <p>Found {tempDoctorAppointmentData.length} appointments...</p>
            {
                tempDoctorAppointmentData.map((appointment, index) => {
                    return (
                        <DoctorAppointmentCard {...appointment} key={index}/>
                    )
                })
            }
        </div>
    );
}