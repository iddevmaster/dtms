import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
// import Card from "react-bootstrap/Card";
// import Alert from "react-bootstrap/Alert";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import InputGroup from "react-bootstrap/InputGroup";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const d = new Date();
const c = d.getMonth() + 1 + "/" + d.getFullYear();

const GetDataForm = () => {
  const { rm_id } = useParams();

  return <StudentUpdate rm_id={rm_id} />;
};
export default GetDataForm;
class StudentUpdate extends Component {
  state = {
    rm_id: this.props.rm_id,
    fullname: "",
    schedule: [],
    school_id: "",
    course_id: "",
    branch_id: "",
    msg: "",
    dataSeminar: [],
    setPostSeminar: [],
    present_month1: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    present_year1: d.getFullYear(),
  };

  refrehData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `register/result/core/${this.state.rm_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let main = res.main;
          let student = res.student;
          let schedule = res.schedule;
          new Promise((accept) =>
            this.setState(
              {
                schedule: schedule,
                school_id: main.school_id,
                course_id: main.course_id,
                branch_id: main.branch_id,
                fullname:
                  student.student_firstname + " " + student.student_lastname,
              },
              accept
            )
          );
          // console.log(main.school_id);
          this.refreshDataSeminar(
            main.school_id,
            main.course_id,
            main.branch_id
          );
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

  refreshDataSeminar = async (school_id, course_id, branch_id) => {
    try {
      await axios
        .get(
          Common.API_URL +
            `course/seminar/${school_id}/${course_id}?branch_id=${branch_id}&month=${this.state.present_month1}&year=${this.state.present_year1}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ dataSeminar: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  selectDateSeminar = async (
    seminar_id,
    rs_start_time,
    rs_end_time,
    subject_id,
    teacher_id,
    rm_id,
    branch_id,
    school_id
  ) => {
    let checkBox = document.getElementById("c-" + seminar_id);

    const { setPostSeminar } = this.state;
    if (checkBox.checked === false) {
      // console.log("false");
      var filtered = setPostSeminar.filter(function (item) {
        return item.seminar_id !== seminar_id;
      });
      await new Promise((accept) =>
        this.setState(
          {
            setPostSeminar: filtered,
          },
          accept
        )
      );
      return false;
    }

    var filtered2 = setPostSeminar.filter(function (item) {
      return item.seminar_id !== seminar_id;
    });
    const arr = {
      seminar_id: seminar_id,
      subject_learn_type: 1,
      rs_start_time: rs_start_time,
      rs_end_time: rs_end_time,
      subject_id: subject_id,
      teacher_id: teacher_id,
      rm_id: rm_id,
      branch_id: branch_id,
      school_id: school_id,
    };
    filtered2.push(arr);
    // console.log(JSON.stringify(filtered2));
    await new Promise((accept) =>
      this.setState(
        {
          setPostSeminar: filtered2,
        },
        accept
      )
    );
  };

  FormatDate = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ student_birthday: fulldate });
    // console.log(fulldate);
  };
  setMonthFilter1 = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);

    let getmonth = e.month.number;
    let getyear = e.year;

    await new Promise((accept) =>
      this.setState(
        {
          present_month1: getmonth,
          present_year1: getyear,
        },
        accept
      )
    );

    this.refreshDataSeminar(
      this.state.school_id,
      this.state.course_id,
      this.state.branch_id
    );
  };

  handleAddSchedue = () => {
    try {
      axios
        .post(
          Common.API_URL + "register/create_schedule_core_multiple",
          this.state.setPostSeminar,
          Common.options
        )
        .then((response) => {
          this.refrehData();
        });
    } catch (error) {
      console.log(error);
    }
  };
  submit = () => {
    this.handleAddSchedue();
  };

  componentDidMount() {
    this.refrehData();
  }
  render() {
    const { schedule } = this.state;
    const { dataSeminar } = this.state;
    const { rm_id } = this.state;
    const { fullname } = this.state;
    const { setPostSeminar } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>แก้ไขวันอบรม : {fullname}</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/student">
                <Breadcrumb.Item>ทะเบียนนักเรียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>แก้ไขวันอบรม</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

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
              {schedule
                .filter((x) => x.subject_learn_type === 1)
                .map((rs, index) => (
                  <tr key={index}>
                    <td>
                      {rs.subject_rcs.subject_code}{" "}
                      {rs.subject_rcs.subject_name}
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

        {/* <div align="center">
          <Button variant="danger">เคลียร์และทำรายการใหม่</Button>{" "}
        </div> */}
        <h3>ตั้งค่าวันอบรมใหม่</h3>
        <div align="right">
          <DatePicker
            onlyMonthPicker
            calendar={thai}
            locale={thai_th}
            style={{ height: "45px" }}
            onChange={(e) => this.setMonthFilter1(e)}
            placeholder={c}
          />
        </div>

        <Table striped>
          <thead>
            <tr>
              <th>วันที่อบรม</th>
              <th>เวลา</th>
              <th>ชั่วโมงอบรม</th>
              <th>รายวิชา</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {dataSeminar
              .filter((x) => x.seminar_ready === 1)
              .map((rs, index) => (
                <tr key={index}>
                  <td>{Functions.ymdtodmy(rs.seminar_date)}</td>
                  <td>
                    {rs.seminar_start_time.slice(0, -3)} {" - "}
                    {rs.seminar_end_time.slice(0, -3)}
                  </td>
                  <td align="center">{rs.seminar_hour}</td>
                  <td>
                    {rs.subject_seminar.subject_code}{" "}
                    {rs.subject_seminar.subject_name}
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      id={`c-${rs.seminar_id}`}
                      onClick={() => [
                        this.selectDateSeminar(
                          rs.seminar_id,
                          rs.seminar_date + " " + rs.seminar_start_time,
                          rs.seminar_date + " " + rs.seminar_end_time,
                          rs.subject_id,
                          rs.teacher_id,
                          rm_id,
                          rs.branch_id,
                          rs.school_id
                        ),
                      ]}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <div align="center">
          <Button
            disabled={setPostSeminar.length > 0 ? false : true}
            variant="primary"
            size="lg"
            onClick={this.submit}
          >
            บันทึก
          </Button>
        </div>
      </div>
    );
  }
}
