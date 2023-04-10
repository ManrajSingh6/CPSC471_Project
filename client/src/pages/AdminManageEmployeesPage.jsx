import "./AdminPagesStyles.css";
import { useState } from "react";
import EmployeeCard from "../components/EmployeeCard";


const tempEmployeeData = [
    {
      name: "John Smith",
      SINnum: 123456789,
      dateOfBirth: "September 5th, 2002",
    },
    {
      name: "Jane Doe",
      SINnum: 987654321,
      dateOfBirth: "July 12th, 1995",
    },
    {
      name: "Bob Johnson",
      SINnum: 456789123,
      dateOfBirth: "December 25th, 1980",
    },
];
  
  

export default function AdminManageEmployeesPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    function handleSearch(ev){
        ev.preventDefault();
        setSearchQuery(tempSearchQuery);
        setTempSearchQuery('');
    }

    function addEmployee(ev){
        ev.preventDefault();
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
                tempEmployeeData.filter((val) => {
                if (searchQuery === ""){ return val;} 
                else if (val.name.toLowerCase().includes(searchQuery.toLowerCase())){ return val; }
                }).map((employee, index) => {
                    return(
                        <EmployeeCard key={index} {...employee} />
                    )
                })
            }
        </div>
    );
}