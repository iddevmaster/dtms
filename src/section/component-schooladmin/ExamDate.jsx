import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";

import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
import Select from "react-select";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
const customSelectStyles = Common.customSelectStyles;
const d = new Date();
const c = d.getMonth() + 1 + "/" + d.getFullYear();
const timeList = Functions.time_list();
const school_id = Common.getUserLoginData.school_id;
export default class ExamDate extends Component {
  state = {
    ed_id: 0,
    ed_start_time: "",
    ed_end_time: "",
    ed_hour: 0,
    ed_date: "",
    ed_ready: 0,
    ed_code: Functions.randomCode(),
    active: 1,
    vehicle_type_id: 0,

    branch_id: "all",
    edd_id: 0,
    staff_exam_type: 0,
    teacher_id: "",

    isOpenModal: false,
    isOpenModalDelete: false,
    isOpenModalConfirm: false,
    msg: "",
    data: [],
    data2: [],
    branch: [],
    tc: [],
    vt: [],

    present_month: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    present_year: d.getFullYear(),

    list_branch: [],
    defaultBranch: {
      value: "",
      label: "สาขา",
    },
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL +
            `course/examdate/${school_id}?vehicle_type_id=${this.state.vehicle_type_id}&month=${this.state.present_month}&year=${this.state.present_year}&branch_id=${this.state.branch_id}`,
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

  refreshDataDT = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `course/examdate/director/${this.state.ed_code}`,

          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data2: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getTeacher = async () => {
    // ถ้าเลือกประธาน  tl_level จะต้องกำหนด เป็นค่า 3 เพราะหมายถึงระดับ 3 เท่านั้นถึงจะเป็นประธานได้
    let tl_level;
    if (this.state.staff_exam_type.toString() === "1") {
      tl_level = 3;
    } else if (this.state.staff_exam_type.toString() === "2") {
      tl_level = 2;
    } else {
      tl_level = 1;
    }
    // console.log(tl_level);
    try {
      await axios
        .get(
          Common.API_URL +
            `teacher/licence/${school_id}/all?branch_id=${this.state.branch_id}&tl_level=${tl_level}&vehicle_type_id=${this.state.vehicle_type_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ tc: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getVehicleType = async () => {
    try {
      await axios
        .get(Common.API_URL + "masterdata/vehicle_type")
        .then((response) => {
          let res = response.data;
          this.setState({ vt: res });
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
    // this.refreshData();
    this.getTeacher();
  };

  setStaff_exam_type = async (e) => {
    await new Promise((accept) =>
      this.setState(
        {
          staff_exam_type: e.target.value,
        },
        accept
      )
    );
    this.getTeacher();
  };

  FormatDate = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ ed_date: fulldate });
    // console.log(fulldate);
  };

  handleSubmit = async () => {
    if (
      this.state.ed_start_time === "" ||
      this.state.ed_end_time === "" ||
      this.state.ed_date === "" ||
      this.state.vehicle_type_id === 0
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + "course/examdate/create",
          {
            ed_start_time: this.state.ed_start_time,
            ed_end_time: this.state.ed_end_time,
            ed_date: this.state.ed_date,
            ed_ready: this.state.ed_ready,
            ed_code: this.state.ed_code,
            active: this.state.active,
            vehicle_type_id: this.state.vehicle_type_id,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.setState({ isOpenModal: false });
        })
        .catch((err) => {
          // Handle error
          this.setState({ msg: "กรุณาเพิ่มประธานหรือกรรมการ !" });
          //   console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleClickEdit = async (res, ed_ready) => {
    let r = res;
    await new Promise((accept) =>
      this.setState(
        {
          ed_id: r.ed_id,
          ed_start_time: r.ed_start_time,
          ed_end_time: r.ed_end_time,
          ed_hour: r.ed_hour,
          ed_date: r.ed_date,
          ed_code: r.ed_code,
          ed_ready: ed_ready,
          ed_status: r.ed_status,
          active: r.active,
          vehicle_type_id: r.vehicle_type_id,
          branch_id: r.branch_id,
          defaultBranch: {
            value: r.branch_id,
            label: r.branch_examdate.branch_name,
          },
        },
        accept
      )
    );
    this.getTeacher();
    this.refreshDataDT();
  };

  handleSubmitEdit = () => {
    if (
      this.state.ed_start_time === "" ||
      this.state.ed_end_time === "" ||
      this.state.ed_date === "" ||
      this.state.vehicle_type_id === 0
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `course/examdate/${this.state.ed_id}`,
          {
            ed_start_time: this.state.ed_start_time,
            ed_end_time: this.state.ed_end_time,
            ed_date: this.state.ed_date,
            ed_ready: this.state.ed_ready,
            ed_code: this.state.ed_code,
            active: this.state.active,
            vehicle_type_id: this.state.vehicle_type_id,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.setState({ isOpenModal: false, isOpenModalConfirm: false });
        })
        .catch((err) => {
          this.setState({ msg: "กรุณาเพิ่มประธานหรือกรรมการ !" });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmitDt = async () => {
    try {
      axios
        .post(
          Common.API_URL + "course/examdate/director/create",
          {
            ed_code: this.state.ed_code,
            staff_exam_type: this.state.staff_exam_type,
            teacher_id: this.state.teacher_id,
          },
          Common.options
        )
        .then((res) => {
          this.refreshDataDT();
        })
        .catch((err) => {
          this.setState({ msg: "ไม่สามารถเพิ่มข้อมูลซ้ำกันได้" });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `course/examdate/${this.state.ed_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false, ed_id: 0 });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleDeleteDT = (edd_id) => {
    if (!window.confirm("ลบข้อมูลนี้หรือไม่ ?")) {
      return;
    }
    try {
      axios
        .delete(
          Common.API_URL + `course/examdate/director/${edd_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ teacher_id: "", staff_exam_type: 0 });
          this.refreshDataDT();
        });
    } catch (error) {
      console.log(error);
    }
  };

  clearState = async () => {
    await new Promise((accept) =>
      this.setState(
        {
          ed_id: 0,
          ed_start_time: "",
          ed_end_time: "",
          ed_date: "",
          ed_ready: 0,
          staff_exam_type: 0,
          vehicle_type_id: 0,
          teacher_id: "",
          branch_id: "all",
          msg: "",
          defaultBranch: {
            value: "",
            label: "สาขา",
          },
        },
        accept
      )
    );
    this.refreshData();
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
    this.refreshData();
  };
  openFilterAdvance = () => {
    this.setState({ isOpenModalFilter: true });
  };

  onSelecVehicleType = async (e) => {
    await new Promise((accept) =>
      this.setState(
        {
          vehicle_type_id: e.target.value,
        },
        accept
      )
    );
    this.refreshData();
  };

  TimeDifference = (start, end, result) => {
    var s = document.getElementById(start).value;
    var e = document.getElementById(end).value;

    var r = Functions.time_diff(s, e);
    var setformat = isNaN(r) ? 0 : r;
    //กรณีที่ เวลาเริ่มต้นมากกว่า เวลาสิ้นสุด
    if (Functions.timetotimestamp(s) >= Functions.timetotimestamp(e)) {
      document.getElementById(start).value = "";
      document.getElementById(end).value = "";
      //   document.getElementById(result).innerHTML = 0;
      document.getElementById(result).value = 0;
      this.setState({ isOpenModal: true });
    } else {
      document.getElementById(result).value = setformat;
    }
  };

  componentDidMount() {
    this.refreshData();
    this.getBranch("");
    this.getVehicleType();
  }

  render() {
    const {
      ed_id,
      ed_start_time,
      ed_hour,
      ed_end_time,
      ed_date,
      ed_ready,
      teacher_id,
      staff_exam_type,
      vehicle_type_id,
      data,
      data2,
      isOpenModal,
      isOpenModalDelete,
      isOpenModalConfirm,
      vt,
      tc,
      msg,
      defaultBranch,
      list_branch,
    } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>วันสอบใบอนุญาต</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>วันสอบใบอนุญาต</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={10}>ตารางวันสอบใบอนุญาต</Col>
              <Col>
                <div align="right">
                  <Button
                    onClick={() => [
                      this.setState({
                        isOpenModal: true,
                      }),
                      this.clearState(),
                    ]}
                  >
                    เพิ่มข้อมูล
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xs lg="3">
                <Select
                  options={list_branch}
                  onInputChange={this.getBranch}
                  styles={customSelectStyles}
                  onChange={this.setBranch_id}
                  value={defaultBranch}
                  cacheOptions
                />
              </Col>
              <Col xs lg="3">
                <Form.Select
                  onChange={(e) => this.onSelecVehicleType(e)}
                  size="lg"
                >
                  <option value="0">--ประเภทยานพาหนะ--</option>
                  {vt.map((rs, index) => (
                    <option value={rs.vehicle_type_id} key={index}>
                      {rs.vehicle_type_name}
                    </option>
                  ))}
                </Form.Select>
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
                  <th>วันสอบ</th>
                  <th>เวลาเริ่มต้น</th>
                  <th>เวลาสิ้นสุด</th>
                  <th>ชั่วโมงการสอบ</th>
                  <th>ประเภทยานพาหนะ</th>
                  <th>ความพร้อม</th>
                  <th>สาขา</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{Functions.ymdtodmy(rs.ed_date)}</td>
                    <td align="center">{rs.ed_start_time.slice(0, -3)}</td>
                    <td align="center">{rs.ed_end_time.slice(0, -3)}</td>
                    <td align="center">{rs.ed_hour}</td>
                    <td>{Functions.vehicle_type[rs.vehicle_type_id - 1]}</td>
                    <td align="center">
                      {rs.ed_ready > 0 && <i className="fa fa-check"></i>}
                    </td>
                    <td>{rs.branch_examdate.branch_name}</td>
                    <td>
                      <ButtonGroup>
                        <DropdownButton
                          title="จัดการ"
                          id="bg-nested-dropdown"
                          variant="warning"
                        >
                          <Dropdown.Item
                            eventKey="2"
                            onClick={(e) => [
                              this.setState({
                                isOpenModal: true,
                              }),
                              this.handleClickEdit(rs, rs.ed_ready),
                            ]}
                          >
                            แก้ไข
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={(e) => [
                              this.setState({
                                isOpenModalConfirm: true,
                              }),
                              this.handleClickEdit(rs, 1),
                            ]}
                            disabled={rs.ed_ready > 0 ? true : false}
                          >
                            ยืนยันการใช้
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={(e) =>
                              this.setState({
                                isOpenModalDelete: true,
                                ed_id: rs.ed_id,
                              })
                            }
                            disabled={rs.ed_ready > 0 ? true : false}
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

        <Modal show={isOpenModal} size="lg">
          <Modal.Header>
            <Modal.Title>กำหนดวันสอบ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Select
                    options={list_branch}
                    onInputChange={this.getBranch}
                    onChange={this.setBranch_id}
                    value={defaultBranch}
                    cacheOptions
                    isDisabled={ed_ready > 0 ? true : false}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ประเภทยานพาหนะ</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Select
                    onChange={(e) =>
                      this.setState({ vehicle_type_id: e.target.value })
                    }
                    defaultValue={vehicle_type_id}
                    disabled={ed_ready > 0 ? true : false}
                  >
                    <option value="">--เลือกข้อมูล--</option>
                    {vt.map((rs, index) => (
                      <option value={rs.vehicle_type_id} key={index}>
                        {rs.vehicle_type_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>วันสอบ</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <DatePicker
                    calendar={thai}
                    locale={thai_th}
                    style={{ height: "40px", width: "100%" }}
                    containerStyle={{
                      width: "100%",
                    }}
                    onChange={(e) => this.FormatDate(e)}
                    value={ed_date}
                    disabled={ed_ready > 0 ? true : false}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>เวลาเริ่มต้น</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Select
                    onChange={(e) => [
                      this.setState({ ed_start_time: e.target.value }),
                      this.TimeDifference("StartTime", "EndTime", "SumHour"),
                    ]}
                    defaultValue={ed_start_time}
                    id="StartTime"
                    disabled={ed_ready > 0 ? true : false}
                  >
                    <option value="">--เลือกเวลา--</option>
                    {timeList.map((value, index) => (
                      <option value={value} key={index}>
                        {value.slice(0, -3)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>เวลาสิ้นสุด</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Select
                    onChange={(e) => [
                      this.setState({ ed_end_time: e.target.value }),
                      this.TimeDifference("StartTime", "EndTime", "SumHour"),
                    ]}
                    defaultValue={ed_end_time}
                    id="EndTime"
                    disabled={ed_ready > 0 ? true : false}
                  >
                    <option value="">--เลือกเวลา--</option>
                    {timeList.map((value, index) => (
                      <option value={value} key={index}>
                        {value.slice(0, -3)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>รวมเวลา (ชั่วโมง)</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    readOnly
                    id="SumHour"
                    defaultValue={ed_hour}
                    disabled={ed_ready > 0 ? true : false}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Table striped>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>
                    <Form.Select
                      defaultValue={staff_exam_type}
                      onChange={this.setStaff_exam_type}
                      disabled={ed_ready > 0 ? true : false}
                    >
                      <option value="0">--เลือกประธาน / กรรมการ--</option>
                      <option value="1">ประธาน</option>
                      <option value="2">กรรมการ</option>
                    </Form.Select>
                  </th>
                  <th>
                    <Form.Select
                      value={teacher_id}
                      onChange={(e) =>
                        this.setState({ teacher_id: e.target.value })
                      }
                      disabled={
                        staff_exam_type === 0 || vehicle_type_id === 0
                          ? true
                          : false
                      }
                    >
                      <option value="">--เลือกครู--</option>
                      {tc.map((rs, index) => (
                        <option value={rs.teacher_id} key={index}>
                          {rs.teacher_firstname} {rs.teacher_lastname}
                        </option>
                      ))}
                    </Form.Select>
                  </th>
                  <th>
                    <Button
                      variant="info"
                      type="button"
                      onClick={this.handleSubmitDt}
                      disabled={ed_ready > 0 ? true : false}
                    >
                      เพิ่ม
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data2.map((rs, index) => (
                  <tr key={index}>
                    <td>{Functions.staff_exam_type[rs.staff_exam_type - 1]}</td>
                    <td>
                      {rs.teacher_examdate_dt.teacher_firstname}{" "}
                      {rs.teacher_examdate_dt.teacher_lastname}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        type="button"
                        size="sm"
                        onClick={() => [this.handleDeleteDT(rs.edd_id)]}
                        disabled={ed_ready > 0 ? true : false}
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                this.setState({
                  isOpenModal: false,
                })
              }
            >
              ปิดหน้าต่างนี้
            </Button>

            <Button
              variant="primary"
              type="button"
              onClick={ed_id === 0 ? this.handleSubmit : this.handleSubmitEdit}
              disabled={ed_ready > 0 ? true : false}
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Form Delete  */}
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
