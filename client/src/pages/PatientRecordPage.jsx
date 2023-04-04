import "./PatientRecordPage.css";

export default function PatientRecordPage(){

    function showGuardianVisitorInfo(){
        console.log("Clicked");
    }

    return(
        <div className="main-report-container">
            <h1>John Doe • <span>johnDoe12</span></h1>
            <div className="report-user-info">
                <div className="left-column-container">
                    <div>
                        <h3>Email</h3>
                        <p>johndoe12@email.com</p>
                    </div>                    
                    <div className="info-container">
                        <h3>SIN Number</h3>
                        <p>394 584 270</p>
                    </div>
                    <div className="info-container">
                        <h3>Date of Birth</h3>
                        <p>September 15th, 1998</p>
                    </div>
                    <div className="info-container">
                        <h3>Address</h3>
                        <p>1065 Dundas St, London, Ontario, Canada,  N6B 3L5</p>
                    </div>
                </div>
                <div className="right-column-container">
                    <div>
                        <h3>Guardians/Visitors</h3>
                        <ul>
                            <li onClick={showGuardianVisitorInfo}>Guardian #1</li>
                            <li>Guardian #2</li>
                            <li>Guardian #3</li>
                            <li>Guardian #4</li>
                        </ul>
                    </div>
                    <div className="info-container">
                        <h3>Sex</h3>
                        <p>Male</p>
                    </div>
                    <div style={{display:"flex", flexDirection: "row", gap: "50px"}} className="info-container">
                        <div>
                            <h3>Weight</h3>
                            <p>175 lbs</p>
                        </div>
                        <div>
                            <h3>Height</h3>
                            <p>5ft 8in</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="report-user-info">
                <div className="left-column-container">
                    <div>
                        <h3>Your Doctor(s)</h3>
                        <p>Dr. Firstname Lastname (General Practitioner)</p>
                    </div>
                    <div className="info-container">
                        <h3>Active Prescriptions</h3>
                        <ul>
                            <li className="general-list-item">
                                Medication (DIN Number)
                                <p>Length: 12 Weeks, Dose: 1 pill/day</p>
                            </li>
                            <li className="general-list-item">
                                Medication (DIN Number)
                                <p>Length: 12 Weeks, Dose: 1 pill/day</p>
                            </li>
                        </ul>
                    </div>
                    <div className="info-container">
                        <h3>Current Health Concerns</h3>
                        <ul>
                            <li>Low Vitamin B levels</li>
                            <li>High Cholesterol</li>
                            <li>BMI Indicates Obesity</li>
                        </ul>
                    </div>
                </div>

                <div className="right-column-container">
                    <div>
                        <h3>Your Nurse(s)</h3>
                        <p>Firstname Lastname (General Nurse)</p>
                    </div>
                    <div className="info-container">
                        <h3>Past Appointments</h3>
                        <ul>
                            <li>September 25th, 2004 (4:30 PM)</li>
                            <li>September 25th, 2004 (4:30 PM)</li>
                            <li>September 25th, 2004 (4:30 PM)</li>
                            <li>September 25th, 2004 (4:30 PM)</li>
                        </ul>
                    </div>
                    <div className="info-container">
                        <h3>Assigned Hospital Information</h3>
                        <p>Rocky View General Hospital</p>
                        <p>Department: General</p>
                        <p>Room 121 • General Room • Large Room</p>
                    </div>
                </div>
            </div>
            <div className="doctor-notes-container">
                <h2 style={{textAlign: "center", marginBottom: "20px"}}>Notes From Doctors</h2>
                <div className="doctor-note">
                    <h3>Dr. Firstname Lastname</h3>
                    <p>"You need to start jogging big man"</p>
                </div>
            </div>
        </div>
    );
}