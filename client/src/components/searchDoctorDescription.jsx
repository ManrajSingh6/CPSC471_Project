import "../pages/ViewDoctorsPage.css";

export default function SearchDoctorDescription(props){
    return(
        <>
            {
                props.cardtype === "nurse" ? (
                    <div className="doctor-description-container">
                        <h3>Nurse {props.nurse_name}</h3>
                        <p>Nurse {props.nurse_name} is working in a {props.position_type} position.</p>
                        <p><strong>Works as a</strong> {props.type}.</p>
                    </div>
                ) : (
                    <div className="doctor-description-container">
                        <h3>Dr. {props.doctor_name}</h3>
                        <p>Doctor {props.doctor_name} is qualified in {props.specialization} with an {props.qualification} degree.</p>
                        <p><strong>Works in</strong> {props.dept_name} ({props.dept_no}) at {props.hospital_name}.</p>
                    </div>
                )
            }
        </>
        
    );
}