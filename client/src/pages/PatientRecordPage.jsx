import "./PatientRecordPage.css";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

export default function PatientRecordPage(){

    const {id} = useParams();
    const [userHealthRecord, setUserHealthRecord] = useState();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function fetchUserData(){
            const response = await fetch(`http://localhost:5000/userinfo/patient/${id}`);
            const jsonData = await response.json();
            setUserHealthRecord(jsonData);
            setIsLoading(false);
        }
        fetchUserData();
    }, []);

    function showGuardianVisitorInfo(){
        // console.log("Clicked");
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }
    return(
        <div className="main-report-container">
            <h1>{userHealthRecord.patientInfo.name} • <span>{userHealthRecord.patientInfo.username}</span></h1>
            <div className="report-user-info">
                <div className="left-column-container">
                    <div>
                        <h3>Email</h3>
                        <p>{userHealthRecord.patientInfo.email}</p>
                    </div>                    
                    <div className="info-container">
                        <h3>SIN Number</h3>
                        <p>{userHealthRecord.patientInfo.sin}</p>
                    </div>
                    <div className="info-container">
                        <h3>Date of Birth</h3>
                        <p>{new Date(userHealthRecord.patientInfo.date_of_birth).toLocaleDateString()}</p>
                    </div>
                    <div className="info-container">
                        <h3>Address</h3>
                        <p>{userHealthRecord.patientInfo.house_number + " " + userHealthRecord.patientInfo.street_name + ", " + userHealthRecord.patientInfo.city + ", " + userHealthRecord.patientInfo.province + ", " + userHealthRecord.patientInfo.country + ", " + userHealthRecord.patientInfo.postal_code}</p>
                    </div>
                </div>
                <div className="right-column-container">
                    <div>
                        <h3>Guardians/Visitors</h3>
                        <ul>
                            <li onClick={showGuardianVisitorInfo}>{userHealthRecord.medicalRecord.guardian_name}</li>
                        </ul>
                    </div>
                    <div className="info-container">
                        <h3>Sex</h3>
                        <p>{userHealthRecord.patientInfo.sex}</p>
                    </div>
                    <div style={{display:"flex", flexDirection: "row", gap: "50px"}} className="info-container">
                        <div>
                            <h3>Weight</h3>
                            <p>{userHealthRecord.patientInfo.weight_kg} kg</p>
                        </div>
                        <div>
                            <h3>Height</h3>
                            <p>{userHealthRecord.patientInfo.height_ft} (ft-in)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="report-user-info">
                <div className="left-column-container">
                    <div>
                        <h3>Your Doctor(s)</h3>
                        <p>{userHealthRecord.medicalRecord.doctor_name}</p>
                    </div>
                    <div className="info-container">
                        <h3>Active Prescriptions</h3>
                        <ul>
                            {
                                userHealthRecord.patientPrescriptions.map((presc, index) => {
                                    return(
                                        <li className="general-list-item" key={index}>
                                            {presc.prescription}
                                        <p>Length: {presc.length_weeks} weeks, Dose: {presc.dose_mg} mg</p>
                                </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="info-container">
                        <h3>Current Health Concerns</h3>
                        <ul>
                            {
                                userHealthRecord.patientHealthIssues.map((issue, index) => {
                                    return (<li key={index}>{issue.health_issue}</li>)
                                })
                            }
                        </ul>
                    </div>
                </div>

                <div className="right-column-container">
                    <div>
                        <h3>Your Nurse(s)</h3>
                        <p>{userHealthRecord.medicalRecord.nurse_name}</p>
                    </div>
                    <div className="info-container">
                        <h3>Assigned Hospital Information</h3>
                        <p>Hospital: {userHealthRecord.patientInfo.hospital_name} (ID #: {userHealthRecord.patientInfo.hospital_id})</p>
                        {
                            userHealthRecord.patientInfo.room_no === null ? (<p><strong>No room assigned yet. Ask an Admin to do so.</strong></p>) : (<>
                                <p>Department: {userHealthRecord.patientRoomInfo[0]?.dept_no}</p>
                                <p>Room {userHealthRecord.patientInfo.room_no} • {userHealthRecord.patientRoomInfo[0]?.room_type} • Size: {userHealthRecord.patientRoomInfo[0]?.size_sqft} sq ft.</p>
                            </>)
                        }
                        
                    </div>
                </div>
            </div>
            {/* <div className="doctor-notes-container">
                <h2 style={{textAlign: "center", marginBottom: "20px"}}>Notes From Doctors</h2>
                <div className="doctor-note">
                    <h3>Dr. Firstname Lastname</h3>
                    <p>"NEED TO IMPLEMENT THIS STILL IN THE SQL FILE DATABASE</p>
                </div>
            </div> */}
        </div>
    );
}