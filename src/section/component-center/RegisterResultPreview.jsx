import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import EmptyImage from "../../asset/images/profile.png";
const setMainRegister = Functions.getRegisterIndex(); ///ข้อมูลชั่วคราวที่ใช้ในการสมัคร
const rm_id = setMainRegister.rm_id;
const BASE_IMAGE = Common.IMAGE_URL;

export default class RegisterResultPreview extends Component {
  state = {
    main: {},
    student: {},
    schedule: [],

    username: "",
    password: "",
    firstname: "",
    lastname: "",
    user_type: 5,
    active: 1,

    school_id: setMainRegister.school_id,
    branch_id: setMainRegister.branch_id,
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `register/result/${rm_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let main = res.main;
          let student = res.student;
          let student_id_number = student.student_id_number;
          // let branch_id = main.branch_id;
          // let branch_id_set = branch_id.slice(0, 2);
          // let student_id_number_set = student_id_number.slice(9, 13);
          // let new_user = branch_id_set + student_id_number_set; // รหัสไอดีสาขา 2 ตัวหน้า + เลขบัตร ปชช. 4 ตัวหลัง
          this.setState({
            main: main,
            student: res.student,
            schedule: res.schedule,
            username: student_id_number,
            password: student.student_mobile,
            firstname: student.student_firstname,
            lastname: student.student_lastname,
          });

          // console.log(new_user);
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleSubmitWithPayment = () => {
    try {
      axios
        .get(
          Common.API_URL + `register/save/${rm_id}`,

          Common.options
        )
        .then((res) => {
          //
          let data = res.data;
          let new_rm_id = data.rm_id;
          // console.log(data);
          this.emptyRegister(rm_id);
          this.CreateUser();
          window.location.href = `/register/payment/${new_rm_id}`;
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleSubmit = () => {
    try {
      axios
        .get(
          Common.API_URL + `register/save/${rm_id}`,

          Common.options
        )
        .then((res) => {
          this.emptyRegister(rm_id);
          this.CreateUser();
          let data = res.data;
          let new_rm_id = data.rm_id;
          window.location.href = `/student/${new_rm_id}`;
        });
    } catch (error) {
      console.log(error);
    }
  };
  emptyRegister = async (rm_id) => {
    try {
      await axios.delete(
        Common.API_URL + `register/emptycode/${rm_id}`,
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  CreateUser = () => {
    try {
      axios.post(
        Common.API_URL + "user/create",
        {
          username: this.state.username,
          password: this.state.password,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          user_type: this.state.user_type,
          active: this.state.active,
          branch_id: this.state.branch_id,
          school_id: this.state.school_id,
        },
        Common.options
      );
    } catch (error) {
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
    // console.log(schedule.length);
    return (
      <div>
        {/* {JSON.stringify(main)} */}
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
          <p>
            <Button variant="primary" onClick={this.handleSubmit}>
              บันทึก
            </Button>{" "}
            <Button variant="success" onClick={this.handleSubmitWithPayment}>
              บันทึกและชำระเงิน
            </Button>{" "}
          </p>
        </div>
        <h4>ข้อมูลการสมัคร</h4>

        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>รหัสการสมัคร</th>
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
                <td>{main.rm_id}</td>
                <td>{Functions.format_date_time(main.create_date)}</td>
                <td>
                  {main.course_regisetmain_tmp.course_code}{" "}
                  {main.course_regisetmain_tmp.course_name}
                </td>
                <td>{Functions.vehicle_type[main.vehicle_type_id - 1]}</td>
                <td>
                  {main.ed_id !== 1 && (
                    <span>
                      {Functions.ymdtodmy(
                        main.examdate_regisetmain_tmp.ed_date
                      )}{" "}
                      เวลา{" "}
                      {main.examdate_regisetmain_tmp.ed_start_time.slice(0, -3)}{" "}
                      - {main.examdate_regisetmain_tmp.ed_end_time.slice(0, -3)}{" "}
                      รวม {main.examdate_regisetmain_tmp.ed_hour} ชั่วโมง
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
                  {student.student_tmp_location.district_name}{" "}
                  <strong>อำเภอ / เขต</strong>{" "}
                  {student.student_tmp_location.amphur_name}{" "}
                  <strong>จังหวัด</strong>{" "}
                  {student.student_tmp_location.province_name}{" "}
                  {student.student_tmp_location.zipcode}
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
                    {rs.subject_rts.subject_code} {rs.subject_rts.subject_name}
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
                    {rs.teacher_rts.teacher_firstname}{" "}
                    {rs.teacher_rts.teacher_lastname}
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
