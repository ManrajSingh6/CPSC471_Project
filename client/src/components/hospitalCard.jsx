import "../pages/SearchHospitalsPage.css";

export default function HospitalCard({hospitalName, hospitalAddress, availableDepartments}){
    return(
        <div className="hospital-info-card">
            <h3>{hospitalName}</h3>
            <p><strong>Address: </strong>{hospitalAddress}</p>
            <p><strong>Available Departments</strong></p>
            <ul>
                {
                    availableDepartments.map((dept, index) => {
                        return(
                            <li key={index}><p>{dept.deptName}({dept.deptID}) • <span>{dept.deptRooms} Rooms • {dept.deptStaff} Doctors</span></p></li>
                        )
                    })
                }
            </ul>
            
        </div>
    )
}