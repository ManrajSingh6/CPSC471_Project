import "./ViewDoctorsPage.css";
import { useState } from "react";

// Component Imports
import SearchDoctorDescription from "../components/searchDoctorDescription";

const doctorsDataTemp = [
    {
        fname: "Mark",
        lname: "Zuckerberg",
        specialization: "neurosurgery",
        degree: "Medicine",
        department: "Neurosurgery (323)",
        hospital: "Rocky View General Hospital"
    },
    {
        fname: "James",
        lname: "Smith",
        specialization: "heart surgery",
        degree: "Medicine",
        department: "Heart Surgery (353)",
        hospital: "Rocky View General Hospital"
    },
    {
        fname: "Mary",
        lname: "Smith",
        specialization: "infant growth",
        degree: "Medicine",
        department: "Infant Development (383)",
        hospital: "Rocky View General Hospital"
    },
]

export default function ViewDoctorsPage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    return(
        <div className="main-page-container">
            <h1>Search For Doctors and Nurses</h1>
            <input type="text"
                placeholder="Search by name or specialization"
                value={tempSearchQuery}
                onChange={(ev) => (setTempSearchQuery(ev.target.value))}
            />
            <button 
                className="primary-btn" 
                onClick={handleSearch}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "center"}}>
                Find
            </button>
            <p style={{color: "#8f97a1"}}>Found {doctorsDataTemp.length} results...</p>
            
            {doctorsDataTemp.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (
                    val.fname.toLowerCase().includes(searchQuery.toLowerCase()) 
                    || val.lname.toLowerCase().includes(searchQuery.toLowerCase()) 
                    || val.specialization.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
            }).map((doctor, index) => {
                return (
                    <SearchDoctorDescription {...doctor} key={index}/>
                )
            })}
        </div>
    );
}