import "./AdminPagesStyles.css";
import { useState } from "react";
import SupplyCard from "../components/SupplyCard";

const tempMedicationData = [
    {
        Name: "Promethazine Codeine",
        ID: "3124",
        category: "Cough Syrup",
        price: "25.99",
        availableQuantity: "300",
        manufacturer: "LeanCo",
        dinNum: "12347788",
        expiryDate: "11/25/2005"
    },
    {
        Name: "Test",
        ID: "1234",
        category: "Cough Syrup",
        price: "25.99",
        availableQuantity: "300",
        manufacturer: "LeanCo",
        dinNum: "12347788",
        expiryDate: "11/25/2005"
    },
];

export default function AdminViewMedicationsPage(){
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
                tempMedicationData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                val.ID.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((med, index) => {
                    return(
                        <SupplyCard key={index} {...med} itemType={"Medication"}/>
                    )
                })
            }
        </div>
    );
}