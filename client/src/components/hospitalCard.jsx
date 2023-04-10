import "../pages/SearchHospitalsPage.css";

export default function HospitalCard(props){
    const availableDepartments = props.department_data.split(";");
    return(
        <div className="hospital-info-card">
            <h3>{props.hospital_name}</h3>
            <p><strong>Address: </strong>{props.house_number + " " + props.street_name + ", " + props.city + ", " + props.province + ", " + props.country + ", " + props.postal_code}</p>
            <p><strong>Available Departments</strong></p>
            <ul>
                {
                    availableDepartments.map((dept, index) => {
                        const splitDeptInfo = dept.split(",");
                        return(
            
                            <li key={index}><p>{splitDeptInfo[0]} • <span>{splitDeptInfo[2]} Rooms • Department number: {splitDeptInfo[1]}</span></p></li>
                        )
                    })
                }
            </ul>
            
        </div>
    )
}