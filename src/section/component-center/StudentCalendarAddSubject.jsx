import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { LinkContainer } from "react-router-bootstrap";
import Select from "react-select";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import "../../asset/FullCanlendar.css";
const d = new Date();
const school_id = Common.getUserLoginData.school_id;
const list_year = Functions.get_year(d.getFullYear());
const months = Functions.months;
// const setMainRegister = Functions.getRegisterIndex(); ///ข้อมูลชั่วคราวที่ใช้ในการสมัคร
const customSelectStyles = Common.customSelectStyles;
const GetDataForm = () => {
  const { rm_id } = useParams();

  return <UpdateRegisterCalendarAddSubject rm_id={rm_id} />;
};
export default GetDataForm;

class UpdateRegisterCalendarAddSubject extends Component {
  state = {
    rs_id: "",
    course_id: "",
    teacher_id: "",
    rm_id: this.props.rm_id,
    branch_id: "",
    event_teacher: [],
    eventDetail: "",
    isOpenModalDelete: false,
    isOpenModalAlert: false,
    main: [],
    subject_cach: [],

    month: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    year: d.getFullYear(),
    date_set: "",
    list_teacher: [],
    defaultTeacher: {
      value: "",
      label: "ครู",
    },

    fullname: "",
  };
  calendarRef = React.createRef();
  getDataRegister = async () => {
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
          let teacher_id;
          if (schedule.length <= 0) {
            teacher_id = "";
          } else if (this.state.teacher_id !== "") {
            teacher_id = this.state.teacher_id;
          } else {
            teacher_id = res.schedule.slice(-1).pop().teacher_id;
          }
          this.setState({
            main: res.main,
            subject_cach: res.subject_cach,
            teacher_id: teacher_id,
            branch_id: main.branch_id,
            course_id: main.course_id,
            date_set: main.date_set,
            fullname:
              student.student_firstname + " " + student.student_lastname,
          });
          this.fullCalendarSetDate(main.date_set);
          this.getTeacherEvent(this.state.rm_id, teacher_id);
          this.getTeacher(main.branch_id, main.vehicle_type_id);
          this.getTeacherByid(teacher_id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  getTeacherEvent = async (rm_id, teacher_id) => {
    try {
      await axios
        .get(
          Common.API_URL +
            `register/get_schedule_core/${rm_id}?teacher_id=${teacher_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ event_teacher: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getTeacher = async (branch_id, vehicle_type_id) => {
    // ถ้าเลือกประธาน  tl_level จะต้องกำหนด เป็นค่า 3 เพราะหมายถึงระดับ 3 เท่านั้นถึงจะเป็นประธานได้
    let tl_level = 1;
    // console.log(tl_level);
    try {
      await axios
        .get(
          Common.API_URL +
            `teacher/licence/${school_id}/all?branch_id=${branch_id}&tl_level=${tl_level}&vehicle_type_id=${vehicle_type_id}`,
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
          //   console.log(arr);
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
  // จาก Select
  getTeacher_id = async (e) => {
    this.setState({ teacher_id: e.value, defaultTeacher: e });
  };

  handleAddSchedue = (
    rs_start_time,
    rs_end_time,
    rs_hour,
    rm_id,
    subject_id,
    teacher_id,
    branch_id,
    school_id
  ) => {
    let start = Functions.LongDatetoShortDateISO(rs_start_time);
    let end = Functions.LongDatetoShortDateISO(rs_end_time);

    try {
      axios
        .post(
          Common.API_URL + "register/create_schedule_core",
          {
            subject_learn_type: 2,
            rs_start_time: start,
            rs_end_time: end,
            rs_hour: rs_hour,
            rs_check: false,
            rm_id: rm_id,
            subject_id: subject_id,
            teacher_id: teacher_id,
            branch_id: branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.fullCalendarRefresh();
          this.getDataRegister();
        })
        .catch((err) => {
          // Handle error
          this.fullCalendarRefresh();
          this.setState({ isOpenModalAlert: true });

          // console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleUpdateSchedue = (rs_id, rs_start_time, rs_end_time) => {
    // console.log(rs_start_time);
    let start = Functions.LongDatetoShortDateISO(rs_start_time);
    let end = Functions.LongDatetoShortDateISO(rs_end_time);
    // console.log(start);
    try {
      axios
        .put(
          Common.API_URL + `register/update_schedule_core/${rs_id}`,
          {
            rs_start_time: start,
            rs_end_time: end,
          },
          Common.options
        )
        .then((res) => {
          this.fullCalendarRefresh();
          this.getDataRegister();
        })
        .catch((err) => {
          // Handle error
          this.fullCalendarRefresh();
          this.setState({ isOpenModalAlert: true });

          // console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleRecieve = async (eventInfo) => {
    // console.log(eventInfo);
    let subject_id = eventInfo.draggedEl.getAttribute("id");
    // let title = eventInfo.draggedEl.getAttribute("title");
    let hour = eventInfo.draggedEl.getAttribute("hour");
    let start = eventInfo.dateStr;
    let end = Functions.addHourEndDate(start, hour);
    // let value = {
    //   id: id,
    //   title: title,
    //   start: start,
    //   end: Functions.addHourEndDate(start, hour),
    // };
    this.handleAddSchedue(
      start,
      end,
      hour,
      this.state.rm_id,
      subject_id,
      this.state.teacher_id,
      this.state.branch_id,
      school_id
    );

    // console.log("value", value);
  };
  handleUpdate = async (arg) => {
    // console.log(arg);
    // console.log(arg.event.endStr);
    let rs_id = arg.event.id;
    let start = arg.event.start;
    let end = arg.event.end;
    // console.log(end);
    this.handleUpdateSchedue(rs_id, start, end);
  };
  handleDetail = async (arg) => {
    let rs_id = arg.event.id;
    let title = arg.event.title;
    let start = Functions.LongDatetoShortDate(arg.event.start);
    let end = Functions.LongDatetoShortDate(arg.event.end);
    if (rs_id === "null") {
      // console.log(arg.event.id);
      return false;
    }

    try {
      await axios
        .get(
          Common.API_URL + `register/schedule_detail_core/${rs_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let teacher =
            res.teacher_rcs.teacher_firstname +
            " " +
            res.teacher_rcs.teacher_lastname;
          this.setState({
            rs_id: rs_id,
            isOpenModalDelete: true,
            eventDetail: title + "," + start + "," + end + "," + teacher,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `register/subject_schedule_core/${this.state.rs_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false });
          this.fullCalendarRefresh();
          this.getDataRegister();
        });
    } catch (error) {
      console.log(error);
    }
  };
  fullCalendarRefresh = () => {
    let calendarApi = this.calendarRef.current.getApi();
    //   console.log(calendarApi);
    //   calendarApi.next();
    calendarApi.removeAllEvents();
    calendarApi.refetchEvents();
  };
  fullCalendarSetDate = (date_set) => {
    let calendarApi = this.calendarRef.current.getApi();

    // console.log(dateSet);
    if (date_set !== undefined && date_set !== "") {
      calendarApi.gotoDate(date_set);
    }
    // console.log(date_set);
    //
    // console.log(calendarApi.gotoDate("2022-11-22 10:10"));
    //   calendarApi.next();
  };

  drag = () => {
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: (eventEl) => {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("id");
        let hour = eventEl.getAttribute("hour");
        // console.log(id);
        return {
          id: id,
          title: title,
          hour: hour,
        };
      },
    });
  };

  search = () => {
    let rm_id = this.state.rm_id;
    let teacher_id = this.state.teacher_id;
    this.getTeacherEvent(rm_id, teacher_id);
    const dd = "01";
    let date_set = this.state.year + "-" + this.state.month + "-" + dd;
    // console.log(date_set);
    try {
      axios
        .put(
          Common.API_URL + "register/search_schedule_core/" + rm_id,
          {
            course_id: this.state.course_id,
            start_time: "08:00:00",
            end_time: "12:00:00",
            date_set: date_set,
            teacher_id: this.state.teacher_id,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.fullCalendarRefresh();
          this.getDataRegister();
        })
        .catch((err) => {
          // Handle error
          this.fullCalendarRefresh();
          this.setState({ isOpenModalAlert: true });

          // console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.getDataRegister();
    this.drag();
  }

  render() {
    const { subject_cach } = this.state;
    const { isOpenModalDelete } = this.state;
    const { isOpenModalAlert } = this.state;
    const { eventDetail } = this.state;
    const { event_teacher } = this.state;
    const { date_set } = this.state;
    const { defaultTeacher } = this.state;
    const { list_teacher } = this.state;
    const { fullname } = this.state;
    let [title, start, end, teacher] = eventDetail.split(",");

    return (
      <div>
        {/* {JSON.stringify(event_teacher)} */}
        <Row>
          <Col sm={8}>
            <h3>แก้ไขตารางเรียน : {fullname}</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/student">
                <Breadcrumb.Item>ทะเบียนนักเรียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>แก้ไขตารางเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <Form.Select
                size="lg"
                onChange={(e) => this.setState({ month: e.target.value })}
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
                onChange={(e) => this.setState({ year: e.target.value })}
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
            <Select
              id="teacher_id"
              options={list_teacher}
              styles={customSelectStyles}
              onChange={this.getTeacher_id}
              value={defaultTeacher}
              cacheOptions
              menuPlacement="top"
            />
          </Col>
          <Col sm={1}>
            <Button variant="success" size="lg" onClick={this.search}>
              ค้นหา
            </Button>
          </Col>
        </Row>
        <Row>
          <Col lg={3} sm={3} md={3}>
            <div
              id="external-events"
              style={{
                padding: "10px",
                width: "100%",
                height: "auto",
                maxHeight: "-webkit-fill-available",
              }}
            >
              <p align="center">
                <strong> รายวิชา</strong>
              </p>
              {subject_cach.map((event, index) => (
                <div
                  className="fc-event"
                  title={event.rs_remark}
                  id={event.subject_id}
                  key={index}
                  hour={event.rs_hour_use}
                >
                  <Alert variant="secondary">
                    {event.rs_remark}{" "}
                    <i>
                      <span style={{ fontSize: "18px", color: "blue" }}>
                        <strong>{event.rs_hour_use}</strong>
                      </span>{" "}
                      ชั่วโมง
                    </i>
                  </Alert>
                </div>
              ))}
            </div>
            <div style={{ paddingTop: "25px" }}>
              <p>
                <span style={{ color: "#3788D8" }}>
                  <i className="fa fa-square" aria-hidden="true"></i>
                </span>{" "}
                หมายถึง รายวิชาที่กำลังทำรายการ
              </p>
              <p>
                <span style={{ color: "#f5ab16" }}>
                  <i className="fa fa-square" aria-hidden="true"></i>
                </span>{" "}
                หมายถึง รายวิชาที่กำลังทำรายการโดยเครื่องอื่น
              </p>
              <p>
                <span style={{ color: "#33d406" }}>
                  <i className="fa fa-square" aria-hidden="true"></i>
                </span>{" "}
                หมายถึง รายวิชาที่ถูกบันทึก
              </p>
            </div>
          </Col>

          <Col lg={9} sm={9} md={9}>
            <div>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={"th"}
                droppable={true}
                drop={this.handleRecieve}
                editable={true}
                events={event_teacher}
                slotLabelFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  omitZeroMinute: false,
                  meridiem: "short",
                }}
                allDaySlot={false}
                validRange={{
                  start: new Date(Functions.getDaysInMonth(date_set)[0]),
                  end: new Date(Functions.getDaysInMonth(date_set)[1]),
                }}
                eventResize={this.handleUpdate}
                eventDrop={this.handleUpdate}
                eventClick={this.handleDetail}
                ref={this.calendarRef}
              />
            </div>
          </Col>
        </Row>

        {/* Form Alert  */}
        <Modal show={isOpenModalAlert} size="sm">
          <Modal.Header>
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>ไม่สามารถทำรายการนี้ได้</Modal.Body>
          <Modal.Footer>
            <Button
              variant="warning"
              onClick={() => [
                this.setState({ isOpenModalAlert: false }),
                this.getDataRegister(),
              ]}
            >
              รับทราบ
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Form Delete  */}
        <Modal show={isOpenModalDelete} size="sm">
          <Modal.Header>
            <Modal.Title>รายละเอียด</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>วิชา {title}</p>
            <p>เริ่ม {start}</p>
            <p>สิ้นสุด {end}</p>
            <p>สอนโดย {teacher}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ isOpenModalDelete: false })}
            >
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              ลบ
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
