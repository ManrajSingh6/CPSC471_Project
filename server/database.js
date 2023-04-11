import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Manuraj25',
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

export async function registerUser(patientData, guardianData){
    let creationError = false;

    let userExists = false;
    const loginCheck = await loginUser(patientData.pUsername, patientData.pPassword);
    if (loginCheck.length === 1){
        userExists = true;
    }

    if (!userExists){
        const personQuery = 'INSERT INTO person (sin, name, date_of_birth, house_number, street_name, postal_code, city, province, country, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const personValues = [patientData.pSIN, patientData.pFullname, patientData.pDOB, patientData.pHouseNum, patientData.pStreetAddr, patientData.pPostalCode, patientData.pCity, patientData.pProvince, patientData.pCountry, patientData.pPhone];

        await pool.query(personQuery, personValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        });

        const accountQuery = 'INSERT INTO account_information (sin, email, username, password) VALUES (?, ?, ?, ?)';
        const accountValues = [patientData.pSIN, patientData.pEmail, patientData.pUsername, patientData.pPassword];

        await pool.query(accountQuery, accountValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        });

        const patientQuery = 'INSERT INTO patient (sin, weight_kg, height_ft, sex, hospital_id, room_no) VALUES (?, ?, ?, ?, ?, ?)';
        const patientValues = [patientData.pSIN, patientData.pWeight, patientData.pHeight, patientData.pSex, patientData.pHospitalPref, null];

        await pool.query(patientQuery, patientValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        });
        
        const guardianQuery = 'INSERT INTO guardian_visitor (visitor_id, contact_number, relationship, name, house_number, street_name, postal_code, city, province, country, visitee_sin) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const guardianValues = [guardianData.gSIN, guardianData.gContactNumber, guardianData.gRelationship, guardianData.gFullname, guardianData.gHouseNum, guardianData.gStreetAddr, guardianData.gPostalCode, guardianData.gCity, guardianData.gProvince, guardianData.gCountry, patientData.pSIN];

        await pool.query(guardianQuery, guardianValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        });

        const medicalRecordQuery = 'INSERT INTO medical_record (patient_sin, doctor_name, nurse_name, guardian_name) VALUES (?, ?, ?, ?)';
        const medicalValues = [patientData.pSIN, null, null, guardianData.gFullname];

        await pool.query(medicalRecordQuery, medicalValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        })

        if (creationError){
            return "Creation Error";
        } else {
            return "Created Account";
        }
    } else {
        return "User Exists";
    }
    
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
        `SELECT A.*, P.*, PA.*, H.hospital_name 
        FROM account_information AS A, person AS P, patient AS PA, hospital AS H 
        WHERE (P.sin = ? AND A.sin = ? AND PA.sin = ? AND H.hospital_id = PA.hospital_id)`, [id, id, id]
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
        `SELECT D.*, H.*, P.*, A.username, A.email, DP.name AS department_name
        FROM doctor AS D, person AS P, account_information as A, hospital as H, department AS DP
        WHERE (D.sin = ? 
            AND P.sin = D.sin 
            AND A.sin = D.sin 
            AND H.hospital_id = D.hospital_id
            AND D.dept_no = DP.department_num)`, [id]
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

export async function getAllPatientsByDoctor(doctor_id){
    const [allPatientsByDoctor] = await pool.query(
        `
        SELECT PS.*
        FROM doctor_attends_patient AS DA, person AS PS
        WHERE (DA.patient_sin = PS.sin AND DA.doctor_sin = ?);`, [doctor_id]
    );

    return allPatientsByDoctor;
}

export async function getAllDoctorAppointments(doctor_id){
    const [allDoctorAppointments] = await pool.query(
        `SELECT A.appointment, P.name, H.*, GROUP_CONCAT(HI.health_issue SEPARATOR '; ') AS patient_health_issues
        FROM appointments AS A, doctor_attends_patient AS DA, person AS P, hospital AS H, patient AS PA, health_issues AS HI
        WHERE (DA.doctor_sin = 123450987 
            AND A.patient_sin = DA.patient_sin 
            AND P.sin = DA.patient_sin
            AND H.hospital_id = PA.hospital_id
            AND PA.sin = DA.patient_sin
            AND HI.patient_sin = DA.patient_sin)`, [doctor_id]
    );
    return allDoctorAppointments;
}

export async function getAllHospitalRoomInfo(admin_id){
    const [allHospitalRooms] = await pool.query(
        `
        SELECT R.*, D.name
        FROM room AS R, admin AS AD, department AS D
        WHERE (R.hospital_id = AD.hospital_id AND AD.sin = ? AND D.department_num = R.dept_no)
        `, [admin_id]
    );
    return allHospitalRooms;
}

export async function getAllMedicationsAtHospital(admin_id){

    const [hospitalID] = await pool.query(`SELECT hospital_id FROM admin WHERE admin.sin = ?`, [admin_id]);
    
    const [allMeds] = await pool.query(
        `
        SELECT S.*, M.din_number, M.expiry_date
        FROM medication AS M, supplies AS S
        WHERE (S.hospital_id = ? AND S.item_id = M.item_id)
        `, [hospitalID[0].hospital_id]
    );

    return (allMeds);
}

export async function getAllEquipmentAtHospital(admin_id){

    const [hospitalID] = await pool.query(`SELECT hospital_id FROM admin WHERE admin.sin = ?`, [admin_id]);
    
    const [allEquipment] = await pool.query(
        `
        SELECT S.*, E.equipment_number, E.manufacturer, E.warranty_name, E.warranty_start, E.warranty_length_months
        FROM equipment AS E, supplies AS S
        WHERE (S.hospital_id = ? AND S.item_id = E.item_id)
        `, [hospitalID[0].hospital_id]
    );

    return (allEquipment);
}

export async function getAllPatientsByHospital(admin_id){
    const [hospitalID] = await pool.query(`SELECT hospital_id FROM admin WHERE admin.sin = ?`, [admin_id]);

    const [allPatientsAtHospital] = await pool.query(
        `
        SELECT P.*, PS.name, PS.date_of_birth
        FROM patient AS P, person as PS
        WHERE (P.hospital_id = ? AND PS.sin = P.sin)`, [hospitalID[0].hospital_id]
    );

    return allPatientsAtHospital;
}

export async function getAllEmployeesByHospital(admin_id){
    const [hospitalID] = await pool.query(`SELECT hospital_id FROM admin WHERE admin.sin = ?`, [admin_id]);

    const [allDoctors] = await pool.query(
        `
        SELECT D.*, P.name, P.date_of_birth
        FROM doctor AS D, person AS P
        WHERE (D.hospital_id = ? AND P.sin = D.sin)`, [hospitalID[0].hospital_id]
    );

    const [allNurses] = await pool.query(
        `
        SELECT N.*, P.name, P.date_of_birth
        FROM nurse AS N, person AS P
        WHERE (N.hospital_id = ? AND P.sin = N.sin)`, [hospitalID[0].hospital_id]
    );
    return ({allDoctors, allNurses});
}

export async function hospitalOptions(){
    const [hospitalOptions] = await pool.query(
        `SELECT H.hospital_name, H.hospital_id FROM hospital AS H`
    );
    return hospitalOptions;
}
