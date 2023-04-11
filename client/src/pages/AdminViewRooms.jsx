import "./AdminPagesStyles.css";
import { useState, useEffect } from "react";
import RoomCard from "../components/RoomCard";
import { useParams } from "react-router-dom";

export default function AdminViewRoomsPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    const [allRooms, setAllRooms] = useState([]);
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      async function fetchAllRooms(){
          const response = await fetch(`http://localhost:5000/all-rooms/${id}`);
          const jsonData = await response.json();
          setAllRooms(jsonData);
          setIsLoading(false);
      }
      fetchAllRooms();
    }, []);

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
              allRooms.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.room_number.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                val.name.toLowerCase().includes(searchQuery.toLowerCase())
                || val.room_type.toLowerCase().includes(searchQuery.toLowerCase())
                || val.size_sqft.toString().toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
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