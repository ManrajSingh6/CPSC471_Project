import "./ViewDoctorsPage.css";
import { useState, useEffect } from "react";

// Component Imports
import SearchDoctorDescription from "../components/searchDoctorDescription";

export default function ViewDoctorsPage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    const [allDoctorData, setAllDoctorData] = useState();
    const [allNurseData, setAllNurseData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDoctorNurseData(){
            const response = await fetch(`http://localhost:5000/alldoctorsnurses`);
            const jsonData = await response.json();
            setAllDoctorData(jsonData.allDoctorData);
            setAllNurseData(jsonData.allNurseData);
            setIsLoading(false);
        }
        fetchDoctorNurseData();
    }, []);

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
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
            <p style={{color: "#8f97a1"}}>Found {allDoctorData.length + allNurseData.length} results...</p>
            {allDoctorData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (
                    val.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) 
                ){ return val; }
            }).map((doctor, index) => {
                return (
                    <SearchDoctorDescription {...doctor} key={index}/>
                )
            })}

            {allNurseData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (
                    val.nurse_name.toLowerCase().includes(searchQuery.toLowerCase()) 
                ){ return val; }
            }).map((nurse, index) => {
                return (
                    <SearchDoctorDescription {...nurse} key={index} cardtype={"nurse"}/>
                )
            })}
        </div>
    );
}