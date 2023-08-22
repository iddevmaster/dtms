import React, { Component } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Modal,
  Table,
  Alert,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
const school_id = Common.getUserLoginData.school_id;
const course_group_list = Functions.course_group;
export default class Course extends Component {
  state = {
    course_id: "",
    course_code: "",
    course_name: "",
    course_theory_hour: 0,
    course_practice_hour: 0,
    course_total_hour: 0,
    course_readey: 0,
    course_group: 0,
    active: 1,
    vehicle_type_id: 0,

    isOpenModal: false,
    isOpenModalDelete: false,
    isOpenModalPrice: false,
    msg: "",
    data: [],
    param: [],
    vt: [],
    page: 1,
    search_value: "",
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
  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + `course/${school_id}?only=true`,
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
    if (
      this.state.course_code === "" ||
      this.state.course_name === "" ||
      this.state.vehicle_type_id === 0
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    let hourSum =
      parseFloat(this.state.course_theory_hour) +
      parseFloat(this.state.course_practice_hour);
    try {
      axios
        .post(
          Common.API_URL + "course/create",
          {
            course_code: this.state.course_code,
            course_name: this.state.course_name,
            course_theory_hour: this.state.course_theory_hour,
            course_practice_hour: this.state.course_practice_hour,
            course_total_hour: hourSum,
            course_readey: this.state.course_readey,
            course_group: this.state.course_group,
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
  handleSubmitEdit = () => {
    if (
      this.state.course_code === "" ||
      this.state.course_name === "" ||
      this.state.vehicle_type_id === 0
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    let hourSum =
      parseFloat(this.state.course_theory_hour) +
      parseFloat(this.state.course_practice_hour);
    try {
      axios
        .put(
          Common.API_URL + `course/${this.state.course_id}`,
          {
            course_code: this.state.course_code,
            course_name: this.state.course_name,
            course_theory_hour: this.state.course_theory_hour,
            course_practice_hour: this.state.course_practice_hour,
            course_total_hour: hourSum,
            course_readey: this.state.course_readey,
            course_group: this.state.course_group,
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

  handleClickEdit = (res) => {
    let r = res;
    this.setState({
      course_id: r.course_id,
      course_code: r.course_code,
      course_name: r.course_name,
      course_theory_hour: r.course_theory_hour,
      course_practice_hour: r.course_practice_hour,
      course_readey: r.course_readey,
      course_group: r.course_group,
      active: r.active,
      vehicle_type_id: r.vehicle_type_id,
      school_id: r.school_id,
      msg: "",
    });
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `course/${this.state.course_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false, course_id: "" });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  onChangeFilter = () => {
    // search_value
    this.refreshData();
  };

  clearState = () => {
    this.setState({
      course_id: "",
      course_code: "",
      course_name: "",
      course_theory_hour: 0,
      course_practice_hour: 0,
      course_total_hour: 0,
      course_readey: 0,
      course_group: 0,
      vehicle_type_id: 0,

      msg: "",
    });
  };

  componentDidMount() {
    this.refreshData();
    this.getVehicleType();
  }

  render() {
    const { course_id } = this.state;
    const { course_code } = this.state;
    const { course_name } = this.state;
    const { course_theory_hour } = this.state;
    const { course_practice_hour } = this.state;
    const { course_group } = this.state;
    const { vehicle_type_id } = this.state;
    const { active } = this.state;

    const { data } = this.state;
    const { param } = this.state;
    const { vt } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;

    const { msg } = this.state;
    const { page } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>หลักสูตร</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>หลักสูตร</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางหลักสูตร</Col>
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
                  <th>รหัสหลักสูตร</th>
                  <th>หลักสูตร</th>
                  <th>กลุ่มหลักสูตร</th>
                  <th>ประเภทยานพาหนะ</th>
                  <th>ทฏษฎี</th>
                  <th>ปฏิบัติ</th>
                  <th>ชั่วโมงทั้งหมด</th>
                  <th>ความพร้อม</th>
                  <th>วันที่สร้าง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>
                      {rs.school_id === Common.base_school_id && (
                        <span>
                          <i className="fa fa-globe" aria-hidden="true"></i>
                        </span>
                      )}{" "}
                      {rs.course_code}
                    </td>
                    <td>{rs.course_name}</td>
                    <td>{Functions.course_group[rs.course_group - 1]}</td>
                    <td>{Functions.vehicle_type[rs.vehicle_type_id - 1]} </td>
                    <td align="center">{rs.course_theory_hour} </td>
                    <td align="center">{rs.course_practice_hour} </td>
                    <td align="center">{rs.course_total_hour} </td>
                    <td align="center">
                      {rs.course_readey > 0 && <i className="fa fa-check"></i>}
                    </td>

                    <td>{Functions.format_date_time(rs.create_date)} </td>
                    <td align="center">
                      <ButtonGroup>
                        <DropdownButton
                          title="จัดการ"
                          id="bg-nested-dropdown"
                          variant="warning"
                        >
                          <LinkContainer to={`/course/subject/${rs.course_id}`}>
                            <Dropdown.Item
                              eventKey="1"
                              disabled={
                                rs.course_readey === 0 &&
                                school_id !== Common.base_school_id
                                  ? true
                                  : false
                              }
                            >
                              รายวิชา
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
                            disabled={rs.course_readey === 1 ? true : false}
                          >
                            แก้ไข
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={(e) =>
                              this.setState({
                                isOpenModalDelete: true,
                                course_id: rs.course_id,
                              })
                            }
                            disabled={rs.school_id === school_id ? false : true}
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

        {/* Form Course */}
        <Modal show={isOpenModal} size="lg">
          <Modal.Header>
            <Modal.Title>หลักสูตร</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสหลักสูตร</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) =>
                      this.setState({ course_code: e.target.value })
                    }
                    defaultValue={course_code}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>หลักสูตร</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) =>
                      this.setState({ course_name: e.target.value })
                    }
                    defaultValue={course_name}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ทฏษฎี (ชั่วโมง)</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(e) =>
                      this.setState({ course_theory_hour: e.target.value })
                    }
                    defaultValue={course_theory_hour}
                    id="course_theory_hour"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ปฏิบัติ (ชั่วโมง)</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(e) =>
                      this.setState({ course_practice_hour: e.target.value })
                    }
                    defaultValue={course_practice_hour}
                    id="course_practice_hour"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>กลุ่มหลักสูตร</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      this.setState({ course_group: e.target.value })
                    }
                    value={course_group}
                  >
                    <option value="">--เลือกข้อมูล--</option>
                    {course_group_list.map((value, index) => (
                      <option value={index + 1} key={index}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
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
              </Col>
              <Col>
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
              </Col>
            </Row>
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
                course_id === "" ? this.handleSubmit : this.handleSubmitEdit
              }
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Form Delete */}
        <Modal show={isOpenModalDelete} size="sm">
          <Modal.Header>
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>ยืนยันการลบหรือไม่ !</Modal.Body>
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
