import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DatePicker from "react-multi-date-picker";
import Alert from "react-bootstrap/Alert";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
export default class TeacherLicence extends Component {
  state = {
    tl_id: 0,
    tl_number: "",
    tl_level: 0,
    tl_date_of_expiry_staff: "",
    tl_date_of_issue: "",
    tl_date_of_expiry: "",

    vehicle_type_id: 0,
    teacher_id: this.props.teacher_id,
    branch_id: Common.getUserLoginData.branch_id,
    school_id: Common.getUserLoginData.school_id,

    isOpenModal: false,
    isOpenModalDelete: false,
    msg: "",
    data: [],
    vt: [],
  };
  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `teacher/licence/${this.state.teacher_id}`,
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
  handleSubmit = () => {
    if (
      this.state.tl_number === "" ||
      this.state.tl_level === "" ||
      this.state.tl_date_of_issue === "" ||
      this.state.tl_date_of_expiry === "" ||
      this.state.vehicle_type_id === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + "teacher/licence/create",
          {
            tl_number: this.state.tl_number,
            tl_level: this.state.tl_level,
            tl_date_of_expiry_staff: this.state.tl_date_of_expiry_staff,
            tl_date_of_issue: this.state.tl_date_of_issue,
            tl_date_of_expiry: this.state.tl_date_of_expiry,
            vehicle_type_id: this.state.vehicle_type_id,
            teacher_id: this.state.teacher_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData();
          this.clearState();
        })
        .catch((err) => {
          // Handle error
          this.setState({ msg: "ไม่สามารถเพิ่มข้อมูลซ้ำกันได้" });
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleClickEdit = (res) => {
    let r = res;
    this.setState({
      tl_id: r.tl_id,
      tl_number: r.tl_number,
      tl_level: r.tl_level,
      tl_date_of_expiry_staff: r.tl_date_of_expiry_staff,
      tl_date_of_issue: r.tl_date_of_issue,
      tl_date_of_expiry: r.tl_date_of_expiry,
      vehicle_type_id: r.vehicle_type_id,
      msg: "",
    });
  };

  handleSubmitEdit = () => {
    if (
      this.state.tl_number === "" ||
      this.state.tl_level === "" ||
      this.state.tl_date_of_issue === "" ||
      this.state.tl_date_of_expiry === "" ||
      this.state.vehicle_type_id === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL + `teacher/licence/${this.state.tl_id}`,
          {
            tl_number: this.state.tl_number,
            tl_level: this.state.tl_level,
            tl_date_of_expiry_staff: this.state.tl_date_of_expiry_staff,
            tl_date_of_issue: this.state.tl_date_of_issue,
            tl_date_of_expiry: this.state.tl_date_of_expiry,
            vehicle_type_id: this.state.vehicle_type_id,
            teacher_id: this.state.teacher_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData();
          this.clearState();
        })
        .catch((err) => {
          // Handle error
          this.setState({ msg: "ไม่สามารถเพิ่มข้อมูลซ้ำกันได้" });
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `teacher/licence/${this.state.tl_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false, tl_id: 0 });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  FormatDateIssueStaff = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ tl_date_of_expiry_staff: fulldate });
    // console.log(fulldate);
  };

  FormatDateIssue = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ tl_date_of_issue: fulldate });
    // console.log(fulldate);
  };

  FormatDateExpiry = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ tl_date_of_expiry: fulldate });
    // console.log(fulldate);
  };

  clearState = () => {
    this.setState({
      tl_id: 0,
      tl_number: "",
      tl_date_of_issue: "",
      tl_date_of_expiry: "",
      vehicle_type_id: "",
      msg: "",
    });
  };
  componentDidMount() {
    this.refreshData();
    this.getVehicleType();
  }
  render() {
    const { data } = this.state;
    const { vt } = this.state;
    const { tl_id } = this.state;
    const { tl_number } = this.state;
    const { tl_level } = this.state;
    const { tl_date_of_expiry_staff } = this.state;
    const { tl_date_of_issue } = this.state;
    const { tl_date_of_expiry } = this.state;
    const { vehicle_type_id } = this.state;

    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { msg } = this.state;
    return (
      <div>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางใบอนุญาต</Col>
              <Col sm={4}>
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
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>เลขบัตรประจำตัว</th>
                  <th>ระดับ</th>
                  <th>วันสิ้นสุดกรรมการ</th>
                  <th>วันอนุญาต</th>
                  <th>วันสิ้นสุดอายุ</th>
                  <th>ประเภทยานพาหนะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td>{rs.tl_number}</td>
                    <td align="center">{rs.tl_level}</td>
                    <td>{Functions.ymdtodmy(rs.tl_date_of_expiry_staff)}</td>
                    <td>{Functions.ymdtodmy(rs.tl_date_of_issue)}</td>
                    <td>{Functions.ymdtodmy(rs.tl_date_of_expiry)}</td>
                    <td>{Functions.vehicle_type_format(rs.vehicle_type_id)}</td>
                    <td align="center">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={(e) => [
                          this.setState({
                            isOpenModal: true,
                          }),
                          this.handleClickEdit(rs),
                        ]}
                      >
                        แก้ไข
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) =>
                          this.setState({
                            isOpenModalDelete: true,
                            tl_id: rs.tl_id,
                          })
                        }
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={isOpenModal} size="sm">
          <Modal.Header>
            <Modal.Title>ใบอนุญาต</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group>
              <Form.Label>เลขบัตรประจำตัว</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => this.setState({ tl_number: e.target.value })}
                defaultValue={tl_number}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ระดับ</Form.Label>
              <Form.Select
                onChange={(e) => this.setState({ tl_level: e.target.value })}
                defaultValue={tl_level}
              >
                <option>--เลือกระดับ--</option>
                <option value="1">ระดับ 1</option>
                <option value="2">ระดับ 2</option>
                <option value="3">ระดับ 3</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>วันสิ้นสุดกรรมการ</Form.Label>
              <DatePicker
                calendar={thai}
                locale={thai_th}
                style={{ height: "40px", width: "100%" }}
                containerStyle={{
                  width: "100%",
                }}
                onChange={(e) => this.FormatDateIssueStaff(e)}
                value={tl_date_of_expiry_staff}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>วันอนุญาต</Form.Label>
              <DatePicker
                calendar={thai}
                locale={thai_th}
                style={{ height: "40px", width: "100%" }}
                containerStyle={{
                  width: "100%",
                }}
                onChange={(e) => this.FormatDateIssue(e)}
                value={tl_date_of_issue}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>วันสิ้นสุดอายุ</Form.Label>
              <DatePicker
                calendar={thai}
                locale={thai_th}
                style={{ height: "40px", width: "100%" }}
                containerStyle={{
                  width: "100%",
                }}
                onChange={(e) => this.FormatDateExpiry(e)}
                value={tl_date_of_expiry}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>ประเภทยานพาหนะ</Form.Label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ vehicle_type_id: e.target.value })
                }
                defaultValue={vehicle_type_id}
              >
                <option value="0">--ประเภทยานพาหนะ--</option>
                {vt.map((rs, index) => (
                  <option value={rs.vehicle_type_id} key={index}>
                    {rs.vehicle_type_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModal: false })}
            >
              ยกเลิก
            </Button>
            <Button
              variant="success"
              onClick={tl_id === 0 ? this.handleSubmit : this.handleSubmitEdit}
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
      </div>
    );
  }
}
