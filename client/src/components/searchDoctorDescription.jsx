import "../pages/ViewDoctorsPage.css";

export default function SearchDoctorDescription({fname, lname, specialization, degree, department, hospital}){
    return(
        <div className="doctor-description-container">
            <h3>Dr. {fname} {lname}</h3>
            <p>Doctor {fname} {lname} is qualified in {specialization} with a degree in {degree}.</p>
            <p><strong>Works in</strong> {department} at {hospital}.</p>
        </div>
    );
}