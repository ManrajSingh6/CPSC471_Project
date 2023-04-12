import "./AdminPagesStyles.css";
import { useState, useEffect } from "react";
import SupplyCard from "../components/SupplyCard";
import {useParams} from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminViewMedicationsPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    const [toggleForm, setToggleForm] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const [allMeds, setAllMeds] = useState([]);
    const [allHospitalRooms, setAllRooms] = useState([]);

    const [newMedInfo, setNewMedInfo] = useState({
        medName: "",
        medID: "",
        medPrice: "",
        medCategory: "",
        medQuantity: "",
        medDIN: "",
        medExpiryDate: "",
        medRoomChoice: ""
    });

    useEffect(() => {
        async function fetchAllMeds(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/medications`);
            const jsonData = await response.json();
            setAllMeds(jsonData.allMeds);
            setAllRooms(jsonData.allRooms);
            setIsLoading(false);
        }
        fetchAllMeds();
    }, []);

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    async function addMedication(ev){
        ev.preventDefault();
        console.log(newMedInfo);

        const response = await fetch(`http://localhost:5000/admin/add-medication/${id}`, {
            method: 'POST',
            body: JSON.stringify({med: newMedInfo}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            window.location.reload();
        } else {
            toast.error("Error adding item! Item may already exist in hospital.")
        }
    }

    function handleNewMedChange(event){
        const {name, value} = event.target;
        setNewMedInfo(prev => ({
            ...prev,
            [name]: value
        }));
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
                onClick={() => setToggleForm(prevToggleForm => !prevToggleForm)}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "flex-start"}}>
                Add Medication 
            </button>
            {
                toggleForm ? (
                    <div className="order-form">
                        <p><strong>Add Medication Form</strong></p>
                        <form onSubmit={addMedication}>
                            <input onChange={handleNewMedChange} name="medName" value={newMedInfo.medName} required type="text" placeholder="Item Name"/>
                            <input onChange={handleNewMedChange} name="medID" value={newMedInfo.medID} required type="number" placeholder="Item ID"/>
                            <input onChange={handleNewMedChange} name="medPrice" value={newMedInfo.medPrice} required type="number" placeholder="Price"/>
                            <input onChange={handleNewMedChange} name="medCategory" value={newMedInfo.medCategory} required type="text" placeholder="Category"/>
                            <input onChange={handleNewMedChange} name="medQuantity" value={newMedInfo.medQuantity} required type="number" placeholder="Quantity"/>
                            <input onChange={handleNewMedChange} name="medDIN" value={newMedInfo.medDIN} required type="number" placeholder="DIN Number"/>
                            <input onChange={handleNewMedChange} name="medExpiryDate" value={newMedInfo.medExpiryDate} required type="date" min={new Date().toISOString().split('T')[0]} placeholder="Expiry date"/>
                            <select id="all-rooms" name="medRoomChoice" value={newMedInfo.medRoomChoice} onChange={handleNewMedChange} style={{marginTop: "20px", width: "fit-content", alignSelf: "center"}}>
                                <option value="">Select Room</option>
                                {
                                    allHospitalRooms.map((item, index) => {
                                        return(<option key={index} value={item.room_number}>{item.room_number}</option>);
                                    })
                                }
                            </select>
                            <button className="primary-btn" style={{marginTop: "20px", alignSelf: "center"}}>Add</button>
                        </form>
                    </div>
                ) : (null)
            }
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