import "./SearchHospitalsPage.css";
import { useState } from "react";
import HospitalCard from "../components/hospitalCard";

const hospitalDataTemp = [
    {
        hospitalName: "Rockyview General Hospital",
        hospitalAddress: "123 Rocky St, Edmonton, Alberta, Canada, T3R 0B3",
        availableDepartments: [
            {
                deptName: "General Care",
                deptID: "363",
                deptRooms: "130",
                deptStaff: "30"
            },
            {
                deptName: "Infant Care",
                deptID: "200",
                deptRooms: "50",
                deptStaff: "30"
            },
            {
                deptName: "Intensive Care",
                deptID: "404",
                deptRooms: "30",
                deptStaff: "30"
            }
        ]
    }
]

export default function SearchHospitalsPage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    return (
        <div className="main-search-container">
            <h1>Search For Hospitals</h1>
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
            <p style={{color: "#8f97a1"}}>Found {hospitalDataTemp.length} results...</p>
            {
                hospitalDataTemp.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((hospital, index) => {
                    return (
                        <HospitalCard {...hospital} key={index}/>
                    )
                })
            }
        </div>
    );
}