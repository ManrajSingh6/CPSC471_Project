import "./RegisterPatientAccountPage.css";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminAddPatient(){

    const {id} = useParams();
    const [patientInfo, setPatientInfo] = useState({
        pFullname: "",
        pSIN: "",
        pDOB: "",
        pHouseNum: "",
        pStreetAddr: "",
        pCity: "",
        pProvince: "",
        pCountry: "",
        pPostalCode: "",
        pSex: "",
        pWeight: "",
        pHeight: "",
        pHospitalPref: "",
        pEmail: "",
        pUsername: "",
        pPassword: "",
        pPhone: "",
        pRoomNum: "",
        pDoctorChoice: "",
        pNurseChoice: ""
    });

    const [primaryGuardianInfo, setPrimaryGuardianInfo] = useState({
        gFullname: "",
        gSIN: "",
        gRelationship: "",
        gContactNumber: "",
        gHouseNum: "",
        gStreetAddr: "",
        gCity: "",
        gProvince: "",
        gCountry: "",
        gPostalCode: "",
    });

    const [roomOptions, setRoomOptions] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/room-staff-info/${id}`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(resData => {
                setRoomOptions(resData.allHospitalRooms);
                setAllEmployees(resData.allEmployees);
                setIsLoading(false);
            });
        });
    }, []);

    async function registerAccount(ev){
        ev.preventDefault();
        const response = await fetch(`http://localhost:5000/register`, {
            method: 'POST',
            body: JSON.stringify({patientData: patientInfo, guardianData: primaryGuardianInfo}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            response.json().then(res => {
                toast.success("Successfully added patient");
                setRedirect(true);
            });
        } else {
            setRedirect(false);
            toast.error("Error creating account! User already exists!");
        }
    }

    function autofillAddress(){
        setPrimaryGuardianInfo({
            ...primaryGuardianInfo, 
            gHouseNum: patientInfo.pHouseNum,
            gStreetAddr: patientInfo.pStreetAddr,
            gCity: patientInfo.pCity,
            gProvince: patientInfo.pProvince,
            gCountry: patientInfo.pCountry,
            gPostalCode: patientInfo.pPostalCode
        });
    }

    function handlePatientInfoChange(event){
        const {name, value} = event.target;
        setPatientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleGuardianInfoChange(event){
        const {name, value} = event.target;
        setPrimaryGuardianInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    if (redirect){
        return (<Navigate to={`/admin/${id}/manage-patients`}/>);
    }

    return(
        <div className="main-creation-container">
            <h1>Add New Patient</h1>
            <form onSubmit={registerAccount}>
                <label style={{marginTop: "30px"}} htmlFor="name-sin-dob-container">Full name, SIN Number and Date of Birth</label>
                <div className="input-container" id="name-sin-dob-container">
                    <input
                        name="pFullname"
                        type="text"
                        placeholder="Full name"
                        required
                        value={patientInfo.pFullname}
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        placeholder="SIN Number"
                        type="number"
                        minLength="9"
                        maxLength="9"
                        required
                        value={patientInfo.pSIN}
                        name="pSIN"    
                        onChange={handlePatientInfoChange}            
                    />
                    <input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        required
                        value={patientInfo.pDOB}
                        name="pDOB"  
                        onChange={handlePatientInfoChange}
                    />
                </div>
                <label htmlFor="address-container">Home Address</label>
                <div className="input-container" id="address-container">
                    <input
                        placeholder="House Number"
                        type="number"
                        required      
                        value={patientInfo.pHouseNum}
                        name="pHouseNum"           
                        onChange={handlePatientInfoChange} 
                    />
                    <input
                        type="text"
                        placeholder="Street Address"
                        required
                        value={patientInfo.pStreetAddr}
                        name="pStreetAddr"  
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        required
                        value={patientInfo.pCity}
                        name="pCity"  
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Province"
                        required
                        value={patientInfo.pProvince}
                        name="pProvince"  
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        required
                        value={patientInfo.pCountry}
                        name="pCountry"  
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        value={patientInfo.pPostalCode}
                        name="pPostalCode"  
                        onChange={handlePatientInfoChange}
                    />
                </div>
                <label htmlFor="patient-info">Patient Information</label>
                <div className="input-container" id="patient-info">
                    <select id="sex" name="pSex" onChange={handlePatientInfoChange}>
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input
                        placeholder="Weight (KG)"
                        type="number"
                        required                
                        value={patientInfo.pWeight}
                        name="pWeight"  
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        placeholder="Height (ft)"
                        type="number"
                        required    
                        value={patientInfo.pHeight}
                        name="pHeight"       
                        onChange={handlePatientInfoChange}       
                    />
                </div>
                <label htmlFor="employee-assign">Assign Room and Staff</label>
                <div className="input-container" id="employee-assign">
                    <select id="hospital-pref" required name="pHospitalPref" value={patientInfo.pHospitalPref} onChange={handlePatientInfoChange}>
                        <option value="">Assign Hospital</option>
                        <option value={roomOptions[0].hospital_id}>{roomOptions[0].hospital_id}</option>
                    </select>
                    <select id="hospital-room-pref" required name="pRoomNum" value={patientInfo.pRoomNum} onChange={handlePatientInfoChange}>
                        <option value="">Assign Room To Patient</option>
                        {
                            roomOptions.map((item, index) => {
                                return(<option key={index} value={item.room_number}>{item.room_number}</option>);
                            })
                        }
                    </select>

                    <select id="hospital-doctor-pref" required name="pDoctorChoice" value={patientInfo.pDoctorChoice} onChange={handlePatientInfoChange}>
                        <option value="">Assign Doctor To Patient</option>
                        {
                            allEmployees.allDoctors.map((item, index) => {
                                return(<option key={index} value={item.sin}>{item.name}</option>);
                            })
                        }
                    </select>

                    <select id="hospital-nurse-pref" required name="pNurseChoice" value={patientInfo.pNurseChoice} onChange={handlePatientInfoChange}>
                        <option value="">Assign Nurse To Patient</option>
                        {
                            allEmployees.allNurses.map((item, index) => {
                                return(<option key={index} value={item.sin}>{item.name}</option>);
                            })
                        }
                    </select>
                </div>
                <label htmlFor="primary-gv">Add primary guardian/visitor</label>
                <div className="input-container" id="primary-gv">
                    <input
                        type="text"
                        placeholder="Full name"
                        required
                        value={primaryGuardianInfo.gFullname}
                        name="gFullname"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Relationship with patient"
                        required
                        value={primaryGuardianInfo.gRelationship}
                        name="gRelationship"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        type="number"
                        placeholder="Contact Number"
                        required
                        value={primaryGuardianInfo.gContactNumber}
                        name="gContactNumber"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        placeholder="Guardian SIN Number"
                        type="number"
                        minLength="9"
                        maxLength="9"
                        required 
                        value={primaryGuardianInfo.gSIN}    
                        name="gSIN"   
                        onChange={handleGuardianInfoChange}        
                    />
                </div>
                <div className="input-container" id="address-container">
                    <input
                        placeholder="House Number"
                        type="number"
                        required 
                        value={primaryGuardianInfo.gHouseNum}
                        name="gHouseNum"   
                        onChange={handleGuardianInfoChange}            
                    />
                    <input
                        type="text"
                        placeholder="Street Address"
                        required
                        value={primaryGuardianInfo.gStreetAddr}
                        name="gStreetAddr"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        required
                        value={primaryGuardianInfo.gCity}
                        name="gCity"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Province"
                        required
                        value={primaryGuardianInfo.gProvince}
                        name="gProvince"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        required
                        value={primaryGuardianInfo.gCountry}
                        name="gCountry"
                        onChange={handleGuardianInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        value={primaryGuardianInfo.gPostalCode}
                        name="gPostalCode"
                        onChange={handleGuardianInfoChange}
                    />
                    <button className="primary-btn" type="button" onClick={autofillAddress}>Autofill Address</button>
                </div>
                <hr style={{margin: "25px 0px"}}/>
                <label htmlFor="account-details-container">Account details</label>
                <div className="input-container" id="account-details-container">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={patientInfo.pEmail}
                        name="pEmail"  
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={patientInfo.pUsername}
                        name="pUsername"
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={patientInfo.pPassword}
                        name="pPassword"
                        onChange={handlePatientInfoChange}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        value={patientInfo.pPhone}
                        name="pPhone"
                        onChange={handlePatientInfoChange}
                    />
                </div>
                <button className="primary-btn">Register New Patient</button>
            </form>
        </div>
    )
}