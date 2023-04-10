import { useParams } from "react-router-dom";
import "./ProfilePage.css";
import { useEffect, useState } from "react";

export default function AdminProfilePage(){
    const {id} = useParams();
    const [userData, setUserData] = useState('');
    const [hospitalData, setHospitalData] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/userinfo/admin/${id}`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(resData => {
                setUserData(resData.adminInfo);
                setHospitalData(resData.hospitalInfo);
            });
        });
    }, []);

    return(
        <div className="main-profile-container">
            <h1>Administrator: {userData.name}</h1>
            <div className="profile-info-container">
                <div>
                    <h3>Username</h3>
                    <p>{userData.username}</p>
                </div>
                <div>
                    <h3>Email</h3>
                    <p>{userData.email}</p>
                </div>
                {/* <div>
                    <h3>Phone Number</h3>
                    <p>123-456-7899</p>
                </div> */}
                <div>
                    <h3>SIN Number</h3>
                    <p>{userData.sin}</p>
                </div>
            </div>
            <div className="profile-info-container">
                <div>
                    <h3>Date of Birth</h3>
                    <p>{new Date(userData.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                    <h3>Address</h3>
                    <p>{userData.house_number + " " + userData.street_name + ", " + userData.city + ", " + userData.province + ", " + userData.country + ", " + userData.postal_code}</p>
                </div>
                <div>
                    <h3>Position</h3>
                    <p>{userData.position}</p>
                </div>
            </div>
            <div className="sub-container-3">
                <h3>Works At</h3>
                <p><strong>Hospital: </strong> {hospitalData.hospital_id}</p>
                <p><strong>Address: </strong> {hospitalData.house_number + " " + hospitalData.street_name + ", " + hospitalData.city + ", " + hospitalData.province + ", " + hospitalData.country + ", " + hospitalData.postal_code}</p>
                <p><strong>Hospital ID: </strong> {hospitalData.hospital_id}</p>
                <p><strong>Department: </strong> {userData.department}</p>
            </div>
        </div>
    );
}