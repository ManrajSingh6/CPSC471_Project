import mysql, { format } from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    // CONNECT TO THE user HERE (eg. root)
    user: '', 
    // ENTER THE USER's PASSWORD HERE
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

export async function registerUser(patientData, guardianData, nurseName, doctorName){
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
        const patientValues = [patientData.pSIN, patientData.pWeight, patientData.pHeight, patientData.pSex, patientData.pHospitalPref, patientData.pRoomNum];

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
        const medicalValues = [patientData.pSIN, doctorName, nurseName, guardianData.gFullname];

        await pool.query(medicalRecordQuery, medicalValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        })

        if (patientData.pDoctorChoice !== null && patientData.pNurseChoice !== null){
            const insertQuery = 'INSERT INTO doctor_attends_patient (doctor_sin, patient_sin) VALUES (?, ?)';
            const insertValues = [patientData.pDoctorChoice, patientData.pSIN];

            await pool.query(insertQuery, insertValues, (error, result) => {
                if (error) {
                    creationError = true;
                    // throw error;
                }
            });
            const insertQuerySecond = 'INSERT INTO nurse_assists_patient (nurse_sin, patient_sin) VALUES (?, ?)';
            const insertValuesSecond = [patientData.pNurseChoice, patientData.pSIN];

            await pool.query(insertQuerySecond, insertValuesSecond, (error, result) => {
                if (error) {
                    creationError = true;
                    // throw error;
                }
            });
        }

        if (creationError){
            return "Creation Error";
        } else {
            return "Created Account";
        }
    } else {
        return "User Exists";
    }
    
}

export async function getNameByID(id){
    const [name] = await pool.query(`SELECT P.name FROM person AS P WHERE P.sin = ?`, [id]);
    return (name);
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
        `SELECT A.appointment, P.name, H.*
        FROM appointments AS A, doctor AS D, doctor_attends_patient AS DA, person AS P, hospital AS H
        WHERE (A.patient_sin = ?
            AND DA.doctor_sin = D.sin
            AND DA.patient_sin = A.patient_sin
            AND P.sin = D.sin
            AND D.hospital_id = H.hospital_id)`, [id]
    );

    const allPatientHealthIssues = await getAllPatientHealthIssues(id);
    
    return ({patientAppointmentInfo: patientAppointmentInfo, healthIssues: allPatientHealthIssues});
}

export async function getAllPatientHealthIssues(patientID){
    const [allIssues] = await pool.query(
        `SELECT HI.health_issue
        FROM health_issues AS HI
        WHERE (HI.patient_sin = ?);`, [patientID]
    );
    
    return allIssues;
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
        `SELECT DA.*, A.appointment, P.name, H.*
        FROM doctor_attends_patient AS DA, appointments AS A, person AS P, hospital AS H, patient as PA 
        WHERE (DA.doctor_sin = ?
            AND A.patient_sin = DA.patient_sin
            AND P.sin = A.patient_sin
            AND H.hospital_id = PA.hospital_id
            AND A.patient_sin = PA.sin)`, [doctor_id]
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

    const [allRooms] = await pool.query(
        `SELECT R.room_number FROM room AS R WHERE (R.hospital_id = ?)`, [hospitalID[0].hospital_id]
    );

    return ({allMeds, allRooms});
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

    const [allRooms] = await pool.query(
        `SELECT R.room_number FROM room AS R WHERE (R.hospital_id = ?)`, [hospitalID[0].hospital_id]
    );

    return ({allEquipment, allRooms});
}

export async function getAllPatientsByHospital(admin_id){
    const [hospitalID] = await pool.query(`SELECT hospital_id FROM admin WHERE admin.sin = ?`, [admin_id]);

    const [allPatientsAtHospital] = await pool.query(
        `
        SELECT P.*, PS.name, PS.date_of_birth, M.doctor_name, M.nurse_name
        FROM patient AS P, person as PS, medical_record AS M
        WHERE (P.hospital_id = ? AND PS.sin = P.sin AND P.sin = M.patient_sin)`, [hospitalID[0].hospital_id]
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

export async function addGuardianVisitor(guardianData){
    const [alreadyExists] = await pool.query(
        `SELECT * FROM guardian_visitor WHERE visitor_id = ?`, [guardianData.gSIN]
    );

    let alreadyExistsBool = false;
    if (alreadyExists.length === 1){
        alreadyExistsBool = true;
    }

    if (!alreadyExistsBool){
        let creationError = false;
        const guardianQuery = 'INSERT INTO guardian_visitor (visitor_id, contact_number, relationship, name, house_number, street_name, postal_code, city, province, country, visitee_sin) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const guardianValues = [guardianData.gSIN, guardianData.gPhoNumber, guardianData.gRel, guardianData.gName, guardianData.gHouseNum, guardianData.gAddress, guardianData.gZipCode, guardianData.gCity, guardianData.gProvince, guardianData.gCountry, guardianData.visiteeSin];

        await pool.query(guardianQuery, guardianValues, (error, result) => {
            if (error) {
                creationError = true;
            }
        });

        if (!creationError){
            return "Added guardian/visitor";
        } else {
            return "Error occured";
        }
    } 
    
    else {
        return ("Guardian/visitor already exists!");
    } 
}

export async function patientHealthIssues(id){
    const [allConcerns] = await pool.query(
        `SELECT HI.health_issue
        FROM health_issues AS HI
        WHERE (HI.patient_sin = ?)`, [id]
    );

    return (allConcerns);
}

export async function patientPrescriptions(id){
    const [allPrescriptions] = await pool.query(
        `SELECT P.prescription, P.length_weeks, P.dose_mg 
        FROM prescriptions AS P
        WHERE (P.patient_sin = ?)`, [id]
    );

    return (allPrescriptions);
}

export async function patientWeightHeight(id){
    const [weightHeight] = await pool.query(
        `SELECT P.weight_kg, P.height_ft, PS.name, P.hospital_id
        FROM patient AS P, person AS PS
        WHERE (P.sin = ? AND P.sin = PS.sin)`, [id]
    );

    return weightHeight[0];
}

export async function allNursesByHospital(hospital_id){
    const [allNurses] = await pool.query(
        `
        SELECT N.sin AS nurse_sin, P.name AS nurse_name 
        FROM nurse AS N, person AS P
        WHERE (N.hospital_id = ? AND P.sin = N.sin)`, [hospital_id]
    );
    
    return allNurses;
}

export async function getNursesByPatient(patient_id){
    const [patientNurses] = await pool.query(
        `
        SELECT NA.*, P.name
        FROM nurse_assists_patient AS NA, person AS P
        WHERE (NA.patient_sin = ? AND P.sin = NA.nurse_sin)`, [patient_id]
    );
    
    return patientNurses;
}

export async function addPatientHealthConcern(patient_id, newHealthIssue){
    
    const guardianQuery = 'INSERT INTO health_issues (patient_sin, health_issue) VALUES (?, ?)';
    const guardianValues = [patient_id, newHealthIssue];

    await pool.query(guardianQuery, guardianValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return (true);
}

export async function updatePatientWeight(patient_id, newWeight){
    const updateQuery = 'UPDATE patient SET weight_kg = ? WHERE sin = ?';
    const updateValues = [newWeight, patient_id];

    await pool.query(updateQuery, updateValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return (true);
}

export async function updatePatientHeight(patient_id, newHeight){
    const updateQuery = 'UPDATE patient SET height_ft = ? WHERE sin = ?';
    const updateValues = [newHeight, patient_id];

    await pool.query(updateQuery, updateValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return (true);
}

export async function addNewPrescription(patient_id, prescData){
    const insertQuery = 'INSERT INTO prescriptions (patient_sin, prescription, length_weeks, dose_mg) VALUES (?, ?, ?, ?)';
    const insertValues = [patient_id, prescData.medName, prescData.prescLength, prescData.dosage];

    await pool.query(insertQuery, insertValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return true;
}

export async function removePrescription(patient_id, prescription){
    const deleteQuery = 'DELETE FROM prescriptions WHERE (patient_sin = ? AND prescription = ?)';
    const deleteValues = [patient_id, prescription];
    await pool.query(deleteQuery, deleteValues, (error, result) => {
        if (error) {
            return (false);
        }
    });
    return true;
}

export async function removeHealthConcern(patient_id, concern){
    const deleteQuery = 'DELETE FROM health_issues WHERE (patient_sin = ? AND health_issue = ?)';
    const deleteValues = [patient_id, concern];
    await pool.query(deleteQuery, deleteValues, (error, result) => {
        if (error) {
            return (false);
        }
    });
    return true;
}

export async function addNurseToPatient(patient_id, newNurseSin){

    const [nurseExists] = await pool.query(`SELECT * FROM nurse_assists_patient WHERE (nurse_sin = ? AND patient_sin = ?)`, [newNurseSin, patient_id]);
    if (nurseExists.length !== 1){
        const insertQuery = 'INSERT INTO nurse_assists_patient (nurse_sin, patient_sin) VALUES (?, ?)';
        const insertValues = [newNurseSin, patient_id];

        await pool.query(insertQuery, insertValues, (error, result) => {
            if (error) {
                return (false);
            }
        });
        return true;
    } else {
        return false;
    }
    
}

export async function removeNurseFromPatient(patient_id, removeNurseSin){
    const [nurseExists] = await pool.query(`SELECT * FROM nurse_assists_patient WHERE (nurse_sin = ? AND patient_sin = ?)`, [removeNurseSin, patient_id]);
    if (nurseExists.length === 1){
        const deleteQuery = 'DELETE FROM nurse_assists_patient WHERE (nurse_sin = ? AND patient_sin = ?)';
        const deleteValues = [removeNurseSin, patient_id];

        await pool.query(deleteQuery, deleteValues, (error, result) => {
            if (error) {
                return (false);
            }
        });
        return true;
    } else {
        return false;
    }
}

export async function addMedicationToHospital(admin_id, med){
    const [hospitalID] = await pool.query(
        `SELECT A.hospital_id
        FROM admin AS A
        WHERE A.sin = ?`, [admin_id]
    );

    const hospital_id = hospitalID[0].hospital_id;

    const [itemExists] = await pool.query(
        `
        SELECT S.item_id, S.name, S.price
        FROM supplies AS S
        WHERE (S.item_id = ? AND S.hospital_id = ?);
        `, [med.medID, hospital_id]
    );

    if (itemExists.length === 1){
        return false;
    } else {
        const insertQuery = 'INSERT INTO supplies (item_id, name, price, category, quantity, hospital_id, room_number) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [med.medID, med.medName, med.medPrice, med.medCategory, med.medQuantity, hospital_id, med.medRoomChoice];

        await pool.query(insertQuery, insertValues, (error, result) => {
            if (error) {
                return (false);
            }
        });

        const secondInsertQuery = 'INSERT INTO medication (item_id, din_number, expiry_date) VALUES (?, ?, ?)';
        const secondInsertValues = [med.medID, med.medDIN, med.medExpiryDate];

        await pool.query(secondInsertQuery, secondInsertValues, (error, result) => {
            if (error) {
                return (false);
            }
        });

        return (true);
    }
}

export async function addQuantity(hospitalID, itemID, newQuantity){
    const updateQuery = 'UPDATE supplies SET quantity = ? WHERE (item_id = ? AND hospital_id = ?)';
    const updateValues = [newQuantity, itemID, hospitalID];

    await pool.query(updateQuery, updateValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return true;
}

export async function deleteHospitalMedication(itemID, hospitalID){
    const deleteQuery = 'DELETE FROM supplies WHERE (item_id = ? AND hospital_id = ?)';
    const deleteValues = [itemID, hospitalID];

    await pool.query(deleteQuery, deleteValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    const deleteQuerySecond = 'DELETE FROM medication WHERE (item_id = ?)';
    const deleteValuesSecond = [itemID, hospitalID];

    await pool.query(deleteQuerySecond, deleteValuesSecond, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return(true);
}

export async function deleteHospitalEquipment(itemID, hospitalID){
    const deleteQuery = 'DELETE FROM supplies WHERE (item_id = ? AND hospital_id = ?)';
    const deleteValues = [itemID, hospitalID];

    await pool.query(deleteQuery, deleteValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    const deleteQuerySecond = 'DELETE FROM equipment WHERE (item_id = ?)';
    const deleteValuesSecond = [itemID, hospitalID];

    await pool.query(deleteQuerySecond, deleteValuesSecond, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return(true);
}

export async function addEquipmentToHospital(admin_id, equip){
    const [hospitalID] = await pool.query(
        `SELECT A.hospital_id
        FROM admin AS A
        WHERE A.sin = ?`, [admin_id]
    );

    const hospital_id = hospitalID[0].hospital_id;

    const [itemExists] = await pool.query(
        `
        SELECT S.item_id, S.name, S.price
        FROM supplies AS S
        WHERE (S.item_id = ? AND S.hospital_id = ?);
        `, [equip.ID, hospital_id]
    );

    if (itemExists.length === 1){
        return false;
    } else {
        const insertQuery = 'INSERT INTO supplies (item_id, name, price, category, quantity, hospital_id, room_number) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [equip.ID, equip.Name, equip.Price, equip.Category, equip.Quantity, hospital_id, equip.RoomChoice];

        await pool.query(insertQuery, insertValues, (error, result) => {
            if (error) {
                return (false);
            }
        });

        const secondInsertQuery = 'INSERT INTO equipment (item_id, equipment_number, manufacturer, warranty_name, warranty_start, warranty_length_months) VALUES (?, ?, ?, ?, ?, ?)';
        const secondInsertValues = [equip.ID, equip.eqNumber, equip.manufacturer, equip.warranty_name, equip.warranty_start, equip.warranty_length];

        await pool.query(secondInsertQuery, secondInsertValues, (error, result) => {
            if (error) {
                return (false);
            }
        });

        return (true);
    }
}

export async function addPatientAppointment(id, newDateTime){
    const formattedDate = new Date(newDateTime).toISOString().slice(0, 19).replace('T', ' ');

    const [alreadyExists] = await pool.query(
        `SELECT * FROM appointments WHERE (patient_sin = ? AND appointment = ?)`, [id, formattedDate]
    );

    if (alreadyExists.length === 1){
        return false;
    } else {
        const insertQuery = 'INSERT INTO appointments (patient_sin, appointment) VALUES (?, ?)';
        const insertValues = [id, formattedDate];
        console.log(formattedDate);
        await pool.query(insertQuery, insertValues, (error, result) => {
            if (error) {
                return (false);
            }
        });

        return (true);

    }
}

export async function removePatientAppointment(id, removalApp){
    const inputDate = new Date(removalApp);
    const outputDateString = `${inputDate.getFullYear()}-${(inputDate.getMonth()+1).toString().padStart(2, '0')}-${inputDate.getDate().toString().padStart(2, '0')} ${inputDate.getHours().toString().padStart(2, '0')}:${inputDate.getMinutes().toString().padStart(2, '0')}:${inputDate.getSeconds().toString().padStart(2, '0')}`;
    
    const [alreadyExists] = await pool.query(
        `SELECT * FROM appointments WHERE (patient_sin = ? AND appointment = ?)`, [id, outputDateString]
    );

    if (alreadyExists.length === 1){
        const deleteQuery = 'DELETE FROM appointments WHERE (patient_sin = ? AND appointment = ?)';
        const deleteValues = [id, outputDateString];
        await pool.query(deleteQuery, deleteValues, (error, result) => {
            if (error) {
                return (false);
            }
        });

        return (true);

    } else {
        return (false);
    }
}

export async function modifyPatientAppointment(id, appToChange, newAppTime){
    const inputDate = new Date(appToChange);
    const outputDateString = `${inputDate.getFullYear()}-${(inputDate.getMonth()+1).toString().padStart(2, '0')}-${inputDate.getDate().toString().padStart(2, '0')} ${inputDate.getHours().toString().padStart(2, '0')}:${inputDate.getMinutes().toString().padStart(2, '0')}:${inputDate.getSeconds().toString().padStart(2, '0')}`;
    const newAppFormatted = new Date(newAppTime).toISOString().slice(0, 19).replace('T', ' ');
    
    const [alreadyExists] = await pool.query(
        `SELECT * FROM appointments WHERE (patient_sin = ? AND appointment = ?)`, [id, outputDateString]
    );
    if (alreadyExists.length === 1){
        const modifyQuery = 'UPDATE appointments SET appointment = ? WHERE patient_sin = ? AND appointment = ?';
        const modifyValues = [newAppFormatted, id, outputDateString];
        await pool.query(modifyQuery, modifyValues, (error, result) => {
            if (error) {
                return (false);
            }
        });
        return (true);
    } else {
        return (false);
    }
}

export async function assignRoom(patientID, roomNumber){
    const query = 'UPDATE patient SET room_no = ? WHERE sin = ?';
    const values = [roomNumber, patientID];

    await pool.query(query, values, (error, result) => {
        if (error) {
            return (false);
        }
    });
    return (true);
}

export async function assignNurse(patientID, nurseSIN){

    const [alreadyExists] = await pool.query(
        `SELECT * FROM nurse_assists_patient WHERE nurse_sin = ? AND patient_sin = ?`, [nurseSIN, patientID]
    );

    if (alreadyExists.length !== 1){
        await addNurseToPatient(patientID, nurseSIN);
    }

    const query = 'UPDATE nurse_assists_patient SET nurse_sin = ? WHERE patient_sin = ?'; 
    const values = [nurseSIN, patientID];

    await pool.query(query, values, (error, result) => {
        if (error) {
            return (false);
        }
    });
    
    const nurseName = await getNameByID(nurseSIN);
    const secondQuery = 'UPDATE medical_record SET nurse_name = ? WHERE patient_sin = ?';
    const secondValues = [nurseName[0].name, patientID];

    await pool.query(secondQuery, secondValues, (error, result) => {
        if (error) {
            return (false);
        }
    });

    return (true);
}

export async function addDoctorToPatient(patientID, doctorSIN){
    const insertQuery = 'INSERT INTO doctor_attends_patient (doctor_sin, patient_sin) VALUES (?, ?)';
    const insertValues = [doctorSIN, patientID];

    await pool.query(insertQuery, insertValues, (error, result) => {
        if (error) {
            creationError = true;
            // throw error;
        }
    });

    return true;
}


export async function assignDoctor(patientID, doctorSIN){
    console.log(patientID, doctorSIN);

    const [alreadyExists] = await pool.query(
        `SELECT * FROM doctor_attends_patient WHERE doctor_sin = ? AND patient_sin = ?`, [doctorSIN, patientID]
    );

    if (alreadyExists.length !== 1){
        await addDoctorToPatient(patientID, doctorSIN);
        const doctorName = await getNameByID(doctorSIN);
        const secondQuery = 'UPDATE medical_record SET doctor_name = ? WHERE patient_sin = ?';
        const secondValues = [doctorName[0].name, patientID];

        await pool.query(secondQuery, secondValues, (error, result) => {
            if (error) {
                return (false);
            }
        });
        return true;
    } else {
        const query = 'UPDATE doctor_attends_patient SET doctor_sin = ? WHERE patient_sin = ?'; 
        const values = [doctorSIN, patientID];

        await pool.query(query, values, (error, result) => {
            if (error) {
                return (false);
            }
        });
    
        const doctorName = await getNameByID(doctorSIN);
        const secondQuery = 'UPDATE medical_record SET doctor_name = ? WHERE patient_sin = ?';
        const secondValues = [doctorName[0].name, patientID];

        await pool.query(secondQuery, secondValues, (error, result) => {
            if (error) {
                return (false);
            }
        });
        return (true);
    }
}

export async function deletePatientAccount(patientSIN){
    const value = [patientSIN];

    const [prescExists] = await pool.query(`SELECT * FROM prescriptions WHERE patient_sin = ?`, [patientSIN]);
    if (prescExists.length >= 1){
        const deletePrescQuery = 'DELETE FROM prescriptions WHERE patient_sin = ?';
        await pool.query(deletePrescQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [vgExists] = await pool.query(`SELECT * FROM guardian_visitor WHERE visitee_sin = ?`, [patientSIN]);
    if (vgExists.length >= 1){
        const deleteGVQuery = 'DELETE FROM guardian_visitor WHERE visitee_sin = ?';
        await pool.query(deleteGVQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [appointmentsExist] = await pool.query(`SELECT * FROM appointments WHERE patient_sin = ?`, [patientSIN]);
    if (appointmentsExist.length >= 1){
        const deleteAppointmentsQuery = 'DELETE FROM appointments WHERE patient_sin = ?';
        await pool.query(deleteAppointmentsQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [medRecordExist] = await pool.query(`SELECT * FROM medical_record WHERE patient_sin = ?`, [patientSIN]);
    if (medRecordExist.length >= 1){
        const deleteMedicalRecordQuery = 'DELETE FROM medical_record WHERE patient_sin = ?';
        await pool.query(deleteMedicalRecordQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [nursePatientExist] = await pool.query(`SELECT * FROM nurse_assists_patient WHERE patient_sin = ?`, [patientSIN]);
    if (nursePatientExist.length >= 1){
        const deleteNursePatient = 'DELETE FROM nurse_assists_patient WHERE patient_sin = ?';
        await pool.query(deleteNursePatient, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [doctorPatientExist] = await pool.query(`SELECT * FROM doctor_attends_patient WHERE patient_sin = ?`, [patientSIN]);
    if (doctorPatientExist.length >= 1){
        const deleteDoctorPatient = 'DELETE FROM doctor_attends_patient WHERE patient_sin = ?';
        await pool.query(deleteDoctorPatient, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [patientRecordExist] = await pool.query(`SELECT * FROM patient WHERE sin = ?`, [patientSIN]);
    if (patientRecordExist.length >= 1){
        const deletePatientRecord = 'DELETE FROM patient WHERE sin = ?';
        await pool.query(deletePatientRecord, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [accountInfoExist] = await pool.query(`SELECT * FROM account_information WHERE sin = ?`, [patientSIN]);
    if (accountInfoExist.length >= 1){
        const deleteAccountInfo = 'DELETE FROM account_information WHERE sin = ?';
        await pool.query(deleteAccountInfo, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    const [personRecordExist] = await pool.query(`SELECT * FROM person WHERE sin = ?`, [patientSIN]);
    if (personRecordExist.length >= 1){
        const deletePersonRecord = 'DELETE FROM person WHERE sin = ?';
        await pool.query(deletePersonRecord, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }
    
    return (true);
}

export async function getAllHositalDepartments(id){
    const [hospitalID] = await pool.query(
        `SELECT A.hospital_id
        FROM admin AS A
        WHERE A.sin = ?`, [id]
    );

    const hospital_id = hospitalID[0].hospital_id;

    const [allDeps] = await pool.query(
        `SELECT * FROM department AS D WHERE D.hospital_id = ?`, [hospital_id]
    );

    return allDeps;
}

export async function createDoctor(adminID, personInfo, doctorInfo){
    const [hospitalID] = await pool.query(
        `SELECT A.hospital_id
        FROM admin AS A
        WHERE A.sin = ?`, [adminID]
    );

    const hospital_id = hospitalID[0].hospital_id;

    const [personExists] = await pool.query(
        `SELECT * FROM person WHERE sin = ?`, [personInfo.pSIN]
    );

    if (personExists.length !== 1){
        const personQuery = 'INSERT INTO person (sin, name, date_of_birth, house_number, street_name, postal_code, city, province, country, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const personValues = [personInfo.pSIN, personInfo.pFullname, personInfo.pDOB, personInfo.pHouseNum, personInfo.pStreetAddr, personInfo.pPostalCode, personInfo.pCity, personInfo.pProvince, personInfo.pCountry, personInfo.pPhone];

        await pool.query(personQuery, personValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        });
    }

    const accountQuery = 'INSERT INTO account_information (sin, email, username, password) VALUES (?, ?, ?, ?)';
    const accountValues = [personInfo.pSIN, personInfo.pEmail, personInfo.pUsername, personInfo.pPassword];

    await pool.query(accountQuery, accountValues, (error, result) => {
        if (error) {
            creationError = true;
            // throw error;
        }
    });

    const doctorQuery = "INSERT INTO doctor (sin, qualification, specialization, dept_no, hospital_id) VALUES (?, ?, ?, ?, ?)";
    const doctorValues = [personInfo.pSIN, doctorInfo.qualification, doctorInfo.specialization, doctorInfo.deptNum, hospital_id];

    await pool.query(doctorQuery, doctorValues, (error, result) => {
        if (error) {
            creationError = true;
            // throw error;
        }
    });

    return true;
}

export async function createNurse(adminID, personInfo, nurseInfo){
    const [hospitalID] = await pool.query(
        `SELECT A.hospital_id
        FROM admin AS A
        WHERE A.sin = ?`, [adminID]
    );

    const hospital_id = hospitalID[0].hospital_id;

    const [personExists] = await pool.query(
        `SELECT * FROM person WHERE sin = ?`, [personInfo.pSIN]
    );

    if (personExists.length !== 1){
        const personQuery = 'INSERT INTO person (sin, name, date_of_birth, house_number, street_name, postal_code, city, province, country, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const personValues = [personInfo.pSIN, personInfo.pFullname, personInfo.pDOB, personInfo.pHouseNum, personInfo.pStreetAddr, personInfo.pPostalCode, personInfo.pCity, personInfo.pProvince, personInfo.pCountry, personInfo.pPhone];

        await pool.query(personQuery, personValues, (error, result) => {
            if (error) {
                creationError = true;
                // throw error;
            }
        });
    }

    const accountQuery = 'INSERT INTO account_information (sin, email, username, password) VALUES (?, ?, ?, ?)';
    const accountValues = [personInfo.pSIN, personInfo.pEmail, personInfo.pUsername, personInfo.pPassword];

    await pool.query(accountQuery, accountValues, (error, result) => {
        if (error) {
            creationError = true;
            // throw error;
        }
    });

    const nurseQuery = "INSERT INTO nurse (sin, type, position_type, hospital_id) VALUES (?, ?, ?, ?)";
    const nurseValues = [personInfo.pSIN, nurseInfo.nurseType, nurseInfo.positionType, hospital_id];

    await pool.query(nurseQuery, nurseValues, (error, result) => {
        if (error) {
            creationError = true;
            // throw error;
        }
    });

    return true;
}

export async function deleteDoctor(doctorSIN){
    const value =[doctorSIN];

    const [dap] = await pool.query(`SELECT * FROM doctor_attends_patient WHERE doctor_sin = ?`, [doctorSIN]);
    if (dap.length >= 1){
        const deleteAccountInfo = 'DELETE FROM doctor_attends_patient WHERE doctor_sin = ?';
        await pool.query(deleteAccountInfo, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const doctorName = await getNameByID(doctorSIN);
    console.log(doctorName[0].name);

    const [medRec] = await pool.query(`SELECT * FROM medical_record WHERE doctor_name = ?`, [doctorName[0].name]);
    if (medRec.length >= 1){
        const deleteMedRec = 'UPDATE medical_record SET doctor_name = ? WHERE doctor_name = ?';
        await pool.query(deleteMedRec, [null, doctorName[0].name], (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [accountExists] = await pool.query(`SELECT * FROM account_information WHERE sin = ?`, [doctorSIN]);
    if (accountExists.length >= 1){
        const deleteQuery = 'DELETE FROM account_information WHERE sin = ?';
        await pool.query(deleteQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [docExists] = await pool.query(`SELECT * FROM doctor WHERE sin = ?`, [doctorSIN]);
    if (docExists.length >= 1){
        const deleteQueryDoc = 'DELETE FROM doctor WHERE sin = ?';
        await pool.query(deleteQueryDoc, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [personExists] = await pool.query(`SELECT * FROM person WHERE sin = ?`, [doctorSIN]);
    if (personExists.length >= 1){
        const deletePersonQuery = 'DELETE FROM person WHERE sin = ?';
        await pool.query(deletePersonQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    return true;
}


export async function deleteNurse(nurseSIN){
    const value =[nurseSIN];

    const [dap] = await pool.query(`SELECT * FROM nurse_assists_patient WHERE nurse_sin = ?`, [nurseSIN]);
    if (dap.length >= 1){
        const deleteAccountInfo = 'DELETE FROM nurse_assists_patient WHERE nurse_sin = ?';
        await pool.query(deleteAccountInfo, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const nurseName = await getNameByID(nurseSIN);
    console.log(nurseName[0].name);

    const [medRec] = await pool.query(`SELECT * FROM medical_record WHERE nurse_name = ?`, [nurseName[0].name]);
    if (medRec.length >= 1){
        const deleteMedRec = 'UPDATE medical_record SET nurse_name = ? WHERE nurse_name = ?';
        await pool.query(deleteMedRec, [null, nurseName[0].name], (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [accountExists] = await pool.query(`SELECT * FROM account_information WHERE sin = ?`, [nurseSIN]);
    if (accountExists.length >= 1){
        const deleteQuery = 'DELETE FROM account_information WHERE sin = ?';
        await pool.query(deleteQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [docExists] = await pool.query(`SELECT * FROM nurse WHERE sin = ?`, [nurseSIN]);
    if (docExists.length >= 1){
        const deleteQueryDoc = 'DELETE FROM nurse WHERE sin = ?';
        await pool.query(deleteQueryDoc, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    const [personExists] = await pool.query(`SELECT * FROM person WHERE sin = ?`, [nurseSIN]);
    if (personExists.length >= 1){
        const deletePersonQuery = 'DELETE FROM person WHERE sin = ?';
        await pool.query(deletePersonQuery, value, (error, result) => {
            if (error) {
                return (false);
            }
        });
    }

    return true;
}


