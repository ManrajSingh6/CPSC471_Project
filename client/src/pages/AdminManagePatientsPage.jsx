import "./AdminPagesStyles.css";
import { useState } from "react";
import AdminPatientCard from "../components/AdminPatientCard";

const tempPatientData = [
    {
      name: "John Smith",
      SINnum: 123456789,
      dateOfBirth: "September 25th, 2002"
    },
    {
      name: "Jane Doe",
      SINnum: 987654321,
      dateOfBirth: "January 1st, 2000"
    },
    {
      name: "Michael Johnson",
      SINnum: 234567890,
      dateOfBirth: "December 12th, 1998"
    },
    {
      name: "Emily Davis",
      SINnum: 345678901,
      dateOfBirth: "April 5th, 1995"
    },
    {
      name: "David Lee",
      SINnum: 456789012,
      dateOfBirth: "November 15th, 1990"
    }
];

export default function AdminManagePatientsPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    function addEmployee(ev){
        ev.preventDefault();
    }

    function addPatient(ev){
        ev.preventDefault();

    }

    return(
        <div className="main-admin-container">
            <h1>View Hospital Patients</h1>
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
            <button 
                className="primary-btn" 
                onClick={addPatient}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "flex-start"}}>
                Add New Patient
            </button>
            {
                tempPatientData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((patient, index) => {
                    return(
                        <AdminPatientCard key={index} {...patient} />
                    )
                })
            }
        </div>
    )
}