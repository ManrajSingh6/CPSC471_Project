import "./AdminPagesStyles.css";
import { useState, useEffect } from "react";
import SupplyCard from "../components/SupplyCard";
import {useParams} from "react-router-dom";

export default function AdminViewEquipmentPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const [allEquipment, setAllEquipment] = useState([]);

    useEffect(() => {
        async function fetchAllEquipment(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/equipment`);
            const jsonData = await response.json();
            setAllEquipment(jsonData);
            setIsLoading(false);
        }
        fetchAllEquipment();
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
            <h1>View Hospital Equipment</h1>
            <input type="text"
                placeholder="Search by equipment name or ID"
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
                Order Equipment
            </button>
            {
                allEquipment.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                val.item_id.toString().toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((equipment, index) => {
                    return(
                        <SupplyCard key={index} {...equipment} itemType={"Equipment"}/>
                    )
                })
            }
        </div>
    );
}