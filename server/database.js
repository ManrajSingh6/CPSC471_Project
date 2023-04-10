import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'hospitaldatabase'
}).promise();

export async function getAllPeople(){
    const [data] = await pool.query("SELECT * FROM person");
    return data;
}

export async function loginUser(username, password){
    const [query] = await pool.query(
        "SELECT * FROM account_information WHERE username = ? AND password = ?", [username, password]
    );
    return query;
}

export async function getAdminInfo(id){
    const [adminInfo] = await pool.query(
        "SELECT * FROM account_information AS A, admin AS AD, person as P WHERE (P.sin = ? AND A.sin = ? AND AD.sin= ?)",
        [id, id, id]
    );

    const [hospitalInfo] = await pool.query(
        "SELECT * FROM hospital WHERE hospital.hospital_id = ?", [adminInfo[0].hospital_id]
    );
    
    return {adminInfo: adminInfo[0], hospitalInfo: hospitalInfo[0]};
}

export async function getPatientInfo(id){
    const [patientInfo] = await pool.query(
        "SELECT * FROM account_information AS A, person AS P WHERE (P.sin = ? AND A.sin = ?)", [id, id]
    );

    const [patientMedicalRecord] = await pool.query(
        "SELECT * FROM medical_record AS M WHERE (M.patient_sin = ?)", [id]
    );

    const [patientHealthIssues] = await pool.query(
        "SELECT * FROM health_issues AS H WHERE (H.patient_sin = ?)", [id]
    );

    const [patientPrescriptions] = await pool.query(
        "SELECT * FROM prescriptions AS P WHERE (P.patient_sin = ?)", [id]
    );

    const [patientRoomInfo] = await pool.query(
        "SELECT * FROM patient AS P, room AS R, hospital AS H WHERE P.sin = ? AND P.hospital_id = H.hospital_id AND P.hospital_id = R.hospital_id AND R.room_number = P.room_no", [id]
    );

    return({
        patientInfo: patientInfo[0], 
        medicalRecord: patientMedicalRecord[0],
        patientHealthIssues,
        patientPrescriptions,
        patientRoomInfo,
    });
}

export async function getDoctorInfo(id){
    const [doctorInfo] = await pool.query(
        `SELECT *
        FROM doctor AS D, person AS P, account_information as A
        WHERE (D.sin = ? AND P.sin = D.sin AND A.sin = D.sin)`, [id]
    );

    const [doctorAttendsPatients] = await pool.query(
        `SELECT PS.name
        FROM doctor_attends_patient AS DA, patient AS P, person as PS
        WHERE (DA.doctor_sin = ? AND P.sin = DA.patient_sin AND PS.sin = DA.patient_sin)`, [id]
    );

    return({doctorInfo: doctorInfo[0], patientsAttendedTo: doctorAttendsPatients});
}

export async function getPatientAppointments(id){
    const [patientAppointmentInfo] = await pool.query(
        `SELECT PS.name AS doctor_with, AP.appointment, H.*, HI.health_issue
        FROM doctor AS D, patient AS P, doctor_attends_patient AS DA, person AS PS, appointments AS AP, hospital AS H, health_issues AS HI
        WHERE (P.sin = ? 
            AND P.sin = DA.patient_sin 
            AND DA.doctor_sin = D.sin 
            AND DA.doctor_sin = PS.sin
            AND AP.patient_sin = P.sin
            AND P.hospital_id = H.hospital_id
            AND HI.patient_sin = P.sin)`, [id]
    );
    return (patientAppointmentInfo);
}

export async function getAllHospitalData(){
    const [allHospitalData] = await pool.query(
        `SELECT H.*, GROUP_CONCAT(D.name, ',', D.department_num, ',', D.number_of_rooms SEPARATOR ';') AS department_data 
        FROM hospital AS H 
        INNER JOIN department AS D 
        ON H.hospital_id = D.hospital_id 
        GROUP BY H.hospital_id;`
    );
    
    return allHospitalData;
}

export async function getAllDoctorNurseCardInfo(){
    const [allDoctorData] = await pool.query(
        `SELECT D.*, P.name AS doctor_name, DP.name AS dept_name, H.hospital_name
        FROM doctor AS D, department AS DP, person AS P, hospital AS H
        WHERE (D.dept_no = DP.department_num AND P.sin = D.sin AND H.hospital_id = DP.hospital_id)`
    );

    const [allNurseData] = await pool.query(
        `SELECT N.*, P.name AS nurse_name
        FROM nurse AS N, person AS P
        WHERE (P.sin = N.sin)`
    );

    return({allDoctorData, allNurseData});
}
