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
export default class Branch extends Component {
  state = {
    branch_id: "",
    branch_code: "",
    branch_name: "",
    active: 1,
    isOpenModal: false,
    isOpenModalDelete: false,
    msg: "",
    data: [],
    param: [],
    page: 1,
    search_value: "",
  };

  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + `school/branch/all/${school_id}`,
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

  handleSubmit = () => {
    if (this.state.branch_code === "" || this.state.branch_name === "") {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "school/branch/create",
          {
            branch_code: this.state.branch_code,
            branch_name: this.state.branch_name,
            active: this.state.active,
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
    if (this.state.branch_code === "" || this.state.branch_name === "") {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL + `school/branch/${this.state.branch_id}`,
          {
            branch_code: this.state.branch_code,
            branch_name: this.state.branch_name,
            active: this.state.active,
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
      branch_id: r.branch_id,
      branch_code: r.branch_code,
      branch_name: r.branch_name,
      active: r.active,
      school_id: r.school_id,
      msg: "",
    });
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `school/branch/${this.state.branch_id}`,
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
      branch_id: "",
      branch_code: "",
      branch_name: "",
      msg: "",
    });
  };

  onChangeFilter = () => {
    // search_value
    this.refreshData();
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { branch_id } = this.state;
    const { branch_code } = this.state;
    const { branch_name } = this.state;
    const { active } = this.state;

    const { data } = this.state;
    const { param } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { msg } = this.state;
    const { page } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>สาขา</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>สาขา</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางข้อมูลสาขา</Col>
              <Col sm={4}>
                <div align="right">
                  <Button
                    onClick={(e) => [
                      this.setState({
                        isOpenModal: true,
                      }),
                      //   this.clearState(),
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
                  <th>รหัสสาขา</th>
                  <th>สาขา</th>
                  <th>สถานะ</th>
                  <th>วันที่สร้าง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{rs.branch_code}</td>
                    <td>{rs.branch_name}</td>
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
                                branch_id: rs.branch_id,
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
        {/* Form Branch */}
        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>สาขา</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>รหัสสาขา</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) => this.setState({ branch_code: e.target.value })}
                defaultValue={branch_code}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>สาขา</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) => this.setState({ branch_name: e.target.value })}
                defaultValue={branch_name}
              />
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
              onClick={(e) => this.setState({ isOpenModal: false })}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              onClick={
                branch_id === "" ? this.handleSubmit : this.handleSubmitEdit
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
