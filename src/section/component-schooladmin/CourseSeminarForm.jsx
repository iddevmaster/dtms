import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import Select from "react-select";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const timeList = Functions.time_list();
const school_id = Common.getUserLoginData.school_id;
export default class CourseSeminarForm extends Component {
  state = {
    course_id: this.props.course_id,
    data: [],
    teacherObj: [],
    branch: [],
    // branch_id: Common.getUserLoginData.branch_id,
    branch_id: "",
    subject_learn_type: 1, //วิชาทฤษฎี
    isOpenModal: false,
    //
    setPost: [],
    // Form Data
    subject_id: 0,
    seminar_start_time: "",
    seminar_end_time: "",
    seminar_date_Obj: [],
    teacher_id: "",
    cd: [],

    list_branch: [],
    defaultBranch: {
      value: "",
      label: "สาขา",
    },
  };
  clearState = async () => {
    await new Promise((accept) =>
      this.setState(
        {
          subject_id: 0,
          seminar_start_time: "",
          seminar_end_time: "",
          seminar_date_Obj: [],
          teacher_id: "",
        },
        accept
      )
    );
  };
  setSubjectid = async (subject_id) => {
    await new Promise((accept) =>
      this.setState(
        {
          subject_id: subject_id,
        },
        accept
      )
    );

    // console.log(subject_id);
    this.prepare();
  };

  setDate = async (subject_id, value) => {
    let count = value.length;
    let obj = [];
    for (let i = 0; i < count; i++) {
      let year = value[i]["year"];
      let month = value[i]["month"]["number"];
      let day = value[i]["day"];
      let fulldate = year + "-" + month + "-" + day;
      obj.push(fulldate);
    }
    // console.log(value[0]["day"]);

    // console.log(obj);
    await new Promise((accept) =>
      this.setState(
        {
          subject_id: subject_id,
          seminar_date_Obj: obj,
        },
        accept
      )
    );

    this.prepare();
  };
  setTeacherid = async (subject_id, teacher_id) => {
    await new Promise((accept) =>
      this.setState(
        {
          subject_id: subject_id,
          teacher_id: teacher_id,
        },
        accept
      )
    );

    this.prepare();
  };

  prepare = () => {
    const { subject_id } = this.state;
    const { seminar_start_time } = this.state;
    const { seminar_end_time } = this.state;
    const { seminar_date_Obj } = this.state;

    const { teacher_id } = this.state;
    this.useData(
      subject_id,
      teacher_id,
      seminar_start_time,
      seminar_end_time,
      seminar_date_Obj
    );
  };
  useData = async (
    subject_id,
    teacher_id,
    seminar_start_time,
    seminar_end_time,
    seminar_date_Obj
  ) => {
    const { setPost } = this.state;
    // Delete subject_id ก่อนหน้านี้ออก
    var filtered = setPost.filter(function (item) {
      return item.subject_id !== subject_id;
    });
    const arr = {
      seminar_start_time: seminar_start_time,
      seminar_end_time: seminar_end_time,
      subject_id: subject_id,
      course_id: this.state.course_id,
      teacher_id: teacher_id,
      branch_id: this.state.branch_id,
      school_id: school_id,
      seminar_date_Obj: seminar_date_Obj,
    };
    filtered.push(arr);

    // console.log(JSON.stringify(filtered));
    await new Promise((accept) =>
      this.setState(
        {
          setPost: filtered,
        },
        accept
      )
    );
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `course/s/list/${this.state.course_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getTeacher = async () => {
    try {
      await axios
        .post(
          Common.API_URL +
            `teacher/${school_id}/all?branch_id=${this.state.branch_id}`,
          {
            page: 1,
            per_page: 125,
            search_value: "",
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ teacherObj: res.data });
        });
    } catch (error) {
      console.log(error);
    }
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
    // console.log(branch_id);
    await new Promise((accept) =>
      this.setState(
        {
          branch_id: e.value,
          defaultBranch: e,
        },
        accept
      )
    );
    this.getTeacher();
  };

  Enable = (index) => {
    let Teacher = document.getElementById("Teacher_" + index);
    let StartTime = document.getElementById("StartTime_" + index);

    if (Teacher.disabled === true) {
      Teacher.disabled = false;
    } else {
      Teacher.disabled = true;
    }
    if (StartTime.disabled === true) {
      StartTime.disabled = false;
    } else {
      StartTime.disabled = true;
    }

    // console.log(a);
  };

  check = async (index, subject_id) => {
    const { setPost } = this.state;
    var checkBox = document.getElementById("custom-switch-" + index).checked;
    // ถ้า Uncheck เมื่อไร ก็ลบ subject id ออกจาก  setPost นั้นทิ้ง
    if (checkBox === false) {
      var filtered = setPost.filter(function (item) {
        return item.subject_id !== subject_id;
      });
      //Set ค่าว่างทั้งหมด
      document.getElementById("Teacher_" + index).value = "";
      document.getElementById("StartTime_" + index).value = "";

      await new Promise((accept) =>
        this.setState(
          {
            setPost: filtered,
          },
          accept
        )
      );
    } else {
      // console.log(checkBox);
      await new Promise((accept) =>
        this.setState(
          {
            seminar_seminar_date_Obj: [],
          },
          accept
        )
      );
    }
  };

  handleSubmit = () => {
    if (this.state.branch_id === "" || this.state.branch_id === 0) {
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "course/seminar/create_multiple",
          this.state.setPost,
          Common.options
        )
        .then((res) => {
          window.location = "/course/seminar/" + this.state.course_id;
        })
        .catch((err) => {
          // Handle error
          this.setState({ isOpenModal: true });
          // console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  TimeAdd = async (time_id, hour_value, result_id, subject_id_value) => {
    const subject_id = subject_id_value;
    var t = document.getElementById(time_id).value;

    var r = Functions.add_hour(t, hour_value);
    // console.log(r);

    await new Promise((accept) =>
      this.setState(
        {
          seminar_start_time: t,
          seminar_end_time: r,
          subject_id: subject_id,
        },
        accept
      )
    );

    this.prepare();
    document.getElementById(result_id).innerHTML = r.slice(0, -3);
  };

  componentDidMount() {
    this.getTeacher();
    this.getBranch("");
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    const { teacherObj } = this.state;

    const { isOpenModal } = this.state;
    const { setPost } = this.state;
    const { defaultBranch } = this.state;
    const { list_branch } = this.state;
    return (
      <div>
        {/* {JSON.stringify(setPost)} */}

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางรายวิชา</Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col sm={10}>จำนวนข้อมูล {data.length} เรคคอร์ด</Col>
              <Col sm={2}>
                <Select
                  options={list_branch}
                  onInputChange={this.getBranch}
                  onChange={this.setBranch_id}
                  value={defaultBranch}
                  cacheOptions
                />
              </Col>
            </Row>

            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>รายวิชา</th>
                  <th>ครู</th>
                  <th>เวลาเริ่มต้น</th>
                  <th>+ ชั่วโมงที่เรียน</th>
                  <th>เวลาสิ้นสุด</th>

                  <th>ปฏิทิน (เลือกได้หลายวัน)</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((x) => x.subject_learn_type === 1)
                  .map((rs, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`custom-switch-${index}`}
                          onChange={() => [
                            this.Enable(index),
                            this.check(index, rs.subject_id),
                          ]}
                        />
                      </td>
                      <td>
                        {rs.subject_coursewithsubject.subject_code}{" "}
                        {rs.subject_coursewithsubject.subject_name}
                      </td>
                      <td>
                        <Form.Select
                          onChange={(e) =>
                            this.setTeacherid(rs.subject_id, e.target.value)
                          }
                          disabled
                          id={`Teacher_${index}`}
                        >
                          <option value="">--เลือกครู--</option>
                          {teacherObj
                            .filter((x) => x.active === 1)
                            .map((rs, index) => (
                              <option value={rs.teacher_id} key={index}>
                                {rs.teacher_firstname} {rs.teacher_lastname}
                              </option>
                            ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          onChange={() =>
                            this.TimeAdd(
                              `StartTime_${index}`,
                              rs.learn_time,
                              `rhour_${index}`,
                              rs.subject_id
                            )
                          }
                          id={`StartTime_${index}`}
                          disabled
                        >
                          <option value="">--เลือกเวลา--</option>
                          {timeList.map((value, index) => (
                            <option value={value} key={index}>
                              {value.slice(0, -3)}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td align="center">
                        <h4 style={{ color: "blue" }}>{rs.learn_time}</h4>
                      </td>
                      <td align="center">
                        <h4 style={{ color: "red" }}>
                          <span id={`rhour_${index}`}>00:00</span>
                        </h4>
                      </td>

                      <td>
                        <DatePicker
                          multiple
                          calendar={thai}
                          locale={thai_th}
                          plugins={[<DatePanel header="วันที่อบรม" />]}
                          onChange={(e) => this.setDate(rs.subject_id, e)}
                          id={`Date_${index}`}
                          disabled={
                            setPost.find(
                              (el) => el.subject_id === rs.subject_id
                            ) === undefined
                              ? true
                              : false
                          }
                          style={{ height: "35px" }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <div style={{ padding: "25px" }} align="center">
          <Button
            variant="warning"
            size="lg"
            onClick={this.handleSubmit}
            disabled={setPost.length <= 0 ? true : false}
          >
            บันทึก
          </Button>
        </div>
        <Modal show={isOpenModal} size="sm">
          <Modal.Header>
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>กรุณาระบุข้อมูลให้ครบและถูกต้อง!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModal: false })}
            >
              ตกลง
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
