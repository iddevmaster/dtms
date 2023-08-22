import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const setMainRegister = Functions.getRegisterIndex(); ///ข้อมูลชั่วคราวที่ใช้ในการสมัคร
const rm_id = setMainRegister.rm_id;
const allStep = Functions.getAllStepRegister(setMainRegister.course_group);
const current_step = 1;
const d = new Date();
const c = d.getMonth() + 1 + "/" + d.getFullYear();
export default class RegisterSeminar extends Component {
  state = {
    school_id: setMainRegister.school_id,
    branch_id: setMainRegister.branch_id,
    course_id: setMainRegister.course_id,
    vehicle_type_id: setMainRegister.vehicle_type_id,
    ed_id: 0,
    dataSeminar: [],
    dataExamDate: [],
    setPostSeminar: [],

    present_month1: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    present_year1: d.getFullYear(),

    present_month2: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    present_year2: d.getFullYear(),
  };

  refreshDataSeminar = async () => {
    try {
      await axios
        .get(
          Common.API_URL +
            `course/seminar/${this.state.school_id}/${this.state.course_id}?branch_id=${this.state.branch_id}&month=${this.state.present_month1}&year=${this.state.present_year1}`,
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

    this.refreshDataSeminar();
  };

  selectDateSeminar = async (
    seminar_id,
    rs_start_time,
    rs_end_time,
    rm_id,
    subject_id,
    teacher_id,
    branch_id,
    school_id
  ) => {
    let checkBox = document.getElementById("c-" + seminar_id);

    const { setPostSeminar } = this.state;
    if (checkBox.checked === false) {
      //   console.log("false");
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
      rm_id: rm_id,
      subject_id: subject_id,
      teacher_id: teacher_id,
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
  handleAddSchedue = () => {
    try {
      axios.post(
        Common.API_URL + "register/create_schedule_tmp_multiple",
        this.state.setPostSeminar,
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  submit = () => {
    this.handleAddSchedue();
    Functions.setRegisterIndex(
      setMainRegister.rm_id,
      setMainRegister.course_group,
      setMainRegister.course_id,
      setMainRegister.teacher_id,
      setMainRegister.dateDefault,
      setMainRegister.typefilter,
      current_step + 1,
      allStep,
      setMainRegister.month,
      setMainRegister.year,
      setMainRegister.start_time,
      setMainRegister.end_time,
      setMainRegister.vehicle_type_id,
      setMainRegister.branch_id,
      setMainRegister.school_id,
      setMainRegister.teacher_event
    );
    window.location.reload();
  };

  emptySeminar = () => {
    try {
      axios.delete(
        Common.API_URL + `register/subject_schedule_tmp/multiple/1/${rm_id}`,
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshDataSeminar();
  }

  render() {
    const { dataSeminar } = this.state;
    const { setPostSeminar } = this.state;

    return (
      <div>
        {/* {JSON.stringify(this.state.setPostSeminar)} */}

        <Row>
          <Col>
            <Card border="success">
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col>วันอบรมทฤษฎี</Col>
                    <Col>
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
                    </Col>
                  </Row>
                </Card.Title>

                <Table striped>
                  <thead>
                    <tr>
                      <th>วันที่อบรม</th>
                      <th>เวลา</th>
                      <th>ชั่วโมงอบรม</th>
                      <th>รายวิชา</th>
                      <th>ครู / วิทยากร</th>
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
                            {rs.teacher_seminar.teacher_firstname}{" "}
                            {rs.teacher_seminar.teacher_lastname}
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
                                  rm_id,
                                  rs.subject_id,
                                  rs.teacher_id,
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="d-grid gap-2">
          <p></p>
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
