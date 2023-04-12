import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { 
    getAllPeople, 
    loginUser, 
    getAdminInfo, 
    getPatientInfo,
    getAllHospitalData,
    getDoctorInfo,
    getAllDoctorNurseCardInfo,
    getPatientAppointments,
    getAllPatientsByDoctor,
    getAllDoctorAppointments,
    getAllHospitalRoomInfo,
    getAllMedicationsAtHospital,
    getAllEquipmentAtHospital,
    getAllPatientsByHospital,
    getAllEmployeesByHospital,
    hospitalOptions,
    registerUser,
    addGuardianVisitor,
    patientHealthIssues,
    patientPrescriptions,
    patientWeightHeight,
    allNursesByHospital,
    getNursesByPatient,
    addPatientHealthConcern,
    updatePatientWeight,
    updatePatientHeight,
    addNewPrescription,
    removePrescription,
    removeHealthConcern,
    addNurseToPatient,
    removeNurseFromPatient,
    addMedicationToHospital,
    addQuantity
} from '../server/database.js';

const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// Declare express app
const app = express();
// App use dependencies
app.use(express.json());
app.use(cors({credentials:true, origin:'http://localhost:8000'}));
app.use(cookieParser());

// Homepage GET route
app.get('/', async (req, res) => {
    res.status(200).send("Hospital DBMS");
});

app.post('/login', async (req, res) => {
    const {usertype, username, password} = req.body;
    const loginResponse = await loginUser(username, password);
    if (loginResponse.length === 1){
        jwt.sign({usertype, userSIN: loginResponse[0].sin, username, email: loginResponse[0].email}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                usertype,
                userSIN: loginResponse[0].sin, 
                username, 
                email: loginResponse[0].email
            });
        });
    } else {
        res.status(400).json("Invalid Credentials");
    }
});

app.post('/register', async (req, res) => {
    const {patientData, guardianData} = req.body;
    const registeredUserSuccess = await registerUser(patientData, guardianData);

    if (registeredUserSuccess === "Creation Error" || registeredUserSuccess === "User Exists"){
        res.status(400).json(registeredUserSuccess);
    } 
    if (registeredUserSuccess === "Created Account"){
        res.status(200).json(registeredUserSuccess);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('Logged out');
});

app.get('/verifyprofile', (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {return next();}
    try{
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    } catch (err) {
        res.status(401).json("Invalid Token");
    }
});

app.get('/userinfo/:usertype/:id', async (req, res) => {
    const {usertype, id} = req.params;

    let returnData = null;
    if (usertype === "admin"){
        returnData = await getAdminInfo(id);
    } else if (usertype === "doctor") {
        returnData = await getDoctorInfo(id);
    } else if (usertype === "patient"){
        returnData = await getPatientInfo(id);
    }

    if (returnData !== null){
        res.status(200).json(returnData);
    } else {
        res.status(400).json("Error getting profile");
    }
});

app.get('/allhospitals', async (req, res) => {
    const allHospitalData = await getAllHospitalData();
    res.status(200).json(allHospitalData);
});

app.get('/alldoctorsnurses', async (req, res) => {
    const allDoctorNurseData = await getAllDoctorNurseCardInfo();
    res.status(200).json(allDoctorNurseData);
});

app.get('/patient-appointments/:id', async (req, res) => {
    const {id} = req.params;
    const allPatientAppointments = await getPatientAppointments(id);
    res.status(200).json(allPatientAppointments);
});

app.get('/doctor-patients/:doctor_id', async (req, res) => {
    const {doctor_id} = req.params;
    const allDoctorPatients = await getAllPatientsByDoctor(doctor_id);
    res.status(200).json(allDoctorPatients);
});

app.get('/doctor-appointments/:doctor_id', async (req, res) => {
    const {doctor_id} = req.params;
    const allDoctorAppointments = await getAllDoctorAppointments(doctor_id);
    res.status(200).json(allDoctorAppointments);
});

app.get('/all-rooms/:admin_id', async (req, res) => {
    const {admin_id} = req.params;
    const allHositalRooms = await getAllHospitalRoomInfo(admin_id);
    res.status(200).json(allHositalRooms);
});

app.get('/hospital/:admin_id/medications', async (req, res) => {
    const {admin_id} = req.params;
    const allHospitalMeds = await getAllMedicationsAtHospital(admin_id);
    res.status(200).json(allHospitalMeds);
});

app.get('/hospital/:admin_id/equipment', async (req, res) => {
    const {admin_id} = req.params;
    const allHospitalEquipment = await getAllEquipmentAtHospital(admin_id);
    res.status(200).json(allHospitalEquipment);
});

app.get('/hospital/:admin_id/patients', async (req, res) => {
    const {admin_id} = req.params;
    const allPatientsByHospital = await getAllPatientsByHospital(admin_id);
    res.status(200).json(allPatientsByHospital);
});

app.get('/hospital/:admin_id/patients', async (req, res) => {
    const {admin_id} = req.params;
    const allPatientsByHospital = await getAllPatientsByHospital(admin_id);
    res.status(200).json(allPatientsByHospital);
});

app.get('/hospital/:admin_id/employees', async (req, res) => {
    const {admin_id} = req.params;
    const allEmployeesByHospital = await getAllEmployeesByHospital(admin_id);
    res.status(200).json(allEmployeesByHospital);
});

app.get('/hospitaloptions', async (req, res) => {
    const allHospitalOptions = await hospitalOptions();
    res.status(200).json(allHospitalOptions);
});

app.post('/patient-add-guardian', async (req, res) => {
    const {formData} = req.body;

    const addedUser = await addGuardianVisitor(formData);

    if (addedUser === "Added guardian/visitor"){
        res.status(200).json(addedUser);
    } else {
        res.status(400).json(addedUser);
    }
});

app.get('/updateprofileinfo/:id', async (req, res) => {
    const {id} = req.params;

    const allConcerns = await patientHealthIssues(id);
    const allPrescriptions = await patientPrescriptions(id);
    const generalInfo = await patientWeightHeight(id);

    const hospital_id = generalInfo.hospital_id;
    const allHospitalNurses = await allNursesByHospital (hospital_id);
    const currentPatientNurses = await getNursesByPatient(id);

    // console.log(allConcerns);
    // console.log(allPrescriptions);
    // console.log(generalInfo);
    // console.log(allHospitalNurses);
    // console.log(currentPatientNurses);
    res.status(200).json({allConcerns, allPrescriptions, generalInfo, allHospitalNurses, currentPatientNurses});
});

app.post('/patient/add-health-concern/:id', async (req, res) => {
    const {id} = req.params;
    const {newHealthIssue} = req.body;

    const addedConcern = await addPatientHealthConcern(id, newHealthIssue);
    if (addedConcern){
        res.status(200).json("Added concern!");
    } else {
        res.status(400).json("Error adding concern");
    }
});

app.put('/patient/update-weight/:id', async (req, res) => {
    const {id} = req.params;
    const {newWeight} = req.body;

    const updatedWeight = await updatePatientWeight(id, newWeight);
    if (updatedWeight){
        res.status(200).json("Updated Weight.");
    } else {
        res.status(400).json("Error updating weight");
    }
});

app.put('/patient/update-height/:id', async (req, res) => {
    const {id} = req.params;
    const {newHeight} = req.body;
    const updatedHeight = await updatePatientHeight(id, newHeight);
    if (updatedHeight){
        res.status(200).json("Updated Weight.");
    } else {
        res.status(400).json("Error updating weight");
    }
});

app.post('/patient/add-prescription/:id', async (req, res) => {
    const {id} = req.params;
    const {newPrescription} = req.body;
    const prescAdded = await addNewPrescription(id, newPrescription);

    if (prescAdded){
        res.status(200).json("Added prescription.");
    } else {
        res.status(400).json("Error adding prescription");
    }
});

app.post('/patient/remove-prescription/:id', async (req, res) => {
    const {id} = req.params;
    const {prescToRemove} = req.body;
    const prescRemoved = await removePrescription(id, prescToRemove);

    if (prescRemoved){
        res.status(200).json("Removed prescription.");
    } else {
        res.status(400).json("Error removing prescription");
    }
});

app.post('/patient/remove-health-concern/:id', async (req, res) => {
    const {id} = req.params;
    const {concernToRemove} = req.body;
    const concernRemoved = await removeHealthConcern(id, concernToRemove);
    
    if (concernRemoved){
        res.status(200).json("Removed concern.");
    } else {
        res.status(400).json("Error removing concern");
    }
});

app.post('/patient/add-nurse/:id', async (req, res) => {
    const {id} = req.params;
    const {newNurseSin} = req.body;

    const addedNurse = await addNurseToPatient(id, newNurseSin);
    if (addedNurse){
        res.status(200).json("Added nurse;");
    } else {
        res.status(400).json("Error adding nurse");
    }
});

app.post('/patient/remove-nurse/:id', async (req, res) => {
    const {id} = req.params;
    const {removeNurseSin} = req.body;

    const removedNurse = await removeNurseFromPatient(id, removeNurseSin);
    if (removedNurse){
        res.status(200).json("Removed nurse");
    } else {
        res.status(400).json("Error removing nurse");
    }
});

app.post('/admin/add-medication/:id', async (req, res) => {
    const {id} = req.params;
    const {med} = req.body;

    const addedMedication = await addMedicationToHospital(id, med);

    if (addedMedication){
        res.status(200).json("Added medication");
    } else {
        res.status(400).json("Error adding medication");
    }
});

app.put('/admin/modify-supply-quantity/:hospitalID', async (req, res) => {
    const {hospitalID} = req.params;
    const {itemID, newQuantity, opType} = req.body;
    const isUpdated = await addQuantity(hospitalID, itemID, newQuantity);
    if (isUpdated){
        res.status(200).json("Added quantity");
    } else {
        res.status(400).json("Error add quantity");
    }
});

app.post('/admin/add-equipment/:id', async (req, res) => {
    const {id} = req.params;
    const {equipment} = req.body;
    console.log(id);
    console.log(equipment);
    // const addedEquipment = await addMedicationToHospital(id, equipment);

    // if (addedEquipment){
    //     res.status(200).json("Added medication");
    // } else {
    //     res.status(400).json("Error adding medication");
    // }
});

// Run app on port 5000
const PORT = 5000;
app.listen(5000, ()=>{
    console.log(`Server running on port ${PORT}. `);
});