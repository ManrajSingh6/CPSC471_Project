import "./RegisterPatientAccountPage.css";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminAddEmployee(){

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
        pEmail: "",
        pUsername: "",
        pPassword: "",
        pPhone: "",
    });


    const [deptNum, setDeptNum] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [allDeps, setAllDeps] = useState([]);
    const [userType, setUsertype] = useState('');
    const [qualification, setQualification] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [nurseType, setNurseType] = useState('');
    const [positionType, setPositionType] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/dept-info/${id}`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(resData => {
                // console.log(resData);
                setAllDeps(resData);
                setIsLoading(false);
            });
        });
    }, []);

    async function registerAccount(ev){
        ev.preventDefault();

        if (userType === "doctor"){
            // console.log(patientInfo);
            // console.log(deptNum);
            // console.log(qualification);
            // console.log(specialization);

            const doctorInfo = {
                deptNum, qualification, specialization
            };

            const response = await fetch(`http://localhost:5000/add-doctor/${id}`, {
                method: 'POST',
                body: JSON.stringify({personInfo: patientInfo, doctorInfo}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                toast.success("Successfully Added Doctor");
                setRedirect(true);
            } else {
                setRedirect(false);
                toast.error("Error creating employee.");
            }
        }

        if (userType === "nurse"){
            // console.log(patientInfo);
            // console.log(nurseType);
            // console.log(positionType);

            const nurseInfo = { nurseType, positionType };

            const response = await fetch(`http://localhost:5000/add-nurse/${id}`, {
                method: 'POST',
                body: JSON.stringify({personInfo: patientInfo, nurseInfo}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                toast.success("Successfully Added Nurse");
                setRedirect(true);
            } else {
                setRedirect(false);
                toast.error("Error creating employee.");
            }
        }
        
    }

    function handlePatientInfoChange(event){
        const {name, value} = event.target;
        setPatientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    if (redirect){
        return (<Navigate to={`/admin/${id}/manage-employees`}/>);
    }

    return(
        <div className="main-creation-container">
            <h1>Add New Employee</h1>
            <form onSubmit={registerAccount}>
                    <fieldset style={{marginTop: "30px"}}>
                        <div><input required type="radio" id="radioChoice1" value="doctor" name="usertype" onChange={(ev) => setUsertype(ev.target.value)}/><label htmlFor="radioChoice2" style={{marginLeft: "5px"}}>Doctor</label></div>
                        <div><input type="radio" id="radioChoice2" value="nurse" name="usertype" onChange={(ev) => setUsertype(ev.target.value)}/><label htmlFor="radioChoice3" style={{marginLeft: "5px"}}>Nurse</label></div>
                    </fieldset>
                <label style={{marginTop: "30px"}} htmlFor="name-sin-dob-container">Full name, SIN Number, Date of Birth</label>
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

                    {
                        userType === "doctor" ? (<>
                            <select required value={deptNum} onChange={(ev) => setDeptNum(ev.target.value)}>
                                <option value="">Choose Department Number</option>
                                {
                                    allDeps.map((item, index) => {
                                        return(<option key={index} value={item.department_num}>{item.department_num}: {item.name}</option>);
                                    })
                                }
                            </select>
                            <input
                                name="qualification"
                                type="text"
                                placeholder="Qualification"
                                required
                                value={qualification}
                                onChange={(ev) => setQualification(ev.target.value)}
                            />
                            <input
                                name="specialization"
                                type="text"
                                placeholder="Specialization"
                                required
                                value={specialization}
                                onChange={(ev) => setSpecialization(ev.target.value)}
                            />
                        </>) : (null)
                    }

                    {
                        userType === "nurse" ? (<>
                            <input
                                name="Type"
                                type="text"
                                placeholder="Nurse Type"
                                required
                                value={nurseType}
                                onChange={(ev) => setNurseType(ev.target.value)}
                            />
                            <input
                                name="positiontype"
                                type="text"
                                placeholder="Position Type"
                                required
                                value={positionType}
                                onChange={(ev) => setPositionType(ev.target.value)}
                            />
                        </>) : (null)
                    }
                    

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
                <button className="primary-btn">Register New Employee</button>
            </form>
        </div>
    )
}