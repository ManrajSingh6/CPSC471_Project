import { Link, useParams } from "react-router-dom";
import "../pages/AdminPagesStyles.css";
import { useState, useEffect } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPatientCard(props){
    const {id} = useParams();
    const [toggleForm, setToggleForm] = useState(false);
    const [toggleAppointmentForm, setToggleAppForm] = useState(false);

    const [currentAppointments, setCurrentAppointments] = useState([]); 
    const [selectedApp, setSelectedApp] = useState('');
    const [selectModifiedApp, setModifiedApp] = useState('');
    const [newChangeApp, setNewChangeApp] = useState('');
    const [newAppointment, setNewApp] = useState('');

    const [allRooms, setAllRooms] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedNurse, setSelectedNurse] = useState('');

    const [confirmToggled, setConfirmToggled] = useState(false);

    useEffect(() => {
        async function fetchAllEmployees(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/employees`);
            const jsonData = await response.json();
            setAllEmployees(jsonData);
        }
        async function fetchAllHospitalRooms(){
            const response = await fetch(`http://localhost:5000/all-rooms/${id}`);
            const jsonData = await response.json();
            setAllRooms(jsonData);
        }
        async function fetchPatientAppointments(){
            const response = await fetch(`http://localhost:5000/patient-appointments/${props.sin}`);
            const jsonData = await response.json();
            setCurrentAppointments(jsonData);
        }
        fetchPatientAppointments();
        fetchAllHospitalRooms(),
        fetchAllEmployees()
    }, [])

    async function addAppointment(){
        if (newAppointment !== ""){
            const newDateTime = new Date(newAppointment);
            
            const response = await fetch(`http://localhost:5000/patient/add-appointment/${props.sin}`, {
                method: 'POST',
                body: JSON.stringify({newDateTime}),
                headers: {'Content-Type':'application/json'}
            });
        
            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error adding appointment.")
            }
        } else {
            toast.error("Cannot have empty field");
        }
        
    }

    async function removeAppointment(){
        if (selectedApp !== ""){
            const removal = new Date(selectedApp);
            const response = await fetch(`http://localhost:5000/patient/remove-appointment/${props.sin}`, {
                method: 'POST',
                body: JSON.stringify({removalTime: removal}),
                headers: {'Content-Type':'application/json'}
            });
            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error removing appointment.")
            }
        } else {
            toast.error("Cannot have empty field");
        }

    }

    async function modifyAppointment(){
        if (newChangeApp !== "" && selectModifiedApp !== ""){
            const appToChange = new Date(selectModifiedApp);
            const newAppTime = new Date(newChangeApp);
            const response = await fetch(`http://localhost:5000/patient/modify-appointment/${props.sin}`, {
                method: 'PUT',
                body: JSON.stringify({appToChange, newAppTime}),
                headers: {'Content-Type':'application/json'}
            });
            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error modifying appointment.")
            }
        } else {
            toast.error("Cannot have empty field");
        }
    }

    async function assignRoom(){
        // console.log(selectedRoom);
        if (selectedRoom !== ""){
            const response = await fetch(`http://localhost:5000/patient/assign-room/${props.sin}`, {
                method: 'PUT',
                body: JSON.stringify({newRoom: selectedRoom}),
                headers: {'Content-Type':'application/json'}
            });
            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error modifying room.");
            }
        } else {
            toast.error("Cannot have empty field.");
        }
    }

    async function assignNurse(){
        // console.log(selectedNurse);
        if (selectedNurse === ""){
            toast.error("Cannot have empty field.");
        } else {
            const response = await fetch(`http://localhost:5000/patient/change-nurse/${props.sin}`, {
                method: 'PUT',
                body: JSON.stringify({newNurseSin: selectedNurse}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error assigning nurse.");
            }
        }
    }

    async function assignDoctor(){
        // console.log(selectedDoctor);
        if (selectedDoctor === ""){
            toast.error("Cannot have empty field.");
        } else {
            const response = await fetch(`http://localhost:5000/patient/change-doctor/${props.sin}`, {
                method: 'PUT',
                body: JSON.stringify({newDoctorSin: selectedDoctor}),
                headers: {'Content-Type':'application/json'}
            });

            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error assigning doctor.");
            }
            
        }
    }

    async function deleteAccount(ev){
        ev.preventDefault();
        // console.log(props.sin);
        const response = await fetch(`http://localhost:5000/delete-patient-account`, {
            method: 'POST',
            body: JSON.stringify({patientSIN: props.sin}),
            headers: {'Content-Type':'application/json'}
        });

        if (response.ok){
            window.location.reload();
            toast.success("Successfully deleted account.");
        } else {
            toast.error("Error deleting patient.");
        }
    }
    
    return(        

        <div className="room-card">
        {
            toggleAppointmentForm ? (
                <div style={{margin: "10px 0px 10px 0px", border: "1px solid #e2e2e2", padding: "10px", gap: "50px", display: "flex", justifyContent: "space-around"}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px"}}>
                        <p>Add appointment:</p>
                        <input id="new-app" style={{width: "200px"}} type="datetime-local" value={newAppointment} onChange={(ev) => setNewApp(ev.target.value)}/>
                        <p style={{cursor: "pointer", color: "Green"}} onClick={addAppointment}>Add</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px"}}>
                        <p>Remove appointment:</p>
                        <select id="current-apps" required name="current-app" value={selectedApp} onChange={(ev) => setSelectedApp(ev.target.value)}>
                            <option value="">Select Appointment</option>
                            {
                                currentAppointments.patientAppointmentInfo.map((item, index) => {
                                    return(<option key={index} value={item.appointment}>{new Date(item.appointment).toISOString().slice(0, 19).replace('T', ' ')}</option>);
                                })
                            }
                        </select>
                        <p style={{cursor: "pointer", color: "Red"}} onClick={removeAppointment}>Remove</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px"}}>
                        <p>Modify appointment:</p>
                        <select id="current-apps" required name="current-app" value={selectModifiedApp} onChange={(ev) => setModifiedApp(ev.target.value)}>
                            <option value="">Select Appointment</option>
                            {
                                currentAppointments.patientAppointmentInfo.map((item, index) => {
                                    return(<option key={index} value={item.appointment}>{new Date(item.appointment).toISOString().slice(0, 19).replace('T', ' ')}</option>);
                                })
                            }
                        </select>
                        <input id="new-app" style={{width: "200px"}} type="datetime-local" value={newChangeApp} onChange={(ev) => setNewChangeApp(ev.target.value)}/>
                        <p style={{cursor: "pointer", color: "Blue"}} onClick={modifyAppointment}>Modify</p>
                    </div>
                    
                </div>
            ) : (null)
        }
        {
            toggleForm ? (
                <div style={{margin: "10px 0px 10px 0px", border: "1px solid #e2e2e2", padding: "10px", gap: "50px", display: "flex", justifyContent: "space-around"}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <select id="hospital-room-pref" required name="roomChoice" value={selectedRoom} onChange={(ev) => setSelectedRoom(ev.target.value)}>
                            <option value="">Select Room</option>
                            {
                                allRooms.map((item, index) => {

                                    if (item.room_number === props.room_no){
                                        return (<option key={index} disabled value={item.room_number}>{item.room_number}</option>)
                                    } else {
                                        return (<option key={index} value={item.room_number}>{item.room_number}</option>)
                                    }
                                })
                            }
                        </select>
                        <p style={{cursor: "pointer", color: "Green"}} onClick={assignRoom}>Assign</p>
                    </div>

                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <select id="hospital-doctor-pref" required name="pDoctorChoice" value={selectedDoctor} onChange={(ev) => setSelectedDoctor(ev.target.value)}>
                            <option value="">Select Doctor</option>
                            {
                                allEmployees.allDoctors.map((item, index) => {
                                    if (item.name === props.doctor_name) {return(<option disabled key={index} value={item.sin}>{item.name}</option>);}
                                    else {return(<option key={index} value={item.sin}>{item.name}</option>);}
                                })
                            }
                        </select>
                        <p style={{cursor: "pointer", color: "Green"}} onClick={assignDoctor}>Assign</p>
                    </div>

                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <select id="hospital-nurse-pref" required name="pNurseChoice" value={selectedNurse} onChange={(ev) => setSelectedNurse(ev.target.value)}>
                            <option value="">Select Nurse</option>
                            {
                                allEmployees.allNurses.map((item, index) => {
                                    if (item.name === props.nurse_name){
                                        return(<option disabled key={index} value={item.sin}>{item.name}</option>);
                                    } else {
                                        return(<option key={index} value={item.sin}>{item.name}</option>);
                                    }
                                    
                                })
                            }
                        </select>
                        <p style={{cursor: "pointer", color: "Green"}} onClick={assignNurse}>Assign</p>
                    </div>
                </div>
            ) : (null)
        }
            <h3>{props.name} | {props.sin}</h3>
            <p><strong>Date of birth: </strong>{new Date(props.date_of_birth).toLocaleDateString()}</p>
            <div style={{marginTop: "25px"}}>
                <Link to={`/patient/${props.sin}/record`}>
                    <button 
                        className="primary-btn" 
                        style={{marginTop: "5px", boxShadow: "none"}}>
                        View Medical Record
                    </button>
                </Link>
                <button 
                    className="primary-btn" 
                    onClick={() => setToggleForm(prevToggleForm => !prevToggleForm)}
                    style={{marginTop: "5px", boxShadow: "none"}}>
                    Update Patient Account Information
                </button>
                <button 
                    className="primary-btn" 
                    onClick={() => setToggleAppForm(prevToggleForm => !prevToggleForm)}
                    style={{marginTop: "5px", boxShadow: "none"}}>
                    Manage Appointments
                </button>
                <button 
                    className="primary-btn" 
                    onClick={() => setConfirmToggled(prevToggle => !prevToggle)}
                    style={{marginTop: "5px", boxShadow: "none",backgroundColor: "red"}}>
                    Delete Account
                </button>
                {
                    confirmToggled ? (
                        <p>Are you sure?
                        <strong><span style={{color: "red", cursor: "pointer"}} onClick={deleteAccount}> Yes </span></strong> 
                         or <strong><span style={{color: "green", cursor: "pointer"}} onClick={() => setConfirmToggled(prevToggle => !prevToggle)}>No</span></strong></p>
                    ) : (null)
                }
            </div>
        </div>
    );
}