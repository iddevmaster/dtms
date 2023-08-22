import React, { Component } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import SchoolList from "./component-superadmin/SchoolList";
import SchoolAddForm from "./component-superadmin/SchoolAddForm";
import SchoolUpdateForm from "./component-superadmin/SchoolUpdateForm";
import SchoolUserAdmin from "./component-superadmin/SchoolUserAdmin";
import Subject from "./component-center/Subject";
import Course from "./component-superadmin/Course";
import CourseSubject from "./component-center/CourseSubject";
import ErrorPage from "./ErrorPage";
import Logout from "../landing-page/Logout";
export default class SectionSuperAdmin extends Component {
  render() {
    const { app_name } = this.props;
    const { fullname } = this.props;

    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/">{app_name}</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <NavDropdown
                  title="ข้อมูลโรงเรียน"
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/school">โรงเรียน</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="ผู้ดูแลระบบโรงเรียน"
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/school/useradmin">
                    ผู้ดูแลระบบโรงเรียน
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="หลักสูตร" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/subject">รายวิชา</NavDropdown.Item>
                  <NavDropdown.Item href="/course">หลักสูตร</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown
                  title="ข้อมูลตั้งต้น"
                  id="collasible-nav-dropdown"
                  disabled
                >
                  {/* <NavDropdown.Item href="#action/3.1">
                    คำนำหน้า
                  </NavDropdown.Item> */}
                </NavDropdown>
              </Nav>

              <Nav>
                <NavDropdown title={fullname} id="collasible-nav-dropdown">
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
              <Route path="/" element={<SchoolList />} />
              <Route path="/school" element={<SchoolList />} />
              <Route path="/school/addform" element={<SchoolAddForm />} />
              <Route
                path="/school/updateform/:school_id"
                element={<SchoolUpdateForm />}
              />
              <Route path="/school/useradmin" element={<SchoolUserAdmin />} />
              <Route path="/subject" element={<Subject />} />
              <Route path="/course" element={<Course />} />
              <Route
                path="/course/subject/:course_id"
                element={<CourseSubject />}
              />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </div>
    );
  }
}
