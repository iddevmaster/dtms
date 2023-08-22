import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Functions from "../../functions";
import Common from "../../common";
import EmptyImage from "../../asset/images/profile.png";
import axios from "axios";
const list_prefix = Functions.prefix;
const BASE_IMAGE = Common.IMAGE_URL;
const school_id = Common.getUserLoginData.school_id;
export default class Teacher extends Component {
  state = {
    teacher_id: "",
    teacher_prefix: "",
    teacher_firstname: "",
    teacher_lastname: "",
    teacher_id_number: "",
    teacher_gender: 0,
    teacher_email: "",
    teacher_cover: "",
    image_cover: EmptyImage,
    active: 1,
    // branch_id: Common.getUserLoginData.branch_id,
    branch_id: "all",
    teacher_cover_compair: "", //ไว้เปรียบเทียบว่ามีการเพิ่มรูปใหม่มาหรือไม่ ตอนแก้ไข

    isOpenModal: false,
    isOpenModalDelete: false,
    msg: "",
    data: [],
    param: [],
    branch: [],
    page: 1,
    search_value: "",
  };

  refreshData = async () => {
    // branch_id=all หมายถึง สาขาทั้งหมดภายในโรงเรียน
    try {
      await axios
        .post(
          Common.API_URL + `teacher/${school_id}/all?branch_id=all`,
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
          // console.log(res.data.Teacher);
        });
    } catch (error) {
      console.log(error);
    }
  };

  getBranch = async () => {
    try {
      await axios
        .post(
          Common.API_URL + `school/branch/all/${school_id}`,
          {
            page: 1,
            per_page: 200,
            search_value: "",
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ branch: res.data });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = () => {
    if (
      this.state.teacher_prefix === "" ||
      this.state.teacher_firstname === "" ||
      this.state.teacher_lastname === "" ||
      this.state.teacher_id_number === "" ||
      this.state.teacher_gender === "" ||
      this.state.teacher_gender === 0 ||
      this.state.teacher_phone === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "teacher/create",
          {
            teacher_prefix: this.state.teacher_prefix,
            teacher_firstname: this.state.teacher_firstname,
            teacher_lastname: this.state.teacher_lastname,
            teacher_id_number: this.state.teacher_id_number,
            teacher_gender: this.state.teacher_gender,
            teacher_phone: this.state.teacher_phone,
            teacher_email: this.state.teacher_email,
            teacher_cover: this.state.teacher_cover,
            active: this.state.active,
            branch_id: this.state.branch_id,
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
  handleSubmitEdit = () => {
    if (
      this.state.teacher_prefix === "" ||
      this.state.teacher_firstname === "" ||
      this.state.teacher_lastname === "" ||
      this.state.teacher_id_number === "" ||
      this.state.teacher_gender === "" ||
      this.state.teacher_gender === 0 ||
      this.state.teacher_phone === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL + `teacher/${this.state.teacher_id}`,
          {
            teacher_prefix: this.state.teacher_prefix,
            teacher_firstname: this.state.teacher_firstname,
            teacher_lastname: this.state.teacher_lastname,
            teacher_id_number: this.state.teacher_id_number,
            teacher_gender: this.state.teacher_gender,
            teacher_phone: this.state.teacher_phone,
            teacher_email: this.state.teacher_email,
            teacher_cover: this.state.teacher_cover,
            active: this.state.active,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData();
          this.clearState();
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleClickEdit = (res) => {
    let r = res;
    this.setState({
      teacher_id: r.teacher_id,
      teacher_prefix: r.teacher_prefix,
      teacher_firstname: r.teacher_firstname,
      teacher_lastname: r.teacher_lastname,
      teacher_id_number: r.teacher_id_number,
      teacher_gender: r.teacher_gender,
      teacher_phone: r.teacher_phone,
      teacher_email: r.teacher_email,
      teacher_cover: r.teacher_cover,
      active: r.active,
      branch_id: r.branch_id,
      image_cover: BASE_IMAGE + r.teacher_cover,
      msg: "",
      teacher_cover_compair: r.teacher_cover,
    });
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `teacher/${this.state.teacher_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false, teacher_id: "" });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  clearState = () => {
    this.setState({
      teacher_id: "",
      teacher_prefix: "",
      teacher_firstname: "",
      teacher_lastname: "",
      teacher_id_number: "",
      teacher_gender: 0,
      teacher_phone: "",
      teacher_email: "",
      teacher_cover: "",
      image_cover: EmptyImage,
      msg: "",
    });
  };
  onChangeFilter = () => {
    // search_value
    this.refreshData();
  };
  cancleForm = () => {
    if (this.state.teacher_id === "" && this.state.teacher_cover !== "") {
      // ป้องกันเพิ่มภาพแต่ไม่บันทึกข้อมูล ให้ลบรูปที่เพิ่มไว้ก่อนหน้านี้ทันที
      this.DeleteImage(this.state.teacher_cover);
    }
    if (this.state.teacher_cover_compair !== this.state.teacher_cover) {
      this.handleSubmitEdit();
      // console.log("Edit");
    }
    this.setState({
      isOpenModal: false,
    });
  };

  componentDidMount() {
    this.refreshData();
    this.getBranch();
  }

  render() {
    const { teacher_id } = this.state;
    const { teacher_prefix } = this.state;
    const { teacher_firstname } = this.state;
    const { teacher_lastname } = this.state;
    const { teacher_gender } = this.state;
    const { teacher_id_number } = this.state;
    const { teacher_phone } = this.state;
    const { teacher_email } = this.state;
    const { branch_id } = this.state;
    const { active } = this.state;

    const { data } = this.state;
    const { param } = this.state;
    const { branch } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { msg } = this.state;
    const { page } = this.state;

    return (
      <div>
        {/* {JSON.stringify(data)} */}
        <Row>
          <Col sm={8}>
            <h3>ทะเบียนครู</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ทะเบียนครู</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางทะเบียนครู</Col>
              <Col sm={4}>
                <div align="right">
                  <Button onClick={(e) => this.setState({ isOpenModal: true })}>
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
                  <th>รูป</th>
                  <th>รหัสบัตรประชาชน</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>เพศ</th>
                  <th>เบอร์โทร</th>
                  <th>อีเมล</th>
                  <th>สาขา</th>
                  <th>สถานะ</th>
                  <th>วันที่สร้าง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>
                      <div align="center">
                        <Card.Img
                          variant="top"
                          src={
                            rs.teacher_cover !== ""
                              ? BASE_IMAGE + rs.teacher_cover
                              : EmptyImage
                          }
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                    </td>
                    <td>{rs.teacher_id_number}</td>
                    <td>
                      {rs.teacher_prefix}
                      {rs.teacher_firstname} {rs.teacher_lastname}
                    </td>
                    <td>{Functions.genderFormat(rs.teacher_gender)}</td>
                    <td>{rs.teacher_phone}</td>
                    <td>{rs.teacher_email} </td>
                    <td>{rs.branch_teacher.branch_name} </td>
                    <td>
                      {rs.active === 1 ? (
                        <span style={{ color: "blue" }}>เปิด</span>
                      ) : (
                        <span style={{ color: "red" }}>ปิด</span>
                      )}
                    </td>
                    <td>{Functions.format_date_time(rs.create_date)} </td>
                    <td align="center">
                      <ButtonGroup>
                        <DropdownButton
                          title="จัดการ"
                          id="bg-nested-dropdown"
                          variant="warning"
                        >
                          <LinkContainer to={`/teacher/${rs.teacher_id}`}>
                            <Dropdown.Item eventKey="1">
                              รายละเอียด
                            </Dropdown.Item>
                          </LinkContainer>
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
                                teacher_id: rs.teacher_id,
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

        {/* Form Teacher */}
        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>ทะเบียนครู</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>เลขบัตรประจำตัวประชาชน</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ teacher_id_number: e.target.value })
                }
                defaultValue={teacher_id_number}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>คำนำหน้า</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <InputGroup>
                <DropdownButton
                  variant="outline-secondary"
                  title="เลือกคำนำหน้า"
                  id="input-group-dropdown-1"
                >
                  {list_prefix.map((value, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={(e) => this.setState({ teacher_prefix: value })}
                    >
                      {value}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Form.Control
                  id="teacher_prefix"
                  value={teacher_prefix}
                  onChange={(e) =>
                    this.setState({ teacher_prefix: e.target.value })
                  }
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ชื่อ</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ teacher_firstname: e.target.value })
                }
                defaultValue={teacher_firstname}
                id="teacher_firstname"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>นามสกุล</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ teacher_lastname: e.target.value })
                }
                defaultValue={teacher_lastname}
                id="teacher_lastname"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>เพศ</Form.Label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ teacher_gender: e.target.value })
                }
                defaultValue={teacher_gender}
                id="teacher_gender"
              >
                <option value="">--เลือกเพศ--</option>
                <option value="1">ชาย</option>
                <option value="2">หญิง</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>เบอร์โทร</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ teacher_phone: e.target.value })
                }
                defaultValue={teacher_phone}
                id="teacher_phone"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ teacher_email: e.target.value })
                }
                defaultValue={teacher_email}
                id="teacher_email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>สาขา</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Select
                onChange={(e) => this.setState({ branch_id: e.target.value })}
                defaultValue={branch_id}
                id="branch_id"
              >
                <option value="">--เลือกสาขา--</option>
                {branch
                  .filter((x) => x.active === 1)
                  .map((rs, index) => (
                    <option value={rs.branch_id} key={index}>
                      {rs.branch_name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>เปิด - ปิด</Form.Label>
              <Form.Select
                onChange={(e) => this.setState({ active: e.target.value })}
                defaultValue={active}
                id="active"
              >
                <option value="0">ปิด</option>
                <option value="1">เปิด</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.cancleForm}>
              ปิดหน้าต่างนี้
            </Button>

            <Button
              variant="primary"
              type="button"
              onClick={
                teacher_id === "" ? this.handleSubmit : this.handleSubmitEdit
              }
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
