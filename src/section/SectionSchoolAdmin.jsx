import React, { Component } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import ErrorPage from "./ErrorPage";
import LogoutUser from "../landing-page/LogoutUser";
import Register from "./component-schooladmin/Register";
import Teacher from "./component-schooladmin/Teacher";
import TeacherForm from "./component-schooladmin/TeacherForm";
import Branch from "./component-schooladmin/Branch";
import Subject from "./component-center/Subject";
import Course from "./component-schooladmin/Course";
import CourseSubject from "./component-center/CourseSubject";
import CourseSeminar from "./component-schooladmin/CourseSeminar";
import ExamDate from "./component-schooladmin/ExamDate";
import PaymentRegister from "./component-schooladmin/PaymentRegister";
import PaymentRegisterForm from "./component-center/PaymentRegisterForm";
import BillList from "./component-center/BillList";

import StudentCalendarAddSubject from "./component-center/StudentCalendarAddSubject";
import Student from "./component-schooladmin/Student";
import StudentDetail from "./component-center/StudentDetail";
import StudentUpdate from "./component-center/StudentUpdate";
import StudentSeminarUpdate from "./component-center/StudentSeminarUpdate";
import StudentExamDateUpdate from "./component-center/StudentExamDateUpdate";
import IdCardManual from "./component-center/IdCardManual";

import ReportPaypartial from "./component-schooladmin/ReportPaypartial";
import ReportStudentLearnSuccess from "./component-schooladmin/ReportStudentLearnSuccess";
import User from "./component-schooladmin/User";
import Common from "../common";
const app_name = Common.app_name;
const fullname = Common.getUserLoginData.full_name;
const school_name = Common.getUserLoginData.school_name;
export default class SectionSchoolAdmin extends Component {
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/">
              {app_name} : {school_name}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">สมัครเรียน</Nav.Link>

                <NavDropdown title="นักเรียน" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/student">
                    ทะเบียนนักเรียน
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="หลักสูตร" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/subject">รายวิชา</NavDropdown.Item>
                  <NavDropdown.Item href="/course">หลักสูตร</NavDropdown.Item>

                  <NavDropdown.Item href="/examdate">
                    วันสอบใบอนุญาต
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="ครู" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/teacher">
                    ทะเบียนครู
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#">วันหยุดครู</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="การเงิน" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/register">
                    ชำระเงินค่าสมัครเรียน
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/register">
                    บันทึกการจ่ายครูฝึก
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="รายงาน" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#" disabled>
                    รายงานการปิดยอด
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/report/pay/partial">
                    รายงานยอดค้างชำระ
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`/report/learn/success/${true}`}>
                    รายงานนักเรียนจบหลักสูตร
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`/report/learn/success/${false}`}>
                    รายงานนักเรียนไม่จบหลักสูตร
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="ข้อมูลทั่วไป" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#">โรงเรียน</NavDropdown.Item>
                  <NavDropdown.Item href="/branch">สาขา</NavDropdown.Item>
                  <NavDropdown.Item href="/user">ผู้ใช้งาน</NavDropdown.Item>
                  <NavDropdown.Item href="/idcardmanual">
                    ติดตั้งเครื่องอ่านบัตร
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>

              <Nav>
                <NavDropdown title={fullname} id="collasible-nav-dropdown">
                  <NavDropdown.Item href="" disabled>
                    บัญชีผู้ใช้งาน
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/logout">ออกจากระบบ</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* Content */}
        <Container fluid>
          <p></p>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/student" element={<Student />} />
              <Route path="/student/:rm_id" element={<StudentDetail />} />
              <Route
                path="/student/schedule/:rm_id"
                element={<StudentCalendarAddSubject />}
              />
              <Route
                path="/student/update/:rm_id"
                element={<StudentUpdate />}
              />
              <Route
                path="/student/seminar/:rm_id"
                element={<StudentSeminarUpdate />}
              />
              <Route
                path="/student/exam/:rm_id"
                element={<StudentExamDateUpdate />}
              />

              <Route path="/subject" element={<Subject />} />
              <Route path="/course" element={<Course />} comp />

              <Route
                path="/course/subject/:course_id"
                element={<CourseSubject />}
              />
              <Route
                path="/course/seminar/:course_id"
                element={<CourseSeminar />}
              />

              <Route path="/examdate" element={<ExamDate />} />
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/teacher/:teacher_id" element={<TeacherForm />} />

              <Route path="/register" element={<PaymentRegister />} />
              <Route
                path="/register/payment/:rm_id"
                element={<PaymentRegisterForm />}
              />
              <Route
                path="/register/payment/bill/:rm_id"
                element={<BillList />}
              />

              <Route
                path="/report/pay/partial"
                element={<ReportPaypartial />}
              />

              <Route
                path="/report/learn/success/:rm_success"
                element={<ReportStudentLearnSuccess />}
              />
              <Route path="/branch" element={<Branch />} />
              <Route path="/user" element={<User />} />
              <Route path="/idcardmanual" element={<IdCardManual />} />
              <Route path="/logout" element={<LogoutUser />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </div>
    );
  }
}
