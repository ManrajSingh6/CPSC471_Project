import "./SearchHospitalsPage.css";
import { useState, useEffect } from "react";
import HospitalCard from "../components/hospitalCard";

export default function SearchHospitalsPage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    const [allHospitalData, setAllHospitalData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchHospitalData(){
            const response = await fetch(`http://localhost:5000/allhospitals`);
            const jsonData = await response.json();
            setAllHospitalData(jsonData);
            setIsLoading(false);
        }
        fetchHospitalData();
    }, []);

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
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
            <p style={{color: "#8f97a1"}}>Found {allHospitalData.length} results...</p>
            {
                allHospitalData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((hospital, index) => {
                    return (
                        <HospitalCard {...hospital} key={index}/>
                    )
                })
            }
        </div>
    );
}