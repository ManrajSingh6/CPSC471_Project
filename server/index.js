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
    getPatientAppointments
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

// Run app on port 5000
const PORT = 5000;
app.listen(5000, ()=>{
    console.log(`Server running on port ${PORT}. `);
});