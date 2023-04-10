import "../pages/AdminPagesStyles.css";

export default function RoomCard({roomNum, deptName, roomType, roomSize, isOccupied}){
    return(
        <div className="room-card">
            <h3>Room {roomNum} • {deptName}</h3>
            <p><strong>Room type: </strong> {roomType}</p>
            <p><strong>Room size: </strong> {roomSize}</p>
            <p><strong>Occupied: </strong> {isOccupied}</p>
        </div>
    );
}