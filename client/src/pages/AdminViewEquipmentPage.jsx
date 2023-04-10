import "./AdminPagesStyles.css";
import { useState } from "react";
import SupplyCard from "../components/SupplyCard";

const tempEquipmentData = [
    {
        Name: "X-Ray Machine",
        ID: "11234",
        category: "Machines",
        price: "2500.99",
        availableQuantity: "30",
        manufacturer: "Medico",
        warranty: "25 months",
        equipmentNumber: "128990"
    },
    {
        Name: "Test M",
        ID: "5233",
        category: "Machines",
        price: "2500.99",
        availableQuantity: "30",
        manufacturer: "Medico",
        warranty: "25 months",
        equipmentNumber: "128990"
    },
    
];

export default function AdminViewEquipmentPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    function orderMedication(ev){
        ev.preventDefault();
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
                tempEquipmentData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                val.ID.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((med, index) => {
                    return(
                        <SupplyCard key={index} {...med} itemType={"Equipment"}/>
                    )
                })
            }
        </div>
    );
}