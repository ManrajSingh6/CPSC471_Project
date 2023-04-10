import "./AdminPagesStyles.css";
import { useState } from "react";
import RoomCard from "../components/RoomCard";

const tempRoomData = [
    {
      roomNum: "101",
      deptName: "Cardiology",
      roomType: "general",
      roomSize: "large",
      isOccupied: "Yes",
    },
    {
      roomNum: "102",
      deptName: "Neurology",
      roomType: "surgery",
      roomSize: "medium",
      isOccupied: "No",
    },
    {
      roomNum: "103",
      deptName: "Oncology",
      roomType: "waiting",
      roomSize: "small",
      isOccupied: "Yes",
    },
    {
      roomNum: "104",
      deptName: "Pediatrics",
      roomType: "general",
      roomSize: "medium",
      isOccupied: "No",
    },
    {
      roomNum: "105",
      deptName: "Orthopedics",
      roomType: "surgery",
      roomSize: "large",
      isOccupied: "Yes",
    },
    {
      roomNum: "106",
      deptName: "Radiology",
      roomType: "general",
      roomSize: "small",
      isOccupied: "No",
    },
];

export default function AdminViewRoomsPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    return(
        <div className="main-admin-container">
            <h1>View Rooms</h1>
            <input type="text"
                placeholder="Search by any room parameter"
                value={tempSearchQuery}
                onChange={(ev) => (setTempSearchQuery(ev.target.value))}
            />
            <button 
                className="primary-btn" 
                onClick={handleSearch}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "center"}}>
                Find
            </button>
            <div className="rooms-card-container">
            {
                tempRoomData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.roomNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
                val.deptName.toLowerCase().includes(searchQuery.toLowerCase())
                || val.roomType.toLowerCase().includes(searchQuery.toLowerCase())
                || val.isOccupied.toLowerCase().includes(searchQuery.toLowerCase())
                || val.roomSize.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((room, index) => {
                    return(
                        <RoomCard key={index} {...room}/>
                    )
                })
            }
            </div>
        </div>
    );
}