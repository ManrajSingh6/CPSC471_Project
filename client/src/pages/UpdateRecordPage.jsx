import "./UpdateRecordPage.css";
import { useState, useEffect } from "react";
import Dropdown from "../components/dropdown";
import {useParams} from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const availableOptions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10'
];

const dosageOptions = [
    25,
    50,
    75,
    100,
    150,
    200,
    250,
    300,
    350,
    400,
    450,
    500,
    550,
    600,
    650,
    700,
    750,
    800,
    850,
    900,
    950,
    1000
];

export default function UpdateRecordPage(){
    const [isLoading, setIsLoading] = useState(false);

    const [newHealthConcern, setNewHealthConcern] = useState('');
    const [newNote, setNewNote] = useState('');
    const [medName, setMedName] = useState('');
    const [prescLength, setPrescLength] = useState('');
    const [dosage, setDosage] = useState('');

    const [currentHealthConcerns, setCurrentHealthConcerns] = useState([]);
    const [currentMeds, setCurrentMeds] = useState([]);
    
    const [weight, setWeight] = useState('');
    const [heightFt, setHeightFt] = useState('');

    const [allAvailNurses, setAllAvailNurses] = useState([]);
    const [newAssignedNurse, setNewAssignedNurse] = useState('');

    const [currentNursesAll, setCurrentNursesAll] = useState([]);
    const [currentNurse, setCurrentNurse] = useState('');

    const [generalInfo, setGeneralInfo] = useState({});

    const {id} = useParams();

    useEffect(() => {
        async function fetchPatientData(){
            const response = await fetch(`http://localhost:5000/updateprofileinfo/${id}`);
            const jsonData = await response.json();
            setAllAvailNurses(jsonData.allHospitalNurses);
            setCurrentNursesAll(jsonData.currentPatientNurses);
            setWeight(jsonData.generalInfo.weight_kg);
            setHeightFt(jsonData.generalInfo.height_ft);
            setCurrentHealthConcerns(jsonData.allConcerns);
            setGeneralInfo(jsonData.generalInfo);
            setCurrentMeds(jsonData.allPrescriptions);
            setIsLoading(false);
        }
        fetchPatientData();
    }, []);

    function handlePrescriptionChange(event){
        setPrescLength(event.target.value === "" ? "" : event.target.value);
        // console.log(event.target.value);
    }

    function handleDosageChange(event){
        setDosage(event.target.value === "" ? "" : event.target.value);
        // console.log(event.target.value);
    }

    function isWhitespace(str) {
        return !str.replace(/\s/g, '').length;
    }

    async function addPrescription(ev){
        ev.preventDefault();
        if (!isWhitespace(medName) && medName !== "" && prescLength !== "" && dosage !== ""){
            const response = await fetch(`http://localhost:5000/patient/add-prescription/${id}`, {
                method: 'POST',
                body: JSON.stringify({newPrescription: {medName, prescLength, dosage}}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error adding prescription.");
            }
        } else {
            toast.error("One or more fields missing");
        }
    }

    async function removePrescription(ev){
        const prescToRemove = (ev.target.textContent).split(" | ")[0];

        const response = await fetch(`http://localhost:5000/patient/remove-prescription/${id}`, {
            method: 'POST',
            body: JSON.stringify({prescToRemove}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            window.location.reload();
        } else {
            toast.error("Error removing prescription.");
        }
    }

    async function removeHealthConcern(ev){
        const concernToRemove = ev.target.textContent;

        const response = await fetch(`http://localhost:5000/patient/remove-health-concern/${id}`, {
            method: 'POST',
            body: JSON.stringify({concernToRemove}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            window.location.reload();
        } else {
            toast.error("Error removing health concern.");
        }
    }

    async function updateWeightHeight(ev){
        ev.preventDefault();

        if (!isWhitespace(weight) && weight !== "" && !isNaN(weight)){
            const response = await fetch(`http://localhost:5000/patient/update-weight/${id}`, {
                method: 'PUT',
                body: JSON.stringify({newWeight: weight}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error updating weight.");
            }

        }
        
        if (!isWhitespace(heightFt) && heightFt !== "" && !isNaN(heightFt)){
            const response = await fetch(`http://localhost:5000/patient/update-height/${id}`, {
                method: 'PUT',
                body: JSON.stringify({newHeight: heightFt}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error updating height.");
            }
        } 
    }

    async function handleAssignRemove(ev){
        const choice = ev.target.textContent;
        if (choice === "Assign"){
            // console.log(newAssignedNurse);
            const response = await fetch(`http://localhost:5000/patient/add-nurse/${id}`, {
                method: 'POST',
                body: JSON.stringify({newNurseSin: newAssignedNurse}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error assigning nurse.");
            }
        }

        if (choice === "Unassign"){
            // console.log(currentNurse);
            const response = await fetch(`http://localhost:5000/patient/remove-nurse/${id}`, {
                method: 'POST',
                body: JSON.stringify({removeNurseSin: currentNurse}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error removing nurse.");
            }
        }
    }

    async function addHealthConcern(){
        if (newHealthConcern === "" || isWhitespace(newHealthConcern) || currentHealthConcerns.some(item => item.health_issue.toLowerCase().replace(' ', '') === newHealthConcern.toLowerCase().replace(' ', ''))){
            toast.error("Missing field or Health Issue Already Exists");
        } else {
            const response = await fetch(`http://localhost:5000/patient/add-health-concern/${id}`, {
                method: 'POST',
                body: JSON.stringify({newHealthIssue: newHealthConcern}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error adding health concern");
            }
        }
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    return( 
        <div className="main-record-container">
            <h1>Update Record for {generalInfo.name}</h1>
            <div className="sub-container-1">
                <div className="container-div">
                    <h3>Add Health Concerns</h3>
                    <textarea 
                        placeholder="Add a new health concern."
                        value={newHealthConcern}
                        onChange={(ev) => setNewHealthConcern(ev.target.value)}
                    />
                    <button className="primary-btn" onClick={addHealthConcern}>Add Health Concern</button>
                </div>
                <div className="container-div">
                    <h3>Remove Resolved Health Concerns</h3>
                    <ul>
                        {
                            currentHealthConcerns.map((iss, index) => {
                                return(<li onClick={removeHealthConcern} key={index} value={iss.health_issue}>{iss.health_issue}</li>);
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="sub-container-1">
                {/* <div className="container-div">
                    <h3>Add Patient Profile Note</h3>
                    <textarea 
                        placeholder="Add a new note."
                        value={newNote}
                        onChange={(ev) => setNewNote(ev.target.value)}
                    />
                    <button className="primary-btn">Add Note</button>
                </div> */}
                <div className="container-div" style={{width: "100%"}}>
                    <h3>Remove Prescriptions</h3>
                    <ul>
                    {
                            currentMeds.map((med, index) => {
                                return(<li onClick={removePrescription} key={index} value={med.prescription}>{med.prescription} | {med.length_weeks} weeks | {med.dose_mg} mg</li>);
                            })
                        }
                    </ul>
                </div>
            </div>
            <div style={{border: "2px solid #e2e2e2", flexDirection: "column"}} className="sub-container-2">
                <h3>Add Prescriptions</h3>
                <div className="options-container">
                    <input 
                        type="text"
                        placeholder="Medicine Name"
                        value={medName}
                        onChange={(ev) => setMedName(ev.target.value)}
                    />
                    <Dropdown 
                        dropdownTitle={"Duration (weeks)"} 
                        selectedOption={prescLength}
                        onOptionChange={handlePrescriptionChange}
                        availableOptions={availableOptions}
                    />
                    <Dropdown 
                        dropdownTitle={"Dosage (Mg)"} 
                        selectedOption={dosage}
                        onOptionChange={handleDosageChange}
                        availableOptions={dosageOptions}
                    />
                </div>
                <button style={{alignSelf: "center"}} className="primary-btn" onClick={addPrescription}>Add</button>
            </div>
            <div className="sub-container-1">
                <div className="container-div">
                    <h3 style={{marginBottom: "15px"}}>Update Weight and Height</h3>
                    <label htmlFor="weight" >Weight (kg)</label>
                    <input 
                        name="weight"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(ev) => setWeight(ev.target.value)}
                    />
                    <label htmlFor="height">Height (Ft)</label>
                    <input 
                        name="height"
                        placeholder="Height (Ft)"
                        value={heightFt}
                        onChange={(ev) => setHeightFt(ev.target.value)}
                    />
                    <button onClick={updateWeightHeight} style={{marginLeft: "5px"}} className="primary-btn">Update</button>
                </div>
                <div style={{width: "50%", border: "2px solid #e2e2e2", padding: "10px"}}>
                    <h3>Assign and Unassign Nurse</h3>
                    <div className="options-container">
                        <select id="nurse-select" name="all-nurses" value={newAssignedNurse} onChange={(ev) => setNewAssignedNurse(ev.target.value)}>
                            <option value="">Select New Nurse</option>
                            {
                                allAvailNurses.map((nurse, index) => {
                                    return(<option key={index} value={nurse.nurse_sin}>{nurse.nurse_name}</option>);
                                })
                            }
                        </select>

                        <select id="nurse-select" name="all-nurses-current" value={currentNurse} onChange={(ev) => setCurrentNurse(ev.target.value)}>
                            <option value="">Remove A Nurse</option>
                            {
                                currentNursesAll.map((nurse, index) => {
                                    return(<option key={index} value={nurse.nurse_sin}>{nurse.name}</option>);
                                })
                            }
                        </select>
                    </div>
                    <div className="options-container">
                        <button className="primary-btn" onClick={handleAssignRemove}>Assign</button>
                        <button className="primary-btn" onClick={handleAssignRemove}>Unassign</button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
