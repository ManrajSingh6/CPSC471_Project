import "./ProfilePage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DoctorProfilePage(){

    const {id} = useParams();
    const [doctorData, setDoctorData] = useState('');
    const [doctorPatients, setDoctorPatients] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/userinfo/doctor/${id}`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(resData => {
                setDoctorData(resData.doctorInfo);
                console.log(resData.doctorInfo);
                setDoctorPatients(resData.patientsAttendedTo);
            });
        });
    }, []);

    return(
        <div className="main-profile-container">
            <h1>Dr. {doctorData.name}</h1>
            <div className="profile-info-container">
                <div>
                    <h3>Username</h3>
                    <p>{doctorData.username}</p>
                </div>
                <div>
                    <h3>Email</h3>
                    <p>{doctorData.email}</p>
                </div>
                <div>
                    <h3>Phone Number</h3>
                    <p>{doctorData.phone_number}</p>
                </div>
                <div>
                    <h3>SIN Number</h3>
                    <p>{doctorData.sin}</p>
                </div>
            </div>
            <div className="profile-info-container">
                <div>
                    <h3>Date of Birth</h3>
                    <p>{new Date(doctorData.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                    <h3>Address</h3>
                    <p>{doctorData.house_number + " " + doctorData.street_name + ", " + doctorData.city + ", " + doctorData.province + ", " + doctorData.country + ", " + doctorData.postal_code}</p>
                </div>
                <div>
                    <h3>Specialization</h3>
                    <p>{doctorData.specialization}</p>
                </div>
                <div>
                    <h3>Qualification</h3>
                    <p>{doctorData.qualification}</p>
                </div>
            </div>
            <div className="sub-container-3">
                <h3>Attends To</h3>
                <ul>
                    {
                        doctorPatients.map((patient, index) => {
                            return(
                                <li key={index}>{patient.name}</li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="sub-container-3">
                <h3>Works At</h3>
                <p><strong>Hospital: </strong> {doctorData.hospital_name}</p>
                <p><strong>Hospital ID: </strong> {doctorData.hospital_id}</p>
                <p><strong>Department: </strong> {doctorData.department_name}</p>
                <p><strong>Department Number: </strong> {doctorData.dept_no}</p>
            </div>
        </div>
    );
}