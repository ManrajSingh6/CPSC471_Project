import "../pages/SearchDoctorPatientsPage.css";
import { Link } from "react-router-dom";

export default function PatientCard({pName, pSIN, pDOB, pAddress}){
    return(
        <div className="patient-card-container">
            <h3>{pName} • {pSIN}</h3>
            <p><strong>Date of birth:</strong> {pDOB}</p>
            <p>{pAddress}</p>
            <div className="buttons-container">
            {/* STILL NEED TO ADD DYNAMIC LINKS FOR BUTTONS BELOW */}
                <Link
                    style={{padding: "10px 10px", textDecoration: "None", fontSize: "0.8rem"}} 
                    to={"/patient/:id/record"} 
                    className="primary-btn">View Medical Record
                </Link>
                <Link
                    style={{padding: "10px 10px", textDecoration: "None", fontSize: "0.8rem"}} 
                    to={"/patient/:id/update-record"} 
                    className="primary-btn">Update Medical Record
                </Link>
            </div>
        </div>
    );
}