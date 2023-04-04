import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "./Layout.jsx";

// Page Imports
import LoginPage from "./pages/LoginPage.jsx";
import PatientRecordPage from "./pages/PatientRecordPage.jsx";
import ViewDoctorsPage from "./pages/ViewDoctorsPage.jsx";
import PatientAppointmentPage from "./pages/PatientAppointment.jsx";
import SearchHospitalsPage from "./pages/SearchHospitalsPage.jsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          //Main page will be login page
          <Route index element={<LoginPage />} />

          //General Routes
          <Route path={'/register-patient-account'} element={<p>Register patient page</p>} />
          <Route path={'/search-hospitals'} element={<SearchHospitalsPage />} />
          <Route path={'/search-doctors'} element={<ViewDoctorsPage />} />

          //Patient Routes
          <Route path={'/patient/:id/record'} element={<PatientRecordPage />} />
          <Route path={'/patient/:id/appointments'} element={<PatientAppointmentPage />} />
          <Route path={'/patient/:id/profile'} element={<p>patient profile page</p>} />

          //Doctor Routes
          <Route path={'/searchpatients'} element={<p>Search patients page</p>} />
          <Route path={'/patient/:id/update-record'} element={<p>Update patient record page page</p>} />
          <Route path={'/doctor/:id/appointments'} element={<p>Doctor appointments page</p>} />
          <Route path={'/doctor/:id/profile'} element={<p>Doctor profile page</p>} />

          //Admin Routes
          <Route path={'/admin/manage-patients'} element={<p>Admin manage patients page</p>} />
          <Route path={'/admin/view-rooms'} element={<p>Admin View Rooms page</p>} />
          <Route path={'/admin/manage-employees'} element={<p>Admin manage employees page</p>} />
          <Route path={'/admin/manage-equipment'} element={<p>Admin manage equipment page</p>} />
          <Route path={'/admin/manage-medications'} element={<p>Admin manage medications page</p>} />
          <Route path={'/admin/:id/profile'} element={<p>Admin profile page</p>} />

        </Route>
    </Routes>
  );
}

export default App;
