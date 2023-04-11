import "./SearchDoctorPatientsPage.css";
import { useState, useEffect } from "react";
import PatientCard from "../components/patientCard";
import { useParams } from "react-router-dom";

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
    const {id} = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    const [allPatientsByDoctor, setAllPatientsByDoctor] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAllPatientData(){
            const response = await fetch(`http://localhost:5000/doctor-patients/${id}`);
            const jsonData = await response.json();
            setAllPatientsByDoctor(jsonData);
            setIsLoading(false);
        }
        fetchAllPatientData();
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
            <p>Found {allPatientsByDoctor.length} results...</p>
            {
                allPatientsByDoctor.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((patient, index) => {
                    return (
                        <PatientCard {...patient} key={index}/>
                    )
                })
            }
        </div>
    );
}