import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Functions from "../../functions";
import Common from "../../common";
import Select from "react-select";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const customSelectStyles = Common.customSelectStyles;
const d = new Date();
const c = d.getMonth() + 1 + "/" + d.getFullYear();
const timeList = Functions.time_list();
const school_id = Common.getUserLoginData.school_id;
export default class CourseSeminarList extends Component {
  state = {
    seminar_id: 0,
    seminar_start_time: "",
    seminar_end_time: "",
    seminar_hour: 0,
    seminar_date: "",
    seminar_ready: 0,
    active: 1,
    subject_id: 0,
    course_id: this.props.course_id,
    teacher_id: "",
    branch_id: "all",
    branch: [],
    data: [],
    vt: [],
    page: 1,
    search_value: "",
    param: [],
    isOpenModal: false,
    isOpenModalDelete: false,
    isOpenModalConfirm: false,
    present_month: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    present_year: d.getFullYear(),

    list_branch: [],
    defaultBranch: {
      value: "",
      label: "สาขา",
    },
  };

  refreshData = async () => {
    // branch_id=0 หมายถึง สาขาทั้งหมดภายในโรงเรียน
    try {
      await axios
        .get(
          Common.API_URL +
            `course/seminar/${school_id}/${this.state.course_id}?month=${this.state.present_month}&year=${this.state.present_year}&branch_id=${this.state.branch_id}`,
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

  handleClickEdit = (res, seminar_ready) => {
    let r = res;
    this.setState({
      seminar_id: r.seminar_id,
      seminar_start_time: r.seminar_start_time,
      seminar_end_time: r.seminar_end_time,
      seminar_hour: r.seminar_hour,
      seminar_date: r.seminar_date,
      seminar_ready: seminar_ready,
      active: r.active,
      subject_id: r.subject_id,
      course_id: r.course_id,
      teacher_id: r.teacher_id,
      branch_id: r.branch_id,
    });
  };

  handleSubmitEdit = () => {
    try {
      axios
        .put(
          Common.API_URL + `course/seminar/${this.state.seminar_id}`,
          {
            seminar_start_time: this.state.seminar_start_time,
            seminar_end_time: this.state.seminar_end_time,
            seminar_date: this.state.seminar_date,
            seminar_ready: this.state.seminar_ready,
            active: this.state.active,
            subject_id: this.state.subject_id,
            course_id: this.state.course_id,
            teacher_id: this.state.teacher_id,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `course/seminar/${this.state.seminar_id}`,
          Common.options
        )
        .then((res) => {
          this.clearState();
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
    this.refreshData();
  };

  clearState = async () => {
    await new Promise((accept) =>
      this.setState(
        {
          seminar_id: 0,
          seminar_start_time: "",
          seminar_end_time: "",
          seminar_date: "",
          seminar_ready: 0,
          subject_id: 0,
          teacher_id: "",
          branch_id: "all",
          isOpenModal: false,
          isOpenModalDelete: false,
          isOpenModalConfirm: false,
        },
        accept
      )
    );

    this.refreshData();
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

    document.getElementById(result_id).innerHTML = r.slice(0, -3);
  };

  FormatDate = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ seminar_date: fulldate });
    // console.log(fulldate);
  };

  setMonthFilter = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;

    await new Promise((accept) =>
      this.setState(
        {
          present_month: getmonth,
          present_year: getyear,
        },
        accept
      )
    );

    this.refreshData();
  };
  onChangeFilter = () => {
    // search_value
    this.refreshData();
  };
  onSelecVehicleType = async (e) => {
    await new Promise((accept) =>
      this.setState(
        {
          course_id: e.target.value,
        },
        accept
      )
    );
    this.refreshData();
  };

  openFilterAdvance = () => {
    this.getBranch();
    this.setState({ isOpenModalFilter: true });
  };

  componentDidMount() {
    this.refreshData();
    this.getBranch("");
  }

  render() {
    const { data } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { isOpenModalConfirm } = this.state;
    const { seminar_start_time } = this.state;
    const { seminar_end_time } = this.state;
    const { seminar_hour } = this.state;
    const { seminar_date } = this.state;
    const { subject_id } = this.state;

    const { defaultBranch } = this.state;
    const { list_branch } = this.state;
    return (
      <div>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={10}>ตารางรายวิชาอบรม</Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg="3" sm="6">
                <Select
                  options={list_branch}
                  onInputChange={this.getBranch}
                  styles={customSelectStyles}
                  onChange={this.setBranch_id}
                  value={defaultBranch}
                  cacheOptions
                />
              </Col>
              <Col>
                <DatePicker
                  onlyMonthPicker
                  calendar={thai}
                  locale={thai_th}
                  style={{ height: "45px" }}
                  onChange={(e) => this.setMonthFilter(e)}
                  placeholder={c}
                />
              </Col>
            </Row>

            <Table striped>
              <thead>
                <tr>
                  <th>วันที่อบรม</th>
                  <th>เวลา</th>
                  <th>ชั่วโมงอบรม</th>
                  <th>รายวิชา</th>
                  <th>วิทยากร</th>
                  <th>ความพร้อม</th>
                  <th>สาขา</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
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
                      {rs.teacher_seminar.teacher_lastname}{" "}
                    </td>
                    <td align="center">
                      {rs.seminar_ready > 0 && <i className="fa fa-check"></i>}
                    </td>
                    <td>{rs.branch_seminar.branch_name} </td>
                    <td>
                      <ButtonGroup>
                        <DropdownButton
                          title="จัดการ"
                          id="bg-nested-dropdown"
                          variant="warning"
                          disabled={rs.seminar_ready > 0 ? true : false}
                        >
                          <Dropdown.Item
                            eventKey="2"
                            onClick={(e) => [
                              this.setState({
                                isOpenModal: true,
                              }),
                              this.handleClickEdit(rs, rs.seminar_ready),
                            ]}
                          >
                            เปลี่ยนวันอบรม
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={(e) => [
                              this.setState({
                                isOpenModalConfirm: true,
                              }),
                              this.handleClickEdit(rs, 1),
                            ]}
                          >
                            ยืนยันการใช้
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={(e) =>
                              this.setState({
                                isOpenModalDelete: true,
                                seminar_id: rs.seminar_id,
                              })
                            }
                          >
                            ลบ
                          </Dropdown.Item>
                        </DropdownButton>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={isOpenModal} size="sm">
          <Modal.Header>
            <Modal.Title>เปลี่ยนวันอบรม</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>เวลาเริ่มต้น + {seminar_hour} ชั่วโมง</Form.Label>
              <Form.Select
                defaultValue={seminar_start_time}
                id="StartTime"
                onChange={() =>
                  this.TimeAdd("StartTime", seminar_hour, "SumHour", subject_id)
                }
              >
                <option value="">--เลือกเวลา--</option>
                {timeList.map((value, index) => (
                  <option value={value} key={index}>
                    {value.slice(0, -3)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <p>เวลาสิ้นสุด</p>
              <h4>
                <span id="SumHour">{seminar_end_time.slice(0, -3)}</span>
              </h4>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>วันที่อบรม</Form.Label>

              <DatePicker
                calendar={thai}
                locale={thai_th}
                style={{ height: "35px", width: "100%" }}
                containerStyle={{
                  width: "100%",
                }}
                value={seminar_date}
                onChange={(e) => this.FormatDate(e)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModal: false })}
            >
              ยกเลิก
            </Button>
            <Button onClick={this.handleSubmitEdit}>บันทึก</Button>
          </Modal.Footer>
        </Modal>
        {/* Form Delete Subject */}
        <Modal show={isOpenModalDelete} size="sm">
          <Modal.Header>
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>ยืนยันการลบหรือไม่ !</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModalDelete: false })}
            >
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              ลบ
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Confirm */}
        <Modal show={isOpenModalConfirm} size="sm">
          <Modal.Header>
            <Modal.Title>คำชี้แจง</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ยืนยันการ หมายถึง การนำข้อมูลไปใช้กับการสมัครเรียน
            เมื่อยืนยันแล้วจะไม่สามารถกลับมาแก้ไขได้ ต้องการทำรายการหรือไม่ ?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModalConfirm: false })}
            >
              ยกเลิก
            </Button>
            <Button variant="info" onClick={this.handleSubmitEdit}>
              ยืนยัน
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
