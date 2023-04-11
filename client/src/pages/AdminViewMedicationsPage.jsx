import "./AdminPagesStyles.css";
import { useState, useEffect } from "react";
import SupplyCard from "../components/SupplyCard";
import {useParams} from "react-router-dom";

export default function AdminViewMedicationsPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const [allMeds, setAllMeds] = useState([]);

    useEffect(() => {
        async function fetchAllMeds(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/medications`);
            const jsonData = await response.json();
            setAllMeds(jsonData);
            setIsLoading(false);
        }
        fetchAllMeds();
    }, []);

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    function orderMedication(ev){
        ev.preventDefault();
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    return(
        <div className="main-admin-container">
            <h1>View Hospital Medications</h1>
            <input type="text"
                placeholder="Search by medication name or ID"
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
                onClick={orderMedication}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "flex-start"}}>
                Order Medication
            </button>
            {
                allMeds.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                val.item_id.toString().toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((med, index) => {
                    return(
                        <SupplyCard key={index} {...med} itemType={"Medication"}/>
                    )
                })
            }
        </div>
    );
}