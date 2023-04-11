import "../pages/SearchDoctorPatientsPage.css";
import { Link } from "react-router-dom";

export default function PatientCard(props){

    const pAddress = props.house_number + " " + props.street_name + ", " + props.city + ", " + props.province + ", " + props.country + ", " + props.postal_code;
    return(
        <div className="patient-card-container">
            <h3>{props.name} • {props.sin}</h3>
            <p><strong>Date of birth:</strong> {new Date(props.date_of_birth).toLocaleDateString()}</p>
            <p>{pAddress}</p>
            <div className="buttons-container">
                <Link
                    style={{padding: "10px 10px", textDecoration: "None", fontSize: "0.8rem"}} 
                    to={`/patient/${props.sin}/record`} 
                    className="primary-btn">View Medical Record
                </Link>
                <Link
                    style={{padding: "10px 10px", textDecoration: "None", fontSize: "0.8rem"}} 
                    to={`/patient/${props.sin}/update-record`} 
                    className="primary-btn">Update Medical Record
                </Link>
            </div>
        </div>
    );
}