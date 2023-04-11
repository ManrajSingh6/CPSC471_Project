import "../pages/AdminPagesStyles.css";

export default function RoomCard({room_number, name, room_type, size_sqft, occupied}){
    return(
        <div className="room-card">
            <h3>Room {room_number} • {name}</h3>
            <p><strong>Room type: </strong> {room_type}</p>
            <p><strong>Room size: </strong> {size_sqft} sq ft.</p>
            <p><strong>Occupied: </strong> {occupied === 1 ? ("Yes") : ("No")}</p>
        </div>
    );
}