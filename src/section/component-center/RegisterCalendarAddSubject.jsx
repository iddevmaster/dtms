import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import "../../asset/FullCanlendar.css";
const setMainRegister = Functions.getRegisterIndex(); ///ข้อมูลชั่วคราวที่ใช้ในการสมัคร
const rm_id = setMainRegister.rm_id;
const allStep = Functions.getAllStepRegister(setMainRegister.course_group);
const current_step = 1;
export default class RegisterCalendarAddSubject extends Component {
  state = {
    rs_id: "",
    course_id: setMainRegister.course_id,
    teacher_id: setMainRegister.teacher_id,

    branch_id: setMainRegister.branch_id,
    school_id: setMainRegister.school_id,
    event_teacher: [],
    data: [],
    eventDetail: "",
    eventTeacher: [],
    isOpenModalDelete: false,
    isOpenModalAlert: false,
  };
  calendarRef = React.createRef();
  refrehData = async () => {
    try {
      await axios
        .get(
          Common.API_URL +
            `register/subject_schedule_tmp/${rm_id}?teacher_id=${setMainRegister.teacher_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          // console.log(res);
          this.setState({
            event_teacher: res,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getSubject = async () => {
    try {
      await axios
        .get(Common.API_URL + `register/subject_catch/${rm_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleAddSchedue = (
    rs_start_time,
    rs_end_time,
    rm_id,
    subject_id,
    teacher_id,
    branch_id,
    school_id
  ) => {
    let start = Functions.LongDatetoShortDateISO(rs_start_time);
    let end = Functions.LongDatetoShortDateISO(rs_end_time);
    // console.log(start);
    try {
      axios
        .post(
          Common.API_URL + "register/create_schedule_tmp",
          {
            subject_learn_type: 2,
            rs_start_time: start,
            rs_end_time: end,
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
          this.refrehData();
          this.getSubject();
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
          Common.API_URL + `register/update_schedule_tmp/${rs_id}`,
          {
            rs_start_time: start,
            rs_end_time: end,
          },
          Common.options
        )
        .then((res) => {
          this.fullCalendarRefresh();
          this.refrehData();
          this.getSubject();
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
      rm_id,
      subject_id,
      this.state.teacher_id,
      this.state.branch_id,
      this.state.school_id
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
  handleDetail = (arg) => {
    let rs_id = arg.event.id;
    let title = arg.event.title;
    let start = Functions.LongDatetoShortDate(arg.event.start);
    let end = Functions.LongDatetoShortDate(arg.event.end);
    if (rs_id === "null") {
      // console.log(arg.event.id);
      return false;
    }
    this.setState({
      rs_id: rs_id,
      isOpenModalDelete: true,
      eventDetail: title + "," + start + "," + end,
    });
  };
  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `register/subject_schedule_tmp/${this.state.rs_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false });
          this.fullCalendarRefresh();
          this.refrehData();
          this.getSubject();
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
  gotoNextStepForm = () => {
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
  componentDidMount() {
    this.refrehData();
    this.drag();
    this.getSubject();
    this.fullCalendarSetDate();
  }

  render() {
    const { data } = this.state;
    const { event_teacher } = this.state;

    const { isOpenModalDelete } = this.state;
    const { isOpenModalAlert } = this.state;
    const { eventDetail } = this.state;
    const date_set = setMainRegister.dateDefault;
    let [title, start, end] = eventDetail.split(",");

    return (
      <div>
        {/* {JSON.stringify(event_teacher)} */}

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
              {data.map((event, index) => (
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

            <Form.Group className="mb-3">
              <div align="center" style={{ paddingTop: "25px" }}>
                <Button
                  variant="primary"
                  // disabled={events_register_curent.length <= 0 ? true : false}
                  onClick={this.gotoNextStepForm}
                >
                  บันทึกข้อมูลนักเรียน
                </Button>
              </div>
            </Form.Group>

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
                // selectable={true}
                // select={function (info) {
                //   alert("selected " + info.startStr + " to " + info.endStr);
                // }}
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
                this.refrehData(),
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
// https://codesandbox.io/s/vm45zwmo07?file=/src/index.js:2541-4350
// https://github.com/tamphimai007/React-Fullcalendar-CRUD
