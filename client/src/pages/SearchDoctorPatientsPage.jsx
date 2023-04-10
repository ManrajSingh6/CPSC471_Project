import "./SearchDoctorPatientsPage.css";
import { useState } from "react";
import PatientCard from "../components/patientCard";

const tempPatientData = [
    {
        pName: "Firstname Lastname",
        pSIN: "123456789",
        pDOB: "September 5th, 2002",
        pAddress: "1065 Dundas St London, Ontario, Canada, N6B 3L5"
    },
    {
        pName: "test testtttt",
        pSIN: "123456789",
        pDOB: "September 5th, 2002",
        pAddress: "1065 Dundas St London, Ontario, Canada, N6B 3L5"
    }
];

export default function SearchDoctorPatientsPage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    return (
        <div className="main-search-container">
            <h1>Search For Patients</h1>
            <input type="text"
                placeholder="Search by name"
                value={tempSearchQuery}
                onChange={(ev) => (setTempSearchQuery(ev.target.value))}
            />
            <button 
                className="primary-btn" 
                onClick={handleSearch}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "center"}}>
                Find
            </button>
            <p>Found {tempPatientData.length} results...</p>
            {
                tempPatientData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.pName.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((patient, index) => {
                    return (
                        <PatientCard {...patient} key={index}/>
                    )
                })
            }
        </div>
    );
}