import "./AdminPagesStyles.css";
import EmployeeCard from "../components/EmployeeCard";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
  
export default function AdminManageEmployeesPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const [allDoctors, setAllDoctors] = useState([]);
    const [allNurses, setAllNurses] = useState([]);


    useEffect(() => {
        async function fetchAllHospitalEmployees(){
            const response = await fetch(`http://localhost:5000/hospital/${id}/employees`);
            const jsonData = await response.json();
            setAllDoctors(jsonData.allDoctors);
            setAllNurses(jsonData.allNurses);
            setIsLoading(false);
        }
        fetchAllHospitalEmployees();
    }, [])

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    function addEmployee(ev){
        ev.preventDefault();
    }

    if (isLoading){
        return(<div className="main-report-container">Loading</div>)
    }

    return(
        <div className="main-admin-container">
            <h1>View Hospital Employees</h1>
            <input type="text"
                placeholder="Search by name"
                value={tempSearchQuery}
                onChange={(ev) => (setTempSearchQuery(ev.target.value))}
            />
            <button 
                className="primary-btn" 
                onClick={handleSearch}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "center"}}>
                Find
            </button>
            <button 
                className="primary-btn" 
                onClick={addEmployee}
                style={{marginTop: "25px", marginBottom: "25px", alignSelf: "flex-start"}}>
                Add Employee
            </button>
            {
                allDoctors.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((employee, index) => {
                    return(
                        <EmployeeCard key={index} {...employee} cardType="doctor"/>
                    )
                })
            }

            {
                allNurses.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((employee, index) => {
                    return(
                        <EmployeeCard key={index} {...employee}/>
                    )
                })
            }
        </div>
    );
}