CREATE TABLE PERSON (
    sin int NOT NULL PRIMARY KEY,
    name varchar(32) NOT NULL,
    date_of_birth date NOT NULL,
    house_number int NULL,
    street_name varchar(32) NOT NULL,
    postal_code varchar(7) NOT NULL,
    city varchar(32) NOT NULL,
    province varchar(20) NOT NULL,
    country varchar(20) NOT NULL,
    phone_number varchar(13) NOT NULL
);

CREATE TABLE HOSPITAL (
    hospital_id int NOT NULL PRIMARY KEY,
    hospital_name varchar(255) NOT NULL,
    house_number int NOT NULL,
    street_name varchar(32) NOT NULL,
    postal_code varchar(7) NOT NULL,
    city varchar(32) NOT NULL,
    province varchar(20) NOT NULL,
    country varchar(20) NOT NULL
);

CREATE TABLE DEPARTMENT (
    department_num INT(9) NOT NULL PRIMARY KEY,
  	number_of_rooms int(9) NOT NULL,
	name VARCHAR(32) NOT NULL,
	hospital_id int NULL,
	CONSTRAINT hospital_fk FOREIGN KEY (hospital_id) REFERENCES HOSPITAL(hospital_id)
		ON DELETE SET NULL
);

-- size changed to size_ft b/c size is a keyword
CREATE TABLE ROOM (
	hospital_id int NOT NULL,
	room_number int NOT NULL,
	room_type VARCHAR(32) NOT NULL,
	size_sqft int NOT NULL,
	occupied int,
	dept_no int NULL,
	CONSTRAINT room_pk PRIMARY KEY (hospital_id, room_number),
	CONSTRAINT dept_fk FOREIGN KEY (dept_no) REFERENCES DEPARTMENT(department_num)
    	ON DELETE CASCADE
);

CREATE TABLE SUPPLIES (
    item_id int NOT NULL PRIMARY KEY,
    name varchar(32) NOT NULL,
    price decimal(9,2) NOT NULL,
    category varchar(32) NOT NULL,
    quantity int(9) NOT NULL,
    hospital_id int NULL,
    room_number int(9) NULL,
    CONSTRAINT supplies_fk_room FOREIGN KEY (hospital_id, room_number) REFERENCES ROOM(hospital_id, room_number)
    	ON DELETE SET NULL
);

CREATE TABLE ACCOUNT_INFORMATION (
    sin int NOT NULL PRIMARY KEY REFERENCES PERSON(sin)
    	ON DELETE CASCADE,
    email varchar(32) NULL,
    username varchar(32) NOT NULL,
    password varchar(32) NOT NULL
);

CREATE TABLE DOCTOR (
    sin int NOT NULL PRIMARY KEY REFERENCES PERSON(sin)
    	ON DELETE CASCADE,
    qualification VARCHAR(32) NOT NULL,
    specialization VARCHAR(32) NOT NULL,
    dept_no int NULL,
    hospital_id int NOT NULL,
    CONSTRAINT doctor_fk_dept FOREIGN KEY (dept_no) REFERENCES DEPARTMENT(department_num)
    	ON DELETE SET NULL
);

-- Weight is changed to weight_kg to demonstrate unit, likewise with height
CREATE TABLE PATIENT (
	sin int(9) PRIMARY KEY REFERENCES PERSON(sin)
		ON DELETE CASCADE,
	weight_kg decimal(9,2) NULL,
	height_ft varchar(5) NULL,
	sex varchar(10) NOT NULL,
	hospital_id int(9) NULL,
	room_no int(9) NULL,
	CONSTRAINT patient_fk_room FOREIGN KEY (hospital_id, room_no) REFERENCES ROOM(hospital_id, room_number)
		ON DELETE SET NULL
);

CREATE TABLE DOCTOR_ATTENDS_PATIENT (
    doctor_sin int NULL,
    patient_sin int NULL,
    CONSTRAINT doctor_sin_fk FOREIGN KEY (doctor_sin) REFERENCES DOCTOR(sin)
    	ON DELETE CASCADE,
    CONSTRAINT patient_sin_fk FOREIGN KEY (patient_sin) REFERENCES PATIENT(sin)
    	ON DELETE CASCADE
);

CREATE TABLE MEDICAL_RECORD (
    patient_sin int PRIMARY KEY REFERENCES PATIENT(sin)
    	ON DELETE CASCADE,
    doctor_name varchar(32) NULL,
    nurse_name varchar(32) NULL,
    guardian_name varchar(32) NULL
);

CREATE TABLE HEALTH_ISSUES (
    patient_sin int NOT NULL REFERENCES MEDICAL_RECORD(patient_sin)
    	ON DELETE CASCADE,
    health_issue varchar(32) NOT NULL,
    CONSTRAINT health_issues_pk PRIMARY KEY (patient_sin, health_issue)
);

-- Length was changed to integers to symbolize number of weeks to take the treatment
-- Dose was changed to dose mg for miligrams per dose
CREATE TABLE PRESCRIPTIONS (
    patient_sin int NOT NULL REFERENCES MEDICAL_RECORD(patient_sin)
    	ON DELETE CASCADE,
    prescription varchar(32) NOT NULL,
    length_weeks int NOT NULL,
    dose_mg decimal(9,3) NOT NULL,
    CONSTRAINT prescriptions_pk PRIMARY KEY (patient_sin, prescription)
);

CREATE TABLE APPOINTMENTS (
    patient_sin int NOT NULL REFERENCES MEDICAL_RECORD(patient_sin)
    	ON DELETE CASCADE,
    appointment timestamp NOT NULL,
    CONSTRAINT appointments_pk PRIMARY KEY (patient_sin, appointment)
);

CREATE TABLE GUARDIAN_VISITOR (
    visitor_id int PRIMARY KEY,
    contact_number varchar(13) NOT NULL,
    relationship varchar(20) NOT NULL,
    name varchar(32) NOT NULL,
    house_number int NULL,
    street_name varchar(32) NULL,
    postal_code varchar(7) NULL,
    city varchar(32) NULL,
    province varchar(20) NULL,
    country varchar(20) NULL,
    visitee_sin int NOT NULL,
    CONSTRAINT visits_patient_fk FOREIGN KEY (visitee_sin) REFERENCES PATIENT(sin)
    	ON DELETE CASCADE
);

CREATE TABLE NURSE (
    sin int NOT NULL PRIMARY KEY REFERENCES PERSON(sin)
    	ON DELETE CASCADE,
    type varchar(255) NOT NULL,
    position_type varchar(20) NULL,
    hospital_id int
);

CREATE TABLE NURSE_ASSISTS_PATIENT (
    nurse_sin int NOT NULL,
    patient_sin int NOT NULL,
    CONSTRAINT nurse_assits_fk FOREIGN KEY (nurse_sin) REFERENCES NURSE(sin)
    	ON DELETE CASCADE,
    CONSTRAINT patient_assited_fk FOREIGN KEY (patient_sin) REFERENCES PATIENT(sin)
    	ON DELETE CASCADE
);

CREATE TABLE ADMIN (
    sin int NOT NULL PRIMARY KEY REFERENCES PERSON(sin)
    	ON DELETE CASCADE,
    department varchar(32) NULL,
    position varchar(32) NULL,
    hospital_id int NULL,
	CONSTRAINT admin_hospital_fk FOREIGN KEY (hospital_id) REFERENCES HOSPITAL(hospital_id)
);

CREATE TABLE ADMIN_ORDERS_SUPPLIES (
    admin_sin int NOT NULL,
    item_id int NOT NULL,
    CONSTRAINT admin_fk FOREIGN KEY (admin_sin) REFERENCES ADMIN(sin)
    	ON DELETE CASCADE,
    CONSTRAINT item_fk FOREIGN KEY (item_id) REFERENCES SUPPLIES(item_id)
    	ON DELETE CASCADE
);

-- Expanded the warranty attribute to be slightly more descriptive 
-- and easier to understand into 3,
-- name, start date, and length in months
CREATE TABLE EQUIPMENT (
    item_id int NOT NULL PRIMARY KEY REFERENCES SUPPLIES(item_id)
    	ON DELETE CASCADE,
    equipment_number int NOT NULL,
    manufacturer varchar(32) NOT NULL,
    warranty_name varchar(255) NULL,
    warranty_start date NULL,
    warranty_length_months int NULL
);

CREATE TABLE MEDICATION (
    item_id int NOT NULL PRIMARY KEY REFERENCES SUPPLIES(item_id)
    	ON DELETE CASCADE,
    din_number int NOT NULL,
    expiry_date date NULL
);

CREATE TABLE PATIENT_ORDERS_MEDICATION (
  	patient_sin int NOT NULL,
    item_id int NOT NULL,
    CONSTRAINT patient_fk FOREIGN KEY (patient_sin) REFERENCES PATIENT(sin)
    	ON DELETE CASCADE,
    CONSTRAINT item_ordered_fk FOREIGN KEY (item_id) REFERENCES MEDICATION(item_id)
        ON DELETE CASCADE
);