-- =============================================================================
-- Dummy data: 1 coordinator, 40 students, 15 companies, applications
-- Run in PostgreSQL:  psql -U your_user -d your_db -f prisma/seed-dummy-data.sql
-- Or run sections in your GUI (e.g. pgAdmin, DBeaver). Best on an EMPTY database.
-- If DB has existing rows, remove "id" from INSERTs and let sequences assign IDs.
--
-- Login:  email from "User" table (e.g. aarav.sharma@student.scis.edu)
--         password: password123
-- Coordinator: coordinator@scis.edu / password123
--
-- Summary: 41 users (1 PLACEMENT_COORDINATOR, 40 STUDENT), 40 StudentProfiles,
--          160 AcademicRecords (4 per student), 15 companies (6 past deadline,
--          9 future), ~150 application rows (students applied to companies).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USERS: 1 PLACEMENT_COORDINATOR (id 1) + 40 STUDENTS (id 2..41)
-- -----------------------------------------------------------------------------
INSERT INTO "User" (id, name, email, password, role, placed, blocked, "createdAt") VALUES
(1, 'Coordinator One', 'coordinator@scis.edu', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'PLACEMENT_COORDINATOR', false, false, NOW()),
(2, 'Aarav Sharma', 'aarav.sharma@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(3, 'Priya Patel', 'priya.patel@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(4, 'Rahul Verma', 'rahul.verma@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(5, 'Ananya Singh', 'ananya.singh@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(6, 'Vikram Reddy', 'vikram.reddy@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(7, 'Sneha Nair', 'sneha.nair@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(8, 'Arjun Mehta', 'arjun.mehta@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(9, 'Kavya Iyer', 'kavya.iyer@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(10, 'Rohan Gupta', 'rohan.gupta@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(11, 'Ishita Desai', 'ishita.desai@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(12, 'Aditya Joshi', 'aditya.joshi@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(13, 'Divya Krishnan', 'divya.krishnan@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(14, 'Karan Malhotra', 'karan.malhotra@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(15, 'Neha Kapoor', 'neha.kapoor@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(16, 'Siddharth Rao', 'siddharth.rao@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(17, 'Pooja Menon', 'pooja.menon@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(18, 'Akash Pillai', 'akash.pillai@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(19, 'Riya Chatterjee', 'riya.chatterjee@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(20, 'Manish Dubey', 'manish.dubey@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(21, 'Shreya Agarwal', 'shreya.agarwal@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(22, 'Varun Bhat', 'varun.bhat@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(23, 'Nidhi Saxena', 'nidhi.saxena@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(24, 'Abhishek Tiwari', 'abhishek.tiwari@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(25, 'Tanvi Rao', 'tanvi.rao@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(26, 'Rishabh Sinha', 'rishabh.sinha@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(27, 'Aisha Khan', 'aisha.khan@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(28, 'Harsh Varma', 'harsh.varma@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(29, 'Meera Nambiar', 'meera.nambiar@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(30, 'Yash Trivedi', 'yash.trivedi@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(31, 'Lakshmi Subramanian', 'lakshmi.subramanian@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(32, 'Rajat Oberoi', 'rajat.oberoi@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(33, 'Anjali Venkatesh', 'anjali.venkatesh@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(34, 'Nikhil Chandran', 'nikhil.chandran@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(35, 'Preeti Bansal', 'preeti.bansal@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(36, 'Vivek Dutta', 'vivek.dutta@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(37, 'Sonali Mishra', 'sonali.mishra@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(38, 'Gaurav Sethi', 'gaurav.sethi@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(39, 'Kritika Bhardwaj', 'kritika.bhardwaj@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(40, 'Arun Prabhu', 'arun.prabhu@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW()),
(41, 'Deepika Murthy', 'deepika.murthy@uohyd.ac.in', '$2b$10$JSrxUI2RSwcrmTe4SQyaS.q8j5vanVdfBbyJqNqyvf4yHXUYhvxBa', 'STUDENT', false, false, NOW());

-- Reset sequence so next insert gets 42
SELECT setval(pg_get_serial_sequence('"User"', 'id'), 41);

-- -----------------------------------------------------------------------------
-- 2. STUDENT PROFILES (one per student, userId 2..41). Profile id 1..40
-- -----------------------------------------------------------------------------
INSERT INTO "StudentProfile" (id, "userId", gender, department, stream, "rollNo", phone, "batchYear", "permanentAddress", "currentAddress", "createdAt") VALUES
(1, 2, 'MALE', 'MCA', 'CSE', 'SCIS2024MCA001', '9876543210', 2024, 'Mumbai', 'Hostel A', NOW()),
(2, 3, 'FEMALE', 'MCA', 'AI', 'SCIS2024MCA002', '9876543211', 2024, 'Delhi', 'Hostel B', NOW()),
(3, 4, 'MALE', 'MTECH', 'CSE', 'SCIS2024MTECH001', '9876543212', 2024, 'Bangalore', 'Hostel A', NOW()),
(4, 5, 'FEMALE', 'MCA', 'IT', 'SCIS2024MCA003', '9876543213', 2024, 'Chennai', 'Hostel B', NOW()),
(5, 6, 'MALE', 'MTECH', 'AI', 'SCIS2024MTECH002', '9876543214', 2024, 'Hyderabad', 'Hostel A', NOW()),
(6, 7, 'FEMALE', 'MCA', 'CSE', 'SCIS2024MCA004', '9876543215', 2024, 'Pune', 'Hostel B', NOW()),
(7, 8, 'MALE', 'IMTECH', 'CSE', 'SCIS2024IMTECH001', '9876543216', 2024, 'Kolkata', 'Hostel A', NOW()),
(8, 9, 'FEMALE', 'MCA', 'AI', 'SCIS2024MCA005', '9876543217', 2024, 'Ahmedabad', 'Hostel B', NOW()),
(9, 10, 'MALE', 'MTECH', 'IT', 'SCIS2024MTECH003', '9876543218', 2024, 'Jaipur', 'Hostel A', NOW()),
(10, 11, 'FEMALE', 'MCA', 'CSE', 'SCIS2024MCA006', '9876543219', 2024, 'Lucknow', 'Hostel B', NOW()),
(11, 12, 'MALE', 'MCA', 'AI', 'SCIS2025MCA001', '9876543220', 2025, 'Mumbai', 'Hostel A', NOW()),
(12, 13, 'FEMALE', 'MTECH', 'CSE', 'SCIS2025MTECH001', '9876543221', 2025, 'Delhi', 'Hostel B', NOW()),
(13, 14, 'MALE', 'MCA', 'IT', 'SCIS2025MCA002', '9876543222', 2025, 'Bangalore', 'Hostel A', NOW()),
(14, 15, 'FEMALE', 'MTECH', 'AI', 'SCIS2025MTECH002', '9876543223', 2025, 'Chennai', 'Hostel B', NOW()),
(15, 16, 'MALE', 'IMTECH', 'CSE', 'SCIS2025IMTECH001', '9876543224', 2025, 'Hyderabad', 'Hostel A', NOW()),
(16, 17, 'FEMALE', 'MCA', 'CSE', 'SCIS2025MCA003', '9876543225', 2025, 'Pune', 'Hostel B', NOW()),
(17, 18, 'MALE', 'MCA', 'AI', 'SCIS2025MCA004', '9876543226', 2025, 'Kolkata', 'Hostel A', NOW()),
(18, 19, 'FEMALE', 'MTECH', 'IT', 'SCIS2025MTECH003', '9876543227', 2025, 'Ahmedabad', 'Hostel B', NOW()),
(19, 20, 'MALE', 'MCA', 'CSE', 'SCIS2025MCA005', '9876543228', 2025, 'Jaipur', 'Hostel A', NOW()),
(20, 21, 'FEMALE', 'MTECH', 'AI', 'SCIS2025MTECH004', '9876543229', 2025, 'Lucknow', 'Hostel B', NOW()),
(21, 22, 'MALE', 'MCA', 'CSE', 'SCIS2024MCA007', '9876543230', 2024, 'Mumbai', 'Hostel A', NOW()),
(22, 23, 'FEMALE', 'MTECH', 'CSE', 'SCIS2024MTECH004', '9876543231', 2024, 'Delhi', 'Hostel B', NOW()),
(23, 24, 'MALE', 'MCA', 'AI', 'SCIS2024MCA008', '9876543232', 2024, 'Bangalore', 'Hostel A', NOW()),
(24, 25, 'FEMALE', 'IMTECH', 'IT', 'SCIS2024IMTECH002', '9876543233', 2024, 'Chennai', 'Hostel B', NOW()),
(25, 26, 'MALE', 'MCA', 'IT', 'SCIS2024MCA009', '9876543234', 2024, 'Hyderabad', 'Hostel A', NOW()),
(26, 27, 'FEMALE', 'MTECH', 'AI', 'SCIS2024MTECH005', '9876543235', 2024, 'Pune', 'Hostel B', NOW()),
(27, 28, 'MALE', 'MCA', 'CSE', 'SCIS2024MCA010', '9876543236', 2024, 'Kolkata', 'Hostel A', NOW()),
(28, 29, 'FEMALE', 'MCA', 'AI', 'SCIS2025MCA006', '9876543237', 2025, 'Ahmedabad', 'Hostel B', NOW()),
(29, 30, 'MALE', 'MTECH', 'CSE', 'SCIS2025MTECH005', '9876543238', 2025, 'Jaipur', 'Hostel A', NOW()),
(30, 31, 'FEMALE', 'MCA', 'IT', 'SCIS2025MCA007', '9876543239', 2025, 'Lucknow', 'Hostel B', NOW()),
(31, 32, 'MALE', 'MTECH', 'AI', 'SCIS2025MTECH006', '9876543240', 2025, 'Mumbai', 'Hostel A', NOW()),
(32, 33, 'FEMALE', 'IMTECH', 'CSE', 'SCIS2025IMTECH002', '9876543241', 2025, 'Delhi', 'Hostel B', NOW()),
(33, 34, 'MALE', 'MCA', 'CSE', 'SCIS2025MCA008', '9876543242', 2025, 'Bangalore', 'Hostel A', NOW()),
(34, 35, 'FEMALE', 'MTECH', 'IT', 'SCIS2025MTECH007', '9876543243', 2025, 'Chennai', 'Hostel B', NOW()),
(35, 36, 'MALE', 'MCA', 'AI', 'SCIS2025MCA009', '9876543244', 2025, 'Hyderabad', 'Hostel A', NOW()),
(36, 37, 'FEMALE', 'MCA', 'CSE', 'SCIS2025MCA010', '9876543245', 2025, 'Pune', 'Hostel B', NOW()),
(37, 38, 'MALE', 'MTECH', 'CSE', 'SCIS2024MTECH006', '9876543246', 2024, 'Kolkata', 'Hostel A', NOW()),
(38, 39, 'FEMALE', 'MCA', 'AI', 'SCIS2024MCA011', '9876543247', 2024, 'Ahmedabad', 'Hostel B', NOW()),
(39, 40, 'MALE', 'IMTECH', 'AI', 'SCIS2024IMTECH003', '9876543248', 2024, 'Jaipur', 'Hostel A', NOW()),
(40, 41, 'FEMALE', 'MTECH', 'IT', 'SCIS2024MTECH007', '9876543249', 2024, 'Lucknow', 'Hostel B', NOW());

SELECT setval(pg_get_serial_sequence('"StudentProfile"', 'id'), 40);

-- -----------------------------------------------------------------------------
-- 3. ACADEMIC RECORDS (TENTH, TWELFTH, GRADUATION, POSTGRADUATION per student)
--    4 records per profile = 160 rows
-- -----------------------------------------------------------------------------
INSERT INTO "AcademicRecord" ("studentProfileId", level, institution_school_name, board, university, "yearOfPassing", percentage_cgpa)
SELECT id, 'TENTH'::"AcadLevel", 'St. Mary School', 'CBSE', NULL, 2018, 92.0 + (id % 5) FROM "StudentProfile" WHERE id <= 40;
INSERT INTO "AcademicRecord" ("studentProfileId", level, institution_school_name, board, university, "yearOfPassing", percentage_cgpa)
SELECT id, 'TWELFTH'::"AcadLevel", 'Delhi Public School', 'CBSE', NULL, 2020, 85.0 + (id % 6) FROM "StudentProfile" WHERE id <= 40;
INSERT INTO "AcademicRecord" ("studentProfileId", level, institution_school_name, board, university, "yearOfPassing", percentage_cgpa)
SELECT id, 'GRADUATION'::"AcadLevel", 'State College', NULL, 'State University', 2022, 7.5 + (id % 10) * 0.2 FROM "StudentProfile" WHERE id <= 40;
INSERT INTO "AcademicRecord" ("studentProfileId", level, institution_school_name, board, university, "yearOfPassing", percentage_cgpa)
SELECT id, 'POSTGRADUATION'::"AcadLevel", 'School of Computer and Information Sciences', NULL, 'University of Hyderabad', 2024, 8.0 + (id % 8) * 0.15 FROM "StudentProfile" WHERE id <= 40;

-- -----------------------------------------------------------------------------
-- 4. COMPANIES (15 total). createdById = 1. First 6 deadlines in PAST, rest FUTURE
-- -----------------------------------------------------------------------------
INSERT INTO "Company" (name, description, package, department, "streamsAllowed", "jobTitle", address, state, country, website, "type_of_organization", "skillsRequired", "jobLocation", remarks, "no_vacancies", "nature_of_business", deadline, "createdById", "createdAt", "updatedAt") VALUES
('TechMahindra Ltd', 'IT services and consulting', 8.5, 'MCA', ARRAY['CSE','AI','IT']::"Stream"[], 'Software Engineer', 'Hyderabad', 'Telangana', 'India', 'https://techmahindra.com', 'Private', ARRAY['Java','SQL','Spring'], 'Hyderabad', NULL, 10, 'IT Services', '2025-01-15 23:59:59', 1, NOW(), NOW()),
('Infosys', 'Global IT consulting', 7.0, 'MCA', ARRAY['CSE','IT']::"Stream"[], 'System Engineer', 'Bangalore', 'Karnataka', 'India', 'https://infosys.com', 'Private', ARRAY['Java','Python','DBMS'], 'Bangalore', NULL, 15, 'IT', '2025-02-01 23:59:59', 1, NOW(), NOW()),
('Wipro', 'IT and consulting', 6.5, 'MTECH', ARRAY['CSE','AI']::"Stream"[], 'Project Engineer', 'Chennai', 'Tamil Nadu', 'India', 'https://wipro.com', 'Private', ARRAY['C++','Data Structures'], 'Chennai', NULL, 12, 'IT', '2025-02-10 23:59:59', 1, NOW(), NOW()),
('TCS', 'Tata Consultancy Services', 7.5, 'MCA', ARRAY['CSE','AI','IT']::"Stream"[], 'Assistant System Engineer', 'Mumbai', 'Maharashtra', 'India', 'https://tcs.com', 'Private', ARRAY['Java','SQL','Algorithms'], 'Mumbai', NULL, 20, 'IT', '2025-03-01 23:59:59', 1, NOW(), NOW()),
('HCL Technologies', 'IT and R&D', 8.0, 'MTECH', ARRAY['CSE','IT']::"Stream"[], 'Software Developer', 'Noida', 'UP', 'India', 'https://hcltech.com', 'Private', ARRAY['Java','Python','Cloud'], 'Noida', NULL, 8, 'IT', '2025-03-15 23:59:59', 1, NOW(), NOW()),
('Capgemini', 'Consulting and technology', 7.2, 'MCA', ARRAY['CSE','AI']::"Stream"[], 'Consultant', 'Pune', 'Maharashtra', 'India', 'https://capgemini.com', 'Private', ARRAY['Java','Angular','SQL'], 'Pune', NULL, 10, 'Consulting', '2025-03-10 23:59:59', 1, NOW(), NOW()),
('Accenture', 'Global professional services', 9.0, 'MCA', ARRAY['CSE','AI','IT']::"Stream"[], 'Associate Software Engineer', 'Bangalore', 'Karnataka', 'India', 'https://accenture.com', 'Private', ARRAY['Java','Cloud','Agile'], 'Bangalore', NULL, 25, 'Consulting', '2026-04-15 23:59:59', 1, NOW(), NOW()),
('Cognizant', 'Digital solutions', 8.2, 'MTECH', ARRAY['CSE','IT']::"Stream"[], 'Programmer Analyst', 'Chennai', 'Tamil Nadu', 'India', 'https://cognizant.com', 'Private', ARRAY['Java','Python','React'], 'Chennai', NULL, 18, 'IT', '2026-05-01 23:59:59', 1, NOW(), NOW()),
('Microsoft India', 'Product and cloud', 18.0, 'MTECH', ARRAY['CSE','AI']::"Stream"[], 'SDE 1', 'Hyderabad', 'Telangana', 'India', 'https://microsoft.com', 'Private', ARRAY['Algorithms','System Design','C++'], 'Hyderabad', NULL, 5, 'Product', '2026-05-15 23:59:59', 1, NOW(), NOW()),
('Amazon India', 'E-commerce and cloud', 16.0, 'MCA', ARRAY['CSE','AI','IT']::"Stream"[], 'SDE Intern', 'Bangalore', 'Karnataka', 'India', 'https://amazon.com', 'Private', ARRAY['DSA','Java','OS'], 'Bangalore', NULL, 12, 'E-commerce', '2026-06-01 23:59:59', 1, NOW(), NOW()),
('Google India', 'Tech and products', 22.0, 'MTECH', ARRAY['CSE','AI']::"Stream"[], 'Software Engineer', 'Hyderabad', 'Telangana', 'India', 'https://google.com', 'Private', ARRAY['Algorithms','C++','Python'], 'Hyderabad', NULL, 6, 'Product', '2026-06-15 23:59:59', 1, NOW(), NOW()),
('Zoho Corporation', 'Product company', 10.0, 'MCA', ARRAY['CSE','IT']::"Stream"[], 'Developer', 'Chennai', 'Tamil Nadu', 'India', 'https://zoho.com', 'Private', ARRAY['Java','JavaScript','SQL'], 'Chennai', NULL, 15, 'Product', '2026-07-01 23:59:59', 1, NOW(), NOW()),
('Oracle India', 'Enterprise software', 12.0, 'MTECH', ARRAY['CSE','AI','IT']::"Stream"[], 'Applications Developer', 'Bangalore', 'Karnataka', 'India', 'https://oracle.com', 'Private', ARRAY['Java','SQL','Cloud'], 'Bangalore', NULL, 8, 'Software', '2026-07-15 23:59:59', 1, NOW(), NOW()),
('Flipkart', 'E-commerce', 14.0, 'MCA', ARRAY['CSE','AI']::"Stream"[], 'Software Development Engineer', 'Bangalore', 'Karnataka', 'India', 'https://flipkart.com', 'Private', ARRAY['DSA','Java','System Design'], 'Bangalore', NULL, 10, 'E-commerce', '2026-08-01 23:59:59', 1, NOW(), NOW()),
('Paytm', 'Fintech', 11.0, 'IMTECH', ARRAY['CSE','IT']::"Stream"[], 'Backend Engineer', 'Noida', 'UP', 'India', 'https://paytm.com', 'Private', ARRAY['Java','Microservices','Kafka'], 'Noida', NULL, 7, 'Fintech', '2026-08-15 23:59:59', 1, NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 5. APPLICATIONS (students applied to companies). Unique (studentId, companyId).
--    Companies 1-6 = past deadline (many applicants). 7-15 = future (some applicants).
-- -----------------------------------------------------------------------------
-- TechMahindra (1) - past: students 2-15
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 2, 1), ('SHORTLISTED', 3, 1), ('APPLIED', 4, 1), ('APPLIED', 5, 1), ('REJECTED', 6, 1), ('APPLIED', 7, 1), ('APPLIED', 8, 1), ('SHORTLISTED', 9, 1), ('APPLIED', 10, 1), ('APPLIED', 11, 1), ('APPLIED', 12, 1), ('APPLIED', 13, 1), ('APPLIED', 14, 1), ('APPLIED', 15, 1);
-- Infosys (2) - past: students 2-20
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 2, 2), ('APPLIED', 3, 2), ('SHORTLISTED', 4, 2), ('APPLIED', 5, 2), ('APPLIED', 6, 2), ('APPLIED', 7, 2), ('APPLIED', 8, 2), ('APPLIED', 9, 2), ('APPLIED', 10, 2), ('APPLIED', 11, 2), ('REJECTED', 12, 2), ('APPLIED', 13, 2), ('APPLIED', 14, 2), ('APPLIED', 15, 2), ('APPLIED', 16, 2), ('APPLIED', 17, 2), ('APPLIED', 18, 2), ('APPLIED', 19, 2), ('APPLIED', 20, 2);
-- Wipro (3) - past
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 3, 3), ('APPLIED', 4, 3), ('APPLIED', 5, 3), ('APPLIED', 6, 3), ('SHORTLISTED', 7, 3), ('APPLIED', 8, 3), ('APPLIED', 9, 3), ('APPLIED', 10, 3), ('APPLIED', 11, 3), ('APPLIED', 12, 3), ('APPLIED', 13, 3), ('APPLIED', 14, 3), ('APPLIED', 15, 3), ('APPLIED', 16, 3);
-- TCS (4) - past
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 2, 4), ('APPLIED', 4, 4), ('APPLIED', 6, 4), ('APPLIED', 8, 4), ('APPLIED', 10, 4), ('SHORTLISTED', 12, 4), ('APPLIED', 14, 4), ('APPLIED', 16, 4), ('APPLIED', 18, 4), ('APPLIED', 20, 4), ('APPLIED', 22, 4), ('APPLIED', 24, 4), ('APPLIED', 26, 4), ('APPLIED', 28, 4), ('APPLIED', 30, 4);
-- HCL (5) - past
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 5, 5), ('APPLIED', 7, 5), ('APPLIED', 9, 5), ('APPLIED', 11, 5), ('APPLIED', 13, 5), ('APPLIED', 15, 5), ('APPLIED', 17, 5), ('APPLIED', 19, 5), ('APPLIED', 21, 5), ('REJECTED', 23, 5), ('APPLIED', 25, 5), ('APPLIED', 27, 5);
-- Capgemini (6) - past (deadline Apr 1 2025)
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 2, 6), ('APPLIED', 6, 6), ('APPLIED', 10, 6), ('APPLIED', 14, 6), ('APPLIED', 18, 6), ('APPLIED', 22, 6), ('APPLIED', 26, 6), ('APPLIED', 30, 6), ('APPLIED', 34, 6), ('APPLIED', 38, 6);
-- Accenture (7) - future
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 2, 7), ('APPLIED', 3, 7), ('APPLIED', 5, 7), ('APPLIED', 8, 7), ('APPLIED', 11, 7), ('APPLIED', 14, 7), ('APPLIED', 17, 7), ('APPLIED', 20, 7);
-- Cognizant (8) - future
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 4, 8), ('APPLIED', 7, 8), ('APPLIED', 9, 8), ('APPLIED', 12, 8), ('APPLIED', 15, 8), ('APPLIED', 18, 8), ('APPLIED', 21, 8);
-- Microsoft (9) - future
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 3, 9), ('APPLIED', 6, 9), ('APPLIED', 12, 9), ('APPLIED', 16, 9), ('APPLIED', 24, 9);
-- Amazon (10) - future
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 2, 10), ('APPLIED', 5, 10), ('APPLIED', 10, 10), ('APPLIED', 15, 10), ('APPLIED', 20, 10), ('APPLIED', 25, 10), ('APPLIED', 30, 10);
-- Google (11), Zoho (12), Oracle (13), Flipkart (14), Paytm (15) - future, few each
INSERT INTO "Application" (status, "studentId", "companyId") VALUES
('APPLIED', 8, 11), ('APPLIED', 14, 11), ('APPLIED', 22, 11), ('APPLIED', 11, 12), ('APPLIED', 13, 12), ('APPLIED', 17, 12), ('APPLIED', 19, 12), ('APPLIED', 23, 12),
('APPLIED', 9, 13), ('APPLIED', 16, 13), ('APPLIED', 26, 13), ('APPLIED', 4, 14), ('APPLIED', 18, 14), ('APPLIED', 28, 14), ('APPLIED', 7, 15), ('APPLIED', 21, 15), ('APPLIED', 31, 15);

-- Optional: add dummy resume URLs for export sheet
UPDATE "StudentProfile" SET "resumeUrl" = '/uploads/resumes/' || "rollNo" || '.pdf' WHERE id <= 40;
