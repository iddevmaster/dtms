import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
const unit_type = Functions.unit_type;
const subject_learn_type_list = Functions.subject_learn_type;
const amount_type = Functions.amount_type;
export default class TeacherLicence extends Component {
  state = {
    ti_id: 0,
    ti_amount: 0,
    ti_amount_type: 0,
    ti_unit: 1,
    ti_unit_type: 0,
    subject_learn_type: 0,
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
          Common.API_URL + `teacher/income/${this.state.teacher_id}`,
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
  setAmount_type = (e) => {
    this.setState({ ti_amount_type: e.target.value, subject_learn_type: 0 });
  };

  handleSubmit = () => {
    if (this.state.ti_amount === 0 || this.state.ti_amount_type === 0) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    if (this.state.ti_amount_type !== "4") {
      if (
        this.state.ti_amount === 0 ||
        this.state.ti_unit_type === 0 ||
        this.state.subject_learn_type === 0
      ) {
        this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
        return false;
      }
    }

    try {
      axios
        .post(
          Common.API_URL + "teacher/income/create",
          {
            ti_amount: this.state.ti_amount,
            ti_amount_type: this.state.ti_amount_type,
            ti_unit: this.state.ti_unit,
            ti_unit_type: this.state.ti_unit_type,
            subject_learn_type: this.state.subject_learn_type,
            vehicle_type_id: this.state.vehicle_type_id,
            teacher_id: this.state.teacher_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.clearState();
          this.refreshData();
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
      ti_id: r.ti_id,
      ti_amount: r.ti_amount,
      ti_amount_type: r.ti_amount_type,
      ti_unit: r.ti_unit,
      ti_unit_type: r.ti_unit_type,
      subject_learn_type: r.subject_learn_type,
      vehicle_type_id: r.vehicle_type_id,
      msg: "",
      isOpenModal: true,
    });
  };
  handleSubmitEdit = () => {
    if (this.state.ti_amount === 0 || this.state.ti_amount_type === 0) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    if (this.state.ti_amount_type !== "4") {
      if (
        this.state.ti_amount === 0 ||
        this.state.ti_unit_type === 0 ||
        this.state.subject_learn_type === 0
      ) {
        this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
        return false;
      }
    }
    try {
      axios
        .put(
          Common.API_URL + `teacher/income/${this.state.ti_id}`,
          {
            ti_amount: this.state.ti_amount,
            ti_amount_type: this.state.ti_amount_type,
            ti_unit: this.state.ti_unit,
            ti_unit_type: this.state.ti_unit_type,
            subject_learn_type: this.state.subject_learn_type,
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
          Common.API_URL + `teacher/income/${this.state.ti_id}`,
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

  clearState = () => {
    this.setState({
      ti_id: 0,
      ti_amount: 0,
      ti_amount_type: 0,
      ti_unit: 1,
      ti_unit_type: 0,
      subject_learn_type: 0,
      vehicle_type_id: 0,
      msg: "",
    });
  };
  componentDidMount() {
    this.refreshData();
    this.getVehicleType();
  }
  render() {
    const { ti_id } = this.state;
    const { ti_amount } = this.state;
    const { ti_amount_type } = this.state;
    // const { ti_unit } = this.state;
    const { ti_unit_type } = this.state;
    const { subject_learn_type } = this.state;
    const { vehicle_type_id } = this.state;

    const { data } = this.state;
    const { vt } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { msg } = this.state;
    return (
      <div>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางค่าตอบแทน</Col>
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
                  <th>ค่าตอบแทน</th>
                  <th>หน่วยการจ่าย</th>
                  <th>ประเภทค่าตอบแทน</th>
                  <th>ประเภทการเรียน</th>
                  <th>ประเภทยานพาหนะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="right">
                      {Functions.formatnumberWithcomma(rs.ti_amount)}
                    </td>

                    <td align="center">
                      {Functions.unit_type[rs.ti_unit_type - 1]}
                    </td>
                    <td align="center">
                      {Functions.amount_type[rs.ti_amount_type - 1]}
                    </td>
                    <td align="center">
                      {Functions.subject_learn_type[rs.subject_learn_type - 1]}
                    </td>
                    <td>{Functions.vehicle_type[rs.vehicle_type_id - 1]}</td>
                    <td align="center">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => [this.handleClickEdit(rs)]}
                      >
                        แก้ไข
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) =>
                          this.setState({
                            isOpenModalDelete: true,
                            ti_id: rs.ti_id,
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
            <Modal.Title>ค่าตอบแทน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>ประเภทค่าตอบแทน</Form.Label>
              <Form.Select
                onChange={this.setAmount_type}
                value={ti_amount_type}
              >
                <option>--เลือกประเภทค่าตอบแทน--</option>
                {amount_type.map((val, index) => (
                  <option value={index + 1} key={index}>
                    {val}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {ti_amount_type !== "5" && (
              <Form.Group>
                <Form.Label>ประเภทยานพาหนะ</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    this.setState({ vehicle_type_id: e.target.value })
                  }
                  value={vehicle_type_id}
                >
                  <option value="0">--ประเภทยานพาหนะ--</option>
                  {vt.map((rs, index) => (
                    <option value={rs.vehicle_type_id} key={index}>
                      {rs.vehicle_type_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            {ti_amount_type !== "5" && (
              <Form.Group className="mb-3">
                <Form.Label>ประเภทการเรียน</Form.Label>

                <Form.Select
                  onChange={(e) =>
                    this.setState({ subject_learn_type: e.target.value })
                  }
                  value={subject_learn_type}
                >
                  <option value="0">--เลือกประเภทการเรียน--</option>
                  {subject_learn_type_list.map((val, index) => (
                    <option
                      value={index + 1}
                      key={index}
                      disabled={
                        ti_amount_type === "3" && index + 1 === 1 ? true : false
                      }
                    >
                      {val}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>จำนวนเงิน</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => this.setState({ ti_amount: e.target.value })}
                value={ti_amount}
              />
            </Form.Group>

            {ti_amount_type !== "5" && (
              <Form.Group className="mb-3">
                <Form.Label>หน่วย</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    this.setState({ ti_unit_type: e.target.value })
                  }
                  id="ti_unit_type"
                  value={ti_unit_type}
                >
                  <option>--เลือกหน่วย--</option>
                  {unit_type.map((val, index) => (
                    <option value={index + 1} key={index}>
                      {val}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
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
              onClick={ti_id === 0 ? this.handleSubmit : this.handleSubmitEdit}
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
