import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "./Layout.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContextProvider } from "./contexts/UserContext.jsx";

// Page Imports 
import LoginPage from "./pages/LoginPage.jsx";
import PatientRecordPage from "./pages/PatientRecordPage.jsx";
import ViewDoctorsPage from "./pages/ViewDoctorsPage.jsx";
import PatientAppointmentPage from "./pages/PatientAppointment.jsx";
import SearchHospitalsPage from "./pages/SearchHospitalsPage.jsx";
import PatientProfilePage from "./pages/PatientProfilePage.jsx";
import SearchDoctorPatientsPage from "./pages/SearchDoctorPatientsPage.jsx";
import UpdateRecordPage from "./pages/UpdateRecordPage.jsx";
import DoctorAppointmentPage from "./pages/DoctorAppointment.jsx";
import DoctorProfilePage from "./pages/DoctorProfilePage.jsx";
import AdminProfilePage from "./pages/AdminProfilePage.jsx";
import AdminViewMedicationsPage from "./pages/AdminViewMedicationsPage.jsx";
import AdminViewEquipmentPage from "./pages/AdminViewEquipmentPage.jsx";
import AdminViewRoomsPage from "./pages/AdminViewRooms.jsx";
import AdminManageEmployeesPage from "./pages/AdminManageEmployeesPage.jsx";
import AdminManagePatientsPage from "./pages/AdminManagePatientsPage.jsx";
import RegisterPatientAccountPage from "./pages/RegisterPatientAccountPage.jsx";
import AdminAddPatient from "./pages/AdminAddPatient.jsx";
import AdminAddEmployee from "./pages/AdminAddEmployee.jsx";

function App() {
  return (
    <UserContextProvider>
      <Routes>
          <Route path="/" element={<Layout />}>
            //Main page will be login page
            <Route index element={<LoginPage />} />

            //General Routes
            <Route path={'/register-patient-account'} element={<RegisterPatientAccountPage />} />
            <Route path={'/search-hospitals'} element={<SearchHospitalsPage />} />
            <Route path={'/search-doctors'} element={<ViewDoctorsPage />} />

            //Patient Routes
            <Route path={'/patient/:id/record'} element={<PatientRecordPage />} />
            <Route path={'/patient/:id/appointments'} element={<PatientAppointmentPage />} />
            <Route path={'/patient/:id/profile'} element={<PatientProfilePage />} />

            //Doctor Routes
            <Route path={'/doctor/:id/searchpatients'} element={<SearchDoctorPatientsPage />} />
            <Route path={'/patient/:id/update-record'} element={<UpdateRecordPage />} />
            <Route path={'/doctor/:id/appointments'} element={<DoctorAppointmentPage />} />
            <Route path={'/doctor/:id/profile'} element={<DoctorProfilePage />} />

            //Admin Routes
            <Route path={'/admin/:id/manage-patients'} element={<AdminManagePatientsPage />} />
            <Route path={'/admin/:id/view-rooms'} element={<AdminViewRoomsPage />} />
            <Route path={'/admin/:id/manage-employees'} element={<AdminManageEmployeesPage />} />
            <Route path={'/admin/:id/manage-equipment'} element={<AdminViewEquipmentPage />} />
            <Route path={'/admin/:id/manage-medications'} element={<AdminViewMedicationsPage />} />
            <Route path={'/admin/:id/add-patient'} element={<AdminAddPatient />} />
            <Route path={'/admin/:id/add-employee'} element={<AdminAddEmployee />} />
            <Route path={'/admin/:id/profile'} element={<AdminProfilePage />} />

          </Route>
      </Routes>
      <ToastContainer />
    </UserContextProvider>
  );
}

export default App;
