import "../../asset/Stepper.css";
import React, { Component, Suspense } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Select from "react-select";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
import Loading_2 from "../../asset/images/Loading_2.gif";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
// import timeGridPlugin from "@fullcalendar/timegrid";

const RegisterCalendarAddSubject = React.lazy(() =>
  import("../component-center/RegisterCalendarAddSubject")
);
const RegisterAddStudent = React.lazy(() =>
  import("../component-center/RegisterAddStudent")
);
const RegisterExamSeminar = React.lazy(() =>
  import("../component-center/RegisterExamSeminar")
);
const RegisterSeminar = React.lazy(() =>
  import("../component-center/RegisterSeminar")
);
const RegisterResultPreview = React.lazy(() =>
  import("../component-center/RegisterResultPreview")
);
const school_id = Common.getUserLoginData.school_id;
const d = new Date();
const timeList = Functions.time_list();
const list_year = Functions.get_year(d.getFullYear());
const months = Functions.months;
const setMainRegister = Functions.getRegisterIndex(); ///ข้อมูลชั่วคราวที่ใช้ในการสมัคร
const rm_id = setMainRegister.rm_id;
const allStep = Functions.getAllStepRegister(setMainRegister.course_group);
const current_step = 1;
const customSelectStyles = Common.customSelectStyles;

export default class Register extends Component {
  state = {
    vehicle_type_id: setMainRegister.vehicle_type_id,
    course_group: 0,
    course_id: setMainRegister.course_id,
    start_time: "",
    end_time: "",
    teacher_id: "",
    stepper: 0,
    teacher_event: [],

    // branch_id: Common.getUserLoginData.branch_id,
    branch_id: setMainRegister.branch_id,

    vt: [],
    cd: [],
    branch: [],
    typefilter: 1,
    month: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    year: d.getFullYear(),

    list_branch: [],
    defaultBranch: {
      value: "",
      label: "สาขา",
    },

    list_course: [],
    defaultCourse: {
      value: "",
      label: "หลักสูตร",
    },

    list_teacher: [],
    defaultTeacher: {
      value: "",
      label: "ครู",
    },
  };
  calendarRef = React.createRef();
  fullCalendarSetDate = () => {
    let calendarApi = this.calendarRef.current.getApi();
    var dateSet;
    if (setMainRegister.dateDefault === "") {
      let yourDate = new Date();
      dateSet = yourDate.toISOString().split("T")[0];
    } else {
      dateSet = setMainRegister.dateDefault;
    }
    calendarApi.gotoDate(dateSet);
    // console.log(calendarApi.gotoDate("2022-11-22 10:10"));
    //   calendarApi.next();
  };

  checkDataRegister = async () => {
    try {
      await axios
        .get(Common.API_URL + `register/check/${rm_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let crtdate = res.create_date;
          let presentday = d.toISOString().split("T")[0];
          this.setState({
            defaultBranch: {
              value: res.branch_id,
              label: res.branch_regisetmain_tmp.branch_name,
            },
            defaultCourse: {
              value: res.course_id,
              label: res.course_regisetmain_tmp.course_name,
            },
          });
          // console.log(String(crtdate).split("T")[0]);
          // console.log(presentday);
          // ถ้าข้ามวันแล้วให้ตั้งค่าเริ่มต้นสำหรับรหัสสมัครนี้
          if (String(crtdate).split("T")[0] !== presentday) {
            this.default();
          }
        });
    } catch (error) {
      // console.log(setMainRegister.rm_id);
      if (setMainRegister.rm_id !== "") {
        this.default();
      }
    }
  };

  getCourse = (newValue) => {
    try {
      axios
        .post(
          Common.API_URL + `course/${school_id}?only=true`,
          {
            page: 1,
            per_page: 15,
            search_value: newValue,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let list = res.data;
          var arr = [];

          for (let i = 0; i < list.length; i++) {
            let obj = list[i];

            // console.log(obj.rs_id);
            if (obj.course_readey > 0) {
              arr.push({
                value: obj.course_id,
                label: obj.course_name,
              });
            }
          }
          // console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_course: arr,
                },
                accept
              );
            }, 1000);
          });
          // this.setState({ cd: res.data });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getCourseById = async (course_id) => {
    // console.log(course_id);
    try {
      await axios
        .get(Common.API_URL + `course/${course_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({
            course_group: res.course_group,
            vehicle_type_id: res.vehicle_type_id,
          });
          this.getTeacher();
        });
    } catch (error) {
      console.log(error);
    }
  };

  getTeacher = async () => {
    // ถ้าเลือกประธาน  tl_level จะต้องกำหนด เป็นค่า 3 เพราะหมายถึงระดับ 3 เท่านั้นถึงจะเป็นประธานได้
    let tl_level = 1;
    // console.log(this.state.vehicle_type_id);
    try {
      await axios
        .get(
          Common.API_URL +
            `teacher/licence/${school_id}/all?branch_id=${this.state.branch_id}&tl_level=${tl_level}&vehicle_type_id=${this.state.vehicle_type_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let list = res;
          var arr = [];

          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            arr.push({
              value: obj.teacher_id,
              label: obj.teacher_firstname + " " + obj.teacher_lastname,
            });
          }
          // console.log(arr);
          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_teacher: arr,
                },
                accept
              );
            }, 1000);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  getTeacherByid = async (teacher_id) => {
    try {
      await axios
        .get(Common.API_URL + `teacher/${teacher_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({
            defaultTeacher: {
              value: res.teacher_id,
              label: res.teacher_firstname + " " + res.teacher_lastname,
            },
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  setCourse_id = async (e) => {
    // console.log(e);
    // console.log(e.value);
    this.setState({ course_id: e.value, defaultCourse: e });
    this.getCourseById(e.value);
  };

  getBranch = (newValue) => {
    // console.log(newValue);
    try {
      axios
        .post(
          Common.API_URL + `school/branch/all/${school_id}`,
          {
            page: 1,
            per_page: 15,
            search_value: newValue,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let list = res.data;
          var arr = [];

          for (let i = 0; i < list.length; i++) {
            let obj = list[i];

            // console.log(obj.rs_id);

            arr.push({
              value: obj.branch_id,
              label: obj.branch_name,
            });
          }
          // console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_branch: arr,
                },
                accept
              );
            }, 1000);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  setBranch_id = async (e) => {
    // console.log(e);
    // console.log(e.value);
    this.setState({ branch_id: e.value, defaultBranch: e });
  };

  getTeacher_id = async (e) => {
    await new Promise((accept) =>
      this.setState(
        {
          branch_id: e.target.value,
        },
        accept
      )
    );
    this.getTeacher();
  };
  // จาก Select
  getTeacher_id2 = async (e) => {
    this.setState({ teacher_id: e.value, defaultTeacher: e });
  };

  setTeacher_id = async (teacher_id, date) => {
    await new Promise((accept) =>
      this.setState(
        {
          teacher_id: teacher_id,
        },
        accept
      )
    );
    Functions.setRegisterIndex(
      setMainRegister.rm_id,
      setMainRegister.course_group,
      setMainRegister.course_id,
      teacher_id,
      date,
      current_step + 1,
      1,
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
    // console.log(date);
    window.location.reload();
  };

  searchSchedule = async () => {
    let dateSet;
    // if (setMainRegister.dateDefault === "") {
    //   dateSet =
    //     String(this.state.year) +
    //     "-" +
    //     Functions.twoDigit(this.state.month) +
    //     "-01";
    // } else {
    //   dateSet = setMainRegister.dateDefault;
    // }
    dateSet =
      String(this.state.year) +
      "-" +
      Functions.twoDigit(this.state.month) +
      "-01";
    if (rm_id !== "") {
      this.emptyRegister(rm_id);
    }

    try {
      await axios
        .post(
          Common.API_URL + "register/search_schedule",
          {
            course_id: this.state.course_id,
            start_time:
              this.state.start_time === "" ? "00:00" : this.state.start_time,
            end_time:
              this.state.end_time === "" ? "00:00" : this.state.end_time,
            date_set: dateSet,
            teacher_id:
              this.state.teacher_id === "" ? "" : this.state.teacher_id,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ teacher_event: res });

          Functions.setRegisterIndex(
            res.rm_id,
            res.course_group,
            this.state.course_id,
            this.state.teacher_id,
            dateSet,
            this.state.typefilter,
            current_step,
            allStep,
            this.state.month,
            this.state.year,
            this.state.start_time,
            this.state.end_time,
            res.vehicle_type_id,
            this.state.branch_id,
            school_id,
            res.teacher_list
          );
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  default = () => {
    if (rm_id !== "" || rm_id !== null) {
      this.emptyRegister(rm_id);
    }
    Functions.setRegisterIndex(
      "",
      0,
      "",
      "",
      "",
      1,
      current_step,
      allStep,
      d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
      d.getFullYear(),
      "08:00:00",
      "17:00:00",
      0,
      "",
      "",
      []
    );

    window.location.reload();
  };
  goToStep = (num) => {
    Functions.setRegisterIndex(
      setMainRegister.rm_id,
      setMainRegister.course_group,
      setMainRegister.course_id,
      setMainRegister.teacher_id,
      setMainRegister.dateDefault,
      current_step + 1,
      num,
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
    // console.log(date);
    window.location.reload();
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

  componentDidMount() {
    this.getCourse("");
    this.getBranch("");
    this.checkDataRegister();
    if (setMainRegister.teacher_id !== "") {
      this.getTeacherByid(setMainRegister.teacher_id);
    }

    this.setState({
      course_group: setMainRegister.course_group,
      course_id: setMainRegister.course_id,
      teacher_id: setMainRegister.teacher_id,
      dateDefault: setMainRegister.dateDefault,
      typefilter: setMainRegister.typefilter,
      stepper: 1,
      month: setMainRegister.month,
      year: setMainRegister.year,
      start_time: setMainRegister.start_time,
      end_time: setMainRegister.end_time,
      vehicle_type_id: setMainRegister.vehicle_type_id,
      branch_id: setMainRegister.branch_id,
      teacher_event: setMainRegister.teacher_event,
    });
    if (
      setMainRegister.course_group !== 3 &&
      setMainRegister.teacher_id === "" &&
      setMainRegister.stepper === 1
    ) {
      this.fullCalendarSetDate();
      // console.log(setMainRegister.dateDefault);
    }

    // console.log(setMainRegister);
  }
  componentDidUpdate() {
    // this.getTeacher();
  }

  render() {
    const { defaultBranch } = this.state;
    const { list_branch } = this.state;

    const course_group = setMainRegister.course_group;
    const typefilter = setMainRegister.typefilter;
    const teacher_event = setMainRegister.teacher_event;
    // const course_id = setMainRegister.course_id;

    const teacher_id = setMainRegister.teacher_id;
    const date_set = setMainRegister.dateDefault;
    const stepper = setMainRegister.stepper;

    const { defaultCourse } = this.state;
    const { list_course } = this.state;

    const { defaultTeacher } = this.state;
    const { list_teacher } = this.state;

    let showComponent;
    if (course_group !== 3 && teacher_id === "" && stepper === 1) {
      showComponent = (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={"th"}
          // headerToolbar={{
          //   left: "prev,next today",
          //   center: "title",
          //   right: "dayGridMonth,dayGridWeek",
          // }}
          validRange={{
            start: new Date(Functions.getDaysInMonth(date_set)[0]),
            end: new Date(Functions.getDaysInMonth(date_set)[1]),
          }}
          eventClick={(arg) => {
            let yourDate = new Date(arg.event.start);
            let date = yourDate.toISOString().split("T")[0];
            let teacher_id = arg.event.id;
            // console.log(date);
            // console.log(yourDate);
            this.setTeacher_id(teacher_id, date);
          }}
          editable={true}
          events={teacher_event}
          ref={this.calendarRef}
        />
      );
    }
    // ประเภทเรียนปฏิบัติ อบรม สอบ
    if (course_group === 1 && teacher_id !== "" && stepper === 1) {
      showComponent = <RegisterCalendarAddSubject />;
    }
    if (course_group === 1 && teacher_id !== "" && stepper === 2) {
      showComponent = <RegisterAddStudent />;
    }
    if (course_group === 1 && teacher_id !== "" && stepper === 3) {
      showComponent = <RegisterExamSeminar />;
    }
    if (course_group === 1 && teacher_id !== "" && stepper === 4) {
      showComponent = <RegisterResultPreview />;
    }

    // ประเภทเรียนปฏิบัติอย่างเดียว
    if (course_group === 2 && teacher_id !== "" && stepper === 1) {
      showComponent = <RegisterCalendarAddSubject />;
    }
    if (course_group === 2 && teacher_id !== "" && stepper === 2) {
      showComponent = <RegisterAddStudent />;
    }
    if (course_group === 2 && teacher_id !== "" && stepper === 3) {
      showComponent = <RegisterResultPreview />;
    }

    // อบรมอย่างเดียว
    if (course_group === 3 && stepper === 1) {
      showComponent = <RegisterSeminar />;
    }
    if (course_group === 3 && stepper === 2) {
      showComponent = <RegisterAddStudent />;
    }
    if (course_group === 3 && stepper === 3) {
      showComponent = <RegisterResultPreview />;
    }

    // Step
    let showStepProgress;
    if (course_group === 1) {
      showStepProgress = (
        <div className="wrapper-progressBar">
          <ul className="progressBar">
            <li
              style={{ width: "25%" }}
              className={parseInt(stepper) >= 1 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(1)}
              >
                บันทึกเวลาเรียนปฏิบัติ
              </div>
            </li>
            <li
              style={{ width: "25%" }}
              className={parseInt(stepper) >= 2 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(2)}
              >
                บันทึกข้อมูลนักเรียน
              </div>
            </li>
            <li
              style={{ width: "25%" }}
              className={parseInt(stepper) >= 3 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(3)}
              >
                เลือกวันอบรมทฤษฎีและวันสอบ
              </div>
            </li>
            <li
              style={{ width: "25%" }}
              className={parseInt(stepper) >= 4 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(4)}
              >
                ชำระเงิน
              </div>
            </li>
          </ul>
        </div>
      );
    }
    if (course_group === 2) {
      showStepProgress = (
        <div className="wrapper-progressBar">
          <ul className="progressBar">
            <li
              style={{ width: "30%" }}
              className={parseInt(stepper) >= 1 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(1)}
              >
                บันทึกเวลาเรียนปฏิบัติ
              </div>
            </li>
            <li
              style={{ width: "30%" }}
              className={parseInt(stepper) >= 2 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(2)}
              >
                บันทึกข้อมูลนักเรียน
              </div>
            </li>
            <li
              style={{ width: "30%" }}
              className={parseInt(stepper) >= 3 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(3)}
              >
                ชำระเงิน
              </div>
            </li>
          </ul>
        </div>
      );
    }

    if (course_group === 3) {
      showStepProgress = (
        <div className="wrapper-progressBar">
          <ul className="progressBar">
            <li
              style={{ width: "30%" }}
              className={parseInt(stepper) >= 1 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(1)}
              >
                เลือกวันอบรมทฤษฎี
              </div>
            </li>
            <li
              style={{ width: "30%" }}
              className={parseInt(stepper) >= 2 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(2)}
              >
                บันทึกข้อมูลนักเรียน
              </div>
            </li>
            <li
              style={{ width: "30%" }}
              className={parseInt(stepper) >= 3 ? "active" : null}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.goToStep(3)}
              >
                ชำระเงิน
              </div>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        {/* {JSON.stringify(setMainRegister)} */}
        {/* {JSON.stringify(tc)} */}
        <Suspense
          fallback={
            <div align="center">
              <Card.Img
                variant="top"
                src={Loading_2}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          }
        >
          <Row>{showStepProgress}</Row>

          <Card border="info">
            <Card.Header>
              <Row>
                <Col sm={8}>
                  {parseInt(stepper) < 2 && (
                    <div className="mb-3">
                      <Form.Check
                        inline
                        label="ช่วงเวลา"
                        name="group1"
                        type="radio"
                        onClick={() => this.setState({ typefilter: 1 })}
                        defaultChecked={typefilter === 1 ? true : false}
                      />
                      <Form.Check
                        inline
                        label="ครูฝึก"
                        name="group1"
                        type="radio"
                        onClick={() => this.setState({ typefilter: 2 })}
                        defaultChecked={typefilter === 2 ? true : false}
                        disabled={this.state.course_group === 3 ? true : false}
                      />
                    </div>
                  )}
                  {parseInt(stepper) >= 2 && <h4> รหัสการสมัคร {rm_id}</h4>}
                </Col>
                <Col sm={4}>
                  <div align="right">
                    <Button variant="warning" onClick={this.default}>
                      ทำรายการใหม่
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              {parseInt(stepper) < 2 && (
                <Row>
                  <Col>
                    <Select
                      id="branch_id"
                      options={list_branch}
                      onInputChange={this.getBranch}
                      styles={customSelectStyles}
                      onChange={this.setBranch_id}
                      value={defaultBranch}
                      cacheOptions
                      menuPlacement="top"
                    />
                  </Col>
                  <Col>
                    <Select
                      id="course_id"
                      options={list_course}
                      onInputChange={this.getCourse}
                      styles={customSelectStyles}
                      onChange={this.setCourse_id}
                      value={defaultCourse}
                      cacheOptions
                      menuPlacement="top"
                    />
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <Form.Select
                        size="lg"
                        onChange={(e) =>
                          this.setState({ month: e.target.value })
                        }
                        value={this.state.month}
                      >
                        <option value="">--เดือน--</option>
                        {months.map((value, index) => (
                          <option value={index + 1} key={index}>
                            {value}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Select
                        size="lg"
                        onChange={(e) =>
                          this.setState({ year: e.target.value })
                        }
                        value={this.state.year}
                      >
                        <option value="">--ปี--</option>
                        {list_year.map((value, index) => (
                          <option value={value} key={index}>
                            {value}
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  <Col>
                    {this.state.typefilter === 1 && (
                      <InputGroup className="mb-3">
                        <Form.Select
                          size="lg"
                          onChange={(e) =>
                            this.setState({ start_time: e.target.value })
                          }
                          defaultValue={setMainRegister.start_time}
                        >
                          <option value="">--เลือกเวลาเริ่มต้น--</option>
                          {timeList.map((value, index) => (
                            <option value={value} key={index}>
                              {value.slice(0, -3)}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Select
                          size="lg"
                          onChange={(e) =>
                            this.setState({ end_time: e.target.value })
                          }
                          defaultValue={setMainRegister.end_time}
                        >
                          <option value="">--เลือกเวลาสิ้นสุด--</option>
                          {timeList.map((value, index) => (
                            <option value={value} key={index}>
                              {value.slice(0, -3)}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    )}
                    {this.state.typefilter === 2 && (
                      <Select
                        id="teacher_id"
                        options={list_teacher}
                        styles={customSelectStyles}
                        onChange={this.getTeacher_id2}
                        value={defaultTeacher}
                        cacheOptions
                        menuPlacement="top"
                        isDisabled={
                          this.state.course_group === 3 ? true : false
                        }
                      />
                    )}
                  </Col>
                  <Col sm={1}>
                    <Button
                      variant="success"
                      size="lg"
                      onClick={this.searchSchedule}
                    >
                      ค้นหา
                    </Button>
                  </Col>
                </Row>
              )}

              <Row>{showComponent}</Row>
            </Card.Body>
          </Card>
        </Suspense>
      </div>
    );
  }
}
