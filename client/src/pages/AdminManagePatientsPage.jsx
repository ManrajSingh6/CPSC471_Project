import "./AdminPagesStyles.css";
import { useState, useEffect } from "react";
import AdminPatientCard from "../components/AdminPatientCard";
import {useParams, Link} from "react-router-dom";


export default function AdminManagePatientsPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const [allPatients, setAllPatients] = useState([]);

    useEffect(() => {
        async function fetchAllPatientsAtHospital(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/patients`);
            const jsonData = await response.json();
            setAllPatients(jsonData);
            setIsLoading(false);
        }
        fetchAllPatientsAtHospital();
    }, [])

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
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
            <Link to={`/admin/${id}/add-patient`}>
                <button 
                    className="primary-btn" 
                    style={{marginTop: "25px", marginBottom: "25px", alignSelf: "flex-start"}}>
                    Add New Patient
                </button>
            </Link>
            {
                allPatients.filter((val) => {
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