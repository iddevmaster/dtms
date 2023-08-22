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
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Select from "react-select";

import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
const school_id = Common.getUserLoginData.school_id;
const customSelectStyles = Common.customSelectStyles;
export default class User extends Component {
  state = {
    // user data
    user_id: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    user_type: "all",
    active: 1,
    branch_id: "all",
    isOpenModal: false,
    isOpenModalDelete: false,
    msg: "",
    data: [],
    param: [],
    page: 1,
    search_value: "",

    list_branch: [],
    defaultBranch: {
      value: "",
      label: "สาขา",
    },
  };

  refreshData = async (user_type) => {
    try {
      await axios
        .post(
          Common.API_URL +
            `user/all?typeuser=${user_type}&school_id=${school_id}&branch_id=${this.state.branch_id}`,
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
  };

  handleSubmit = () => {
    if (
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.firstname === "" ||
      this.state.lastname === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "user/create",
          {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            user_type: 3,
            active: this.state.active,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData("all");
          this.clearState();
        })
        .catch((err) => {
          this.setState({ msg: "ไม่สามารถใช้ Username นี้ได้" });
        });
    } catch (error) {
      this.setState({ msg: "ไม่สามารถใช้ Username นี้ได้" });
    }
  };

  handleUpdate = () => {
    if (
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.firstname === "" ||
      this.state.lastname === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL + `user/${this.state.user_id}`,
          {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            user_type: this.state.user_type,
            active: this.state.active,
            branch_id: this.state.branch_id,
            school_id: this.state.school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData("all");
          this.clearState();
        })
        .catch((err) => {
          this.setState({ msg: "ไม่สามารถใช้ Username นี้ได้" });
        });
    } catch (error) {
      this.setState({ msg: "ไม่สามารถใช้ Username นี้ได้" });
    }
  };

  handleClickEdit = (res) => {
    let r = res;

    this.setState({
      user_id: r.user_id,
      username: r.username,
      firstname: r.firstname,
      lastname: r.lastname,
      user_type: r.user_type,
      active: r.active,
      school_id: r.school_id,
      branch_id: r.branch_id,
      defaultBranch: {
        value: r.branch_id,
        label: r.branch_user.branch_name,
      },
    });
  };

  clearState = () => {
    this.setState({
      msg: "",
      user_id: "",
      username: "",
      firstname: "",
      lastname: "",
      branch_id: "",
      user_type: "all",
      defaultBranch: {
        value: "",
        label: "สาขา",
      },
    });
  };
  onChangeFilter = () => {
    // search_value
    this.refreshData(this.state.user_type);
  };
  setUser_type = (e) => {
    let user_type = e.target.value;
    // console.log(user_type)
    this.setState({
      user_type: user_type,
    });
    this.refreshData(user_type);
  };
  setBranch_idForFilter = async (e) => {
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
    this.refreshData(this.state.user_type);
  };

  componentDidMount() {
    this.refreshData("all");
    this.getBranch("");
  }
  render() {
    const { data } = this.state;
    const { isOpenModal } = this.state;
    const { defaultBranch } = this.state;
    const { list_branch } = this.state;
    const { param } = this.state;
    const { page } = this.state;

    const { msg } = this.state;
    const { user_id } = this.state;
    const { username } = this.state;
    const { firstname } = this.state;
    const { lastname } = this.state;
    const { user_type } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ผู้ใช้งานระบบ</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ผู้ใช้งานระบบ</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางข้อมูลผู้ใช้งานระบบ</Col>
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
              <Col sm={3}>จำนวนข้อมูล {param.total_data} เรคคอร์ด</Col>
              <Col sm={3}>
                <Select
                  id="branch_id"
                  options={list_branch}
                  onInputChange={this.getBranch}
                  styles={customSelectStyles}
                  onChange={this.setBranch_idForFilter}
                  value={defaultBranch}
                  cacheOptions
                />
              </Col>
              <Col sm={3}>
                <Form.Select size="lg" onChange={this.setUser_type}>
                  <option value="all">--ผู้ใช้งานทุกประเภท--</option>
                  <option value="3">เจ้าหน้าที่โรงเรียน</option>
                  <option value="4">ครู / วิทยากร</option>
                  <option value="5">นักเรียน</option>
                </Form.Select>
              </Col>
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
                  <th>Username</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>สาขา</th>
                  <th>โรงเรียน</th>
                  <th>ประเภท</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{rs.username}</td>
                    <td>
                      {rs.firstname} {rs.lastname}
                    </td>
                    <td>{rs.branch_user.branch_name}</td>
                    <td>{rs.school_user.school_name}</td>
                    <td>{Functions.user_type_format(rs.user_type)}</td>
                    <td>
                      <ButtonGroup>
                        <DropdownButton
                          title="จัดการ"
                          id="bg-nested-dropdown"
                          variant="warning"
                          disabled={rs.user_type === 2 ? true : false}
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
                                user_id: rs.user_id,
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
            <div>
              คำชี้แจง{" "}
              <span style={{ color: "red" }}>
                : ข้อมูลนักเรียนจะถูกเพิ่มอัตโนมัติหลังจากบันทึกผลการสมัคร
                และข้อมูลครู / วิทยากร
                จะเพิ่มอัตโนมัติหลังจากเพิ่มข้อมูลครูลงในแบบฟอร์ม
                ข้อมูลในส่วนนี้จึงไม่สามารถแก้ไขได้
              </span>
            </div>
          </Card.Body>
        </Card>

        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>ข้อมูลผู้ใช้งานระบบ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => this.setState({ username: e.target.value })}
                defaultValue={username}
                disabled={user_type === 3 || user_type === "all" ? false : true}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ชื่อ</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => this.setState({ firstname: e.target.value })}
                defaultValue={firstname}
                disabled={user_type === 3 || user_type === "all" ? false : true}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>นามสกุล</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => this.setState({ lastname: e.target.value })}
                defaultValue={lastname}
                disabled={user_type === 3 || user_type === "all" ? false : true}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>สาขา</Form.Label>
              <Select
                options={list_branch}
                onInputChange={this.getBranch}
                onChange={this.setBranch_id}
                value={defaultBranch}
                cacheOptions
                isDisabled={
                  user_type === 3 || user_type === "all" ? false : true
                }
              />
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
              type="submit"
              form="hook-form"
              onClick={user_id !== "" ? this.handleUpdate : this.handleSubmit}
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
