import "./UpdateRecordPage.css";
import { useState } from "react";
import Dropdown from "../components/dropdown";

const availableOptions = [
    "1 day", "2 days", "3 days", "5 days", "1 week", "2 weeks", "3 weeks", "1 month",
    "2 months", "3 months"
];

const dosageOptions = ["1 pill once a day", "2 pills once a day", "1 pill twice a day", "2 pills twice a day", "3 pills twice a day", "1 pill three times a day", "2 pills three times a day", "3 pills three times a day", "1 pill every 4 hours", "2 pills every 4 hours", "1 pill every 6 hours", "2 pills every 6 hours", "1 pill every 8 hours", "2 pills every 8 hours", "1 pill every 12 hours", "2 pills every 12 hours", "1 pill every 24 hours", "2 pills every 24 hours"];


export default function UpdateRecordPage(){

    const [newHealthConcern, setNewHealthConcern] = useState('');
    const [newNote, setNewNote] = useState('');
    const [medName, setMedName] = useState('');
    const [prescLength, setPrescLength] = useState('');
    const [dosage, setDosage] = useState('');
    
    const [weight, setWeight] = useState('');
    const [heightInches, setHeightInches] = useState('');
    const [heightFt, setHeightFt] = useState('');

    const allAvailNurses = [];
    const [newAssignedNurse, setNewAssignedNurse] = useState('');

    const currentNursesAll = [];
    const [currentNurse, setCurrentNurse] = useState('');

    function handleNewNurse(event){
        setNewAssignedNurse(event.target.value === "" ? "" : event.target.value);
    }

    function handleRemoveNurse(event){
        setCurrentNurse(event.target.value === "" ? "" : event.target.value);

    }

    function handlePrescriptionChange(event){
        setPrescLength(event.target.value === "" ? "" : event.target.value);
    }

    function handleDosageChange(event){
        setDosage(event.target.value === "" ? "" : event.target.value);
    }

    function isWhitespace(str) {
        return !str.replace(/\s/g, '').length;
    }

    function addPrescription(ev){
        ev.preventDefault();

        if (!isWhitespace(medName) && medName !== "" && prescLength !== "" && dosage !== ""){
            console.log(medName, prescLength, dosage);
        } else {
            console.log("error");
        }
    }

    function removeItemFromProfile(ev){
        console.log(ev.target.textContent);
    }

    function updateWeightHeight(ev){
        ev.preventDefault();

        if (!isWhitespace(weight) && weight !== "" && !isNaN(weight)){
            console.log(weight);
        }
        
        if (!isWhitespace(heightFt) && heightFt !== "" && !isNaN(heightFt)){
            console.log(heightFt);
        } 
        
        if (!isWhitespace(heightInches) && heightInches !== "" && !isNaN(heightInches)){
            console.log(heightInches);
        }
    }

    function handleAssignRemove(ev){
        const choice = ev.target.textContent;
        if (choice === "Assign"){
            console.log(choice);
        }

        if (choice === "Unassign"){
            console.log(choice);
        }
    }

    return( 
        <div className="main-record-container">
            <h1>Update Record for John Doe</h1>
            <div className="sub-container-1">
                <div className="container-div">
                    <h3>Add Health Concerns</h3>
                    <textarea 
                        placeholder="Add a new health concern."
                        value={newHealthConcern}
                        onChange={(ev) => setNewHealthConcern(ev.target.value)}
                    />
                    <button className="primary-btn">Add Health Concern</button>
                </div>
                <div className="container-div">
                    <h3>Remove Resolved Health Concerns</h3>
                    <ul>
                        <li onClick={removeItemFromProfile}>Health Issue #1</li>
                    </ul>
                </div>
            </div>
            <div className="sub-container-1">
                <div className="container-div">
                    <h3>Add Patient Profile Note</h3>
                    <textarea 
                        placeholder="Add a new note."
                        value={newNote}
                        onChange={(ev) => setNewNote(ev.target.value)}
                    />
                    <button className="primary-btn">Add Note</button>
                </div>
                <div className="container-div">
                    <h3>Remove Prescriptions</h3>
                    <ul>
                        <li onClick={removeItemFromProfile}>Medication #1</li>
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
                        dropdownTitle={"Duration"} 
                        selectedOption={prescLength}
                        onOptionChange={handlePrescriptionChange}
                        availableOptions={availableOptions}
                    />
                    <Dropdown 
                        dropdownTitle={"Dosage"} 
                        selectedOption={dosage}
                        onOptionChange={handleDosageChange}
                        availableOptions={dosageOptions}
                    />
                </div>
                <button style={{alignSelf: "center"}} className="primary-btn" onClick={addPrescription}>Add</button>
            </div>
            <div className="sub-container-1">
                <div className="container-div">
                    <h3>Update Weight and Height</h3>
                    <input 
                        placeholder="Weight (lbs)"
                        value={weight}
                        onChange={(ev) => setWeight(ev.target.value)}
                    />
                    <input 
                        placeholder="Height (Ft)"
                        value={heightFt}
                        onChange={(ev) => setHeightFt(ev.target.value)}
                    />
                    <input 
                        placeholder="Height (Inches)"
                        value={heightInches}
                        onChange={(ev) => setHeightInches(ev.target.value)}
                    />
                    <button onClick={updateWeightHeight} style={{marginLeft: "15px"}} className="primary-btn">Update</button>
                </div>
                <div style={{width: "50%", border: "2px solid #e2e2e2", padding: "10px"}}>
                    <h3>Assign and Unassign Nurse</h3>
                    <div className="options-container">
                        <Dropdown 
                            dropdownTitle={"Available Nurses"} 
                            selectedOption={newAssignedNurse}
                            onOptionChange={handleNewNurse}
                            availableOptions={allAvailNurses}
                        />
                        <Dropdown 
                            dropdownTitle={"Current Nurses"} 
                            selectedOption={currentNurse}
                            onOptionChange={handleRemoveNurse}
                            availableOptions={currentNursesAll}
                        />
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
