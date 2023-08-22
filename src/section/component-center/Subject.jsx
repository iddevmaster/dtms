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
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
const school_id = Common.getUserLoginData.school_id;
export default class Subject extends Component {
  state = {
    subject_id: 0,
    subject_code: "",
    subject_name: 0,
    subject_type: 0,
    subject_learn_type: 0,
    active: 1,
    vehicle_type_id: 0,
    isOpenModal: false,
    isOpenModalDelete: false,
    msg: "",
    data: [],
    vt: [],
    param: [],
    page: 1,
    search_value: "",
  };

  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + `course/subject/${school_id}?only=false`,
          {
            page: this.state.page,
            per_page: 25,
            search_value: this.state.search_value,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res.data, param: res });
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
      this.state.subject_code === "" ||
      this.state.subject_name === "" ||
      this.state.subject_type === 0 ||
      this.state.subject_type === 0 ||
      this.state.vehicle_type_id === 0
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "course/subject/create",
          {
            subject_code: this.state.subject_code,
            subject_name: this.state.subject_name,
            subject_type: this.state.subject_type,
            subject_learn_type: this.state.subject_learn_type,
            active: this.state.active,
            vehicle_type_id: this.state.vehicle_type_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleClickEdit = (res) => {
    let r = res;
    this.setState({
      subject_id: r.subject_id,
      subject_code: r.subject_code,
      subject_name: r.subject_name,
      subject_type: r.subject_type,
      subject_learn_type: r.subject_learn_type,
      active: r.active,
      vehicle_type_id: r.vehicle_type_id,
      school_id: r.school_id,
      msg: "",
    });
  };
  handleSubmitEdit = () => {
    if (
      this.state.subject_code === "" ||
      this.state.subject_name === "" ||
      this.state.subject_type === 0 ||
      this.state.subject_type === 0 ||
      this.state.vehicle_type_id === 0
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL + `course/subject/${this.state.subject_id}`,
          {
            subject_code: this.state.subject_code,
            subject_name: this.state.subject_name,
            subject_type: this.state.subject_type,
            subject_learn_type: this.state.subject_learn_type,
            active: this.state.active,
            vehicle_type_id: this.state.vehicle_type_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.clearState();
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `course/subject/${this.state.subject_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false, subject_id: 0 });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };
  clearState = () => {
    this.setState({
      subject_id: 0,
      subject_code: "",
      subject_name: "",
      subject_type: 0,
      subject_learn_type: 0,
      vehicle_type_id: 0,

      msg: "",
    });
  };
  onChangeFilter = () => {
    this.refreshData();
  };
  componentDidMount() {
    this.refreshData();
    this.getVehicleType();
  }

  render() {
    const { subject_id } = this.state;
    const { subject_code } = this.state;
    const { subject_name } = this.state;
    const { subject_type } = this.state;
    const { subject_learn_type } = this.state;
    const { vehicle_type_id } = this.state;
    const { active } = this.state;

    const { data } = this.state;
    const { vt } = this.state;
    const { param } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { msg } = this.state;
    const { page } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>รายวิชา</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>รายวิชา</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางรายวิชา</Col>
              <Col sm={4}>
                <div align="right">
                  <Button
                    onClick={(e) => [
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
              <Col sm={9}>จำนวนข้อมูล {param.total_data} เรคคอร์ด</Col>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="ค้นหา"
                  onChange={(e) => [
                    this.setState({
                      search_value: e.target.value,
                    }),
                    this.onChangeFilter(),
                  ]}
                  onKeyUp={(e) => [
                    this.setState({
                      search_value: e.target.value,
                    }),
                    this.onChangeFilter(),
                  ]}
                />
              </Col>
            </Row>

            <Table striped>
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>วิชา</th>
                  <th>ประเภทยานพาหนะ</th>
                  <th>ประเภทวิชา</th>
                  <th>ประเภทการเรียน</th>
                  <th>สถานะ</th>
                  <th>วันที่สร้าง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{rs.subject_code}</td>
                    <td>{rs.subject_name}</td>
                    <td>{Functions.vehicle_type[rs.vehicle_type_id - 1]}</td>
                    <td>{Functions.subject_type[rs.subject_type - 1]} </td>
                    <td>
                      {Functions.subject_learn_type[rs.subject_learn_type - 1]}
                    </td>
                    <td>
                      {rs.active === 1 ? (
                        <span style={{ color: "blue" }}>เปิด</span>
                      ) : (
                        <span style={{ color: "red" }}>ปิด</span>
                      )}
                    </td>
                    <td>{Functions.format_date_time(rs.create_date)} </td>
                    <td>
                      {rs.school_id === school_id && (
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
                                this.handleClickEdit(rs),
                              ]}
                            >
                              แก้ไข
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="3"
                              onClick={(e) =>
                                this.setState({
                                  isOpenModalDelete: true,
                                  subject_id: rs.subject_id,
                                })
                              }
                            >
                              ลบ
                            </Dropdown.Item>
                          </DropdownButton>
                        </ButtonGroup>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row>
              <Col></Col>
              <Col sm={2}>
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>หน้าที่</InputGroup.Text>
                  <Form.Control
                    type="number"
                    defaultValue={page}
                    onChange={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.onChangeFilter(),
                    ]}
                    onKeyUp={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.onChangeFilter(),
                    ]}
                    onClick={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.onChangeFilter(),
                    ]}
                    style={{ textAlign: "center" }}
                  />
                  <InputGroup.Text>
                    ทั้งหมด {param.total_page} หน้า
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>
        {/* Form Subject */}
        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>รายวิชา</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>รหัสวิชา</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ subject_code: e.target.value })
                }
                defaultValue={subject_code}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>วิชา</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ subject_name: e.target.value })
                }
                defaultValue={subject_name}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ประเภทวิชา</Form.Label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ subject_type: e.target.value })
                }
                value={subject_type}
              >
                <option value="">--เลือกข้อมูล--</option>
                <option value="1">วิชาบังคับ</option>
                <option value="2">วิชาเพิ่มเติม</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ประเภทการเรียน</Form.Label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ subject_learn_type: e.target.value })
                }
                value={subject_learn_type}
              >
                <option value="">--เลือกข้อมูล--</option>
                <option value="1">ทฤษฏี</option>
                <option value="2">ปฏิบัติ</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ประเภทยานพาหนะ</Form.Label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ vehicle_type_id: e.target.value })
                }
                value={vehicle_type_id}
              >
                <option value="">--เลือกข้อมูล--</option>
                {vt.map((rs, index) => (
                  <option value={rs.vehicle_type_id} key={index}>
                    {rs.vehicle_type_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>เปิด - ปิด</Form.Label>
              <Form.Select
                onChange={(e) => this.setState({ active: e.target.value })}
                defaultValue={active}
              >
                <option value="0">ปิด</option>
                <option value="1">เปิด</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) =>
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
              onClick={
                subject_id === 0 ? this.handleSubmit : this.handleSubmitEdit
              }
            >
              บันทึก
            </Button>
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
      </div>
    );
  }
}
