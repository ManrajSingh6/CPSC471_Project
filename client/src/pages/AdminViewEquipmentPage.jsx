import "./AdminPagesStyles.css";
import { useState, useEffect } from "react";
import SupplyCard from "../components/SupplyCard";
import {useParams} from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminViewEquipmentPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    const [toggleForm, setToggleForm] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const [allEquipment, setAllEquipment] = useState([]);
    const [allHospitalRooms, setAllRooms] = useState([]);

    const [newEquipInfo, setNewEquipInfo] = useState({
        Name: "",
        ID: "",
        Price: "",
        Category: "",
        Quantity: "",
        eqNumber: "",
        manufacturer: "",
        warranty_name: "",
        warranty_start: "",
        warranty_length: "",
        RoomChoice: ""
    });

    useEffect(() => {
        async function fetchAllEquipment(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/equipment`);
            const jsonData = await response.json();
            setAllEquipment(jsonData.allEquipment);
            setAllRooms(jsonData.allRooms);
            setIsLoading(false);
        }
        fetchAllEquipment();
    }, []);

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    async function addEquipment(ev){
        ev.preventDefault();
        // console.log(newEquipInfo);

        const response = await fetch(`http://localhost:5000/admin/add-equipment/${id}`, {
            method: 'POST',
            body: JSON.stringify({equipment: newEquipInfo}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            window.location.reload();
        } else {
            toast.error("Error adding item! Item may already exist in hospital.")
        }
    }

    function handleNewEquipChange(event){
        const {name, value} = event.target;
        setNewEquipInfo(prev => ({
            ...prev,
            [name]: value
        }));
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
                onClick={() => setToggleForm(prevToggleForm => !prevToggleForm)}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "flex-start"}}>
                Add Equipment
            </button>
            {
                toggleForm ? (
                    <div className="order-form">
                        <p><strong>Add Equipment Form</strong></p>
                        <form onSubmit={addEquipment}>
                            <input onChange={handleNewEquipChange} name="Name" value={newEquipInfo.Name} required type="text" placeholder="Item Name"/>
                            <input onChange={handleNewEquipChange} name="ID" value={newEquipInfo.ID} required type="number" placeholder="Item ID"/>
                            <input onChange={handleNewEquipChange} name="Price" value={newEquipInfo.Price} required type="number" placeholder="Price"/>
                            <input onChange={handleNewEquipChange} name="Category" value={newEquipInfo.Category} required type="text" placeholder="Category"/>
                            <input onChange={handleNewEquipChange} name="Quantity" value={newEquipInfo.Quantity} required type="number" placeholder="Quantity"/>
                            <input onChange={handleNewEquipChange} name="eqNumber" value={newEquipInfo.eqNumber} required type="number" placeholder="Equipment Number"/>
                            <input onChange={handleNewEquipChange} name="manufacturer" value={newEquipInfo.manufacturer} required type="text" placeholder="Manufacturer"/>
                            <input onChange={handleNewEquipChange} name="warranty_name" value={newEquipInfo.warranty_name} required type="text" placeholder="Warranty Name"/>
                            <input onChange={handleNewEquipChange} name="warranty_start" value={newEquipInfo.warranty_start} required type="date" min={new Date().toISOString().split('T')[0]} placeholder="Warranty date"/>
                            <select id="warranty-length" required name="warranty_length" value={newEquipInfo.warranty_length} onChange={handleNewEquipChange} style={{marginTop: "20px", width: "fit-content", alignSelf: "center"}}>
                                <option value="">Select Warranty Length</option>
                                <option value="1">1 month</option>
                                <option value="3">3 months</option>
                                <option value="6">6 months</option>
                                <option value="12">12 months</option>
                                <option value="24">24 months</option>
                                <option value="36">36 months</option>
                                <option value="48">48 months</option>
                            </select>
                            <select id="all-rooms" required name="RoomChoice" value={newEquipInfo.RoomChoice} onChange={handleNewEquipChange} style={{marginTop: "20px", width: "fit-content", alignSelf: "center"}}>
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