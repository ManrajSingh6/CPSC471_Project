import { useParams } from "react-router-dom";
import "./ProfilePage.css";
import { useEffect, useState } from "react";

export default function PatientProfilePage(){

    const [gName, setGName] = useState('');
    const [gRel, setGRel] = useState('');
    const [gPhoNumber, setGPhoNumber] = useState('');
    const [gHouseNum, setGHouseNum] = useState('');
    const [gAddress, setGAddress] = useState('');
    const [gCity, setGCity] = useState('');
    const [gProvince, setGProvince] = useState('');
    const [gCountry, setGCountry] = useState('');
    const [gZipCode, setGZipCode] = useState('');

    const {id} = useParams();
    const [userData, setUserData] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/userinfo/patient/${id}`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(resData => {
                setUserData(resData.patientInfo);
            });
        });
    }, []);

    function addVisitor(ev){
        ev.preventDefault();
    }

    return(
        <div className="main-profile-container">
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
            </div>

            <div className="guard-visitor-form">
                <p style={{fontWeight: 500}}>Add additional guardians/visitors:</p>
                <form onSubmit={addVisitor}>
                    <div>
                        <input required type="text" placeholder="Name" value={gName} onChange={(ev) => setGName(ev.target.value)}/>
                        <input required type="text" placeholder="Relationship" value={gRel} onChange={(ev) => setGRel(ev.target.value)}/>
                        <input required type="text" placeholder="Contact Number" value={gPhoNumber} onChange={(ev) => setGPhoNumber(ev.target.value)}/>
                    </div>
                    <div>
                        <input required type="text" placeholder="House #" value={gHouseNum} onChange={(ev) => setGHouseNum(ev.target.value)}/>
                        <input required type="text" placeholder="Street Address" value={gAddress} onChange={(ev) => setGAddress(ev.target.value)}/>
                        <input required type="text" placeholder="City" value={gCity} onChange={(ev) => setGCity(ev.target.value)}/>
                    </div>
                    <div>
                        <input required type="text" placeholder="Province" value={gProvince} onChange={(ev) => setGProvince(ev.target.value)}/>
                        <input required type="text" placeholder="Country" value={gCountry} onChange={(ev) => setGCountry(ev.target.value)}/>
                        <input required type="text" placeholder="ZIP Code" value={gZipCode} onChange={(ev) => setGZipCode(ev.target.value)}/>
                    </div>
                    <button className="primary-btn" style={{marginTop: "25px", marginBottom: "25px", alignSelf: "center"}}>Add</button>
                </form>
            </div>
        </div>
    );
}