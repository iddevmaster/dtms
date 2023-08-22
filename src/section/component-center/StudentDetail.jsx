import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

import ReactToPrint from "react-to-print";
import PrintRegister from "../export-report/PrintRegister";

import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import EmptyImage from "../../asset/images/profile.png";
const BASE_IMAGE = Common.IMAGE_URL;
const GetDataForm = () => {
  const { rm_id } = useParams();

  return <StudentDetail rm_id={rm_id} />;
};
export default GetDataForm;
class StudentDetail extends Component {
  state = {
    rm_id: this.props.rm_id,
    main: {},
    student: {},
    schedule: [],
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `register/result/core/${this.state.rm_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({
            main: res.main,
            student: res.student,
            schedule: res.schedule,
          });

          //   console.log(res.main.join_course_group);
        })
        .catch((err) => {
          // Handle error
          window.location = "/student";
          // console.log(err);
        });
    } catch (error) {
      window.location = "/student";
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { main } = this.state;
    const { student } = this.state;
    const { schedule } = this.state;
    const { rm_id } = this.state;
    // console.log(schedule.length);
    return (
      <div>
        {/* {JSON.stringify(main)} */}
        <Row>
          <Col sm={8}>
            <h3>รายละเอียดนักเรียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/student">
                <Breadcrumb.Item>ทะเบียนนักเรียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>รายละเอียดนักเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div align="center">
          <p>
            <Card.Img
              variant="top"
              src={
                student.student_cover === undefined
                  ? EmptyImage
                  : BASE_IMAGE + student.student_cover
              }
              style={{ width: "200px", height: "200px" }}
            />
          </p>

          <div>
            <ReactToPrint
              trigger={() => (
                <Button variant="primary" size="sm">
                  พิมพ์ใบสมัคร
                </Button>
              )}
              content={() => this.myRef}
              onAfterPrint={() => this.myRef.refreshData(rm_id)}
              onBeforeGetContent={() => this.myRef.refreshData(rm_id)}
            />
            <div style={{ display: "none" }}>
              <PrintRegister ref={(el) => (this.myRef = el)} rm_id={rm_id} />
            </div>
          </div>
        </div>
        <h4>ข้อมูลการสมัคร</h4>

        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>เลขที่ใบสมัคร</th>
              <th>วันที่สมัคร</th>
              <th>หลักสูตร</th>
              <th>ประเภท</th>
              <th>วันที่สอบ</th>
              <th>สถานะการชำระเงิน</th>
              <th>สถานะลงทะเบียน</th>
            </tr>
          </thead>
          <tbody>
            {main.rm_id !== undefined && (
              <tr>
                <td>{main.rm_doc_number}</td>
                <td>{Functions.format_date_time(main.create_date)}</td>
                <td>
                  {main.course_regisetmain_core.course_code}{" "}
                  {main.course_regisetmain_core.course_name}
                </td>
                <td>{Functions.vehicle_type[main.vehicle_type_id - 1]}</td>
                <td>
                  {main.ed_id !== 1 && (
                    <span>
                      {Functions.ymdtodmy(
                        main.examdate_regisetmain_core.ed_date
                      )}{" "}
                      เวลา{" "}
                      {main.examdate_regisetmain_core.ed_start_time.slice(
                        0,
                        -3
                      )}{" "}
                      -{" "}
                      {main.examdate_regisetmain_core.ed_end_time.slice(0, -3)}{" "}
                      รวม {main.examdate_regisetmain_core.ed_hour} ชั่วโมง
                    </span>
                  )}
                </td>
                <td>{Functions.pay_status_format(main.rm_pay_status)}</td>
                <td>{Functions.register_status_format(main.rm_status)}</td>
              </tr>
            )}
          </tbody>
        </Table>

        <h4>ข้อมูลส่วนตัวผู้สมัคร</h4>

        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ชื่อ - นามสกุล</th>
              <th>รหัสบัตรประชาขน</th>
              <th>วันเกิด</th>
              <th>เพศ</th>
              <th>เบอร์โทร</th>
              <th>อีเมล</th>
              <th>ที่อยู่</th>
              <th>สัญชาติ</th>
              <th>ประเทศ</th>
            </tr>
          </thead>
          <tbody>
            {student.student_id !== undefined && (
              <tr>
                <td>
                  {student.student_prefix}
                  {student.student_firstname} {student.student_lastname}
                </td>
                <td>{student.student_id_number}</td>
                <td>{Functions.ymdtodmy(student.student_birthday)}</td>
                <td>{Functions.genderFormat(student.student_gender)}</td>
                <td>{student.student_mobile}</td>
                <td>{student.student_email}</td>
                <td>
                  {student.student_address} <strong>ตำบล / แขวง</strong>{" "}
                  {student.student_core_location.district_name}{" "}
                  <strong>อำเภอ / เขต</strong>{" "}
                  {student.student_core_location.amphur_name}{" "}
                  <strong>จังหวัด</strong>{" "}
                  {student.student_core_location.province_name}{" "}
                  {student.student_core_location.zipcode}
                </td>
                <td>{student.nationality_id[0].country_name_th}</td>
                <td>{student.country_id[0].country_name_th}</td>
              </tr>
            )}
          </tbody>
        </Table>
        <h4>ตารางเรียน</h4>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>รายวิชา</th>
              <th>ประเภทการเรียน</th>
              <th>เริ่มเรียนเวลา</th>
              <th>สิ้นสุดเวลาเรียน</th>
              <th>รวมชั่วโมง</th>
              <th>ครู / วิทยากร</th>
            </tr>
          </thead>
          {schedule.length !== 0 && (
            <tbody>
              {schedule.map((rs, index) => (
                <tr key={index}>
                  <td>
                    {rs.subject_rcs.subject_code} {rs.subject_rcs.subject_name}
                  </td>
                  <td align="center">
                    {Functions.subject_learn_type[rs.subject_learn_type - 1]}
                  </td>
                  <td align="center">
                    {Functions.format_date_time(rs.rs_start_time)}
                  </td>
                  <td align="center">
                    {Functions.format_date_time(rs.rs_end_time)}
                  </td>
                  <td align="center">{rs.rs_hour}</td>
                  <td>
                    {rs.teacher_rcs.teacher_firstname}{" "}
                    {rs.teacher_rcs.teacher_lastname}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    );
  }
}
