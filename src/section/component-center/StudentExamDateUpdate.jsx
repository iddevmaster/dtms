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
    ed_id: 0,
    fullname: "",
    main: [],
    school_id: "",
    course_id: "",
    branch_id: "",
    msg: "",
    dataExamDate: [],
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
          new Promise((accept) =>
            this.setState(
              {
                main: main,
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
          this.refreshDataExamDate(
            main.school_id,
            main.branch_id,
            main.vehicle_type_id
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

  refreshDataExamDate = async (school_id, branch_id, vehicle_type_id) => {
    try {
      await axios
        .get(
          Common.API_URL +
            `course/examdate/${school_id}?branch_id=${branch_id}&vehicle_type_id=${vehicle_type_id}&month=${this.state.present_month1}&year=${this.state.present_year1}`,

          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ dataExamDate: res });
        });
    } catch (error) {
      console.log(error);
    }
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
      this.state.branch_id,
      this.state.vehicle_type_id
    );
  };

  handleUpdateExamDate = () => {
    try {
      axios
        .get(
          Common.API_URL +
            `register/update_exam_core/${this.state.rm_id}/${this.state.ed_id}`,
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
    this.handleUpdateExamDate();
  };

  componentDidMount() {
    this.refrehData();
  }
  render() {
    const { main } = this.state;
    const { dataExamDate } = this.state;
    const { fullname } = this.state;
    const { ed_id } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>แก้ไขวันสอบ : {fullname}</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/student">
                <Breadcrumb.Item>ทะเบียนนักเรียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>แก้ไขวันสอบ</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        {main.rm_id !== undefined && (
          <div align="center">
            <h2>
              {main.ed_id !== 1 && (
                <span>
                  {Functions.ymdtodmy(main.examdate_regisetmain_core.ed_date)}{" "}
                  เวลา{" "}
                  {main.examdate_regisetmain_core.ed_start_time.slice(0, -3)} -{" "}
                  {main.examdate_regisetmain_core.ed_end_time.slice(0, -3)} รวม{" "}
                  {main.examdate_regisetmain_core.ed_hour} ชั่วโมง
                </span>
              )}
            </h2>
          </div>
        )}
        <h3>ตั้งค่าวันสอบใหม่</h3>
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
              <th>วันสอบ</th>
              <th>เวลาเริ่มต้น</th>
              <th>เวลาสิ้นสุด</th>
              <th>ชั่วโมงการสอบ</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {dataExamDate
              .filter((x) => x.ed_ready === 1)
              .map((rs, index) => (
                <tr key={index}>
                  <td>{Functions.ymdtodmy(rs.ed_date)}</td>
                  <td align="center">{rs.ed_start_time.slice(0, -3)}</td>
                  <td align="center">{rs.ed_end_time.slice(0, -3)}</td>
                  <td align="center">{rs.ed_hour}</td>
                  <td>
                    <Form.Check
                      inline
                      name="group"
                      type="radio"
                      id={`r-${index}`}
                      onChange={() => this.setState({ ed_id: rs.ed_id })}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <div align="center">
          <Button
            disabled={ed_id > 0 ? false : true}
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
