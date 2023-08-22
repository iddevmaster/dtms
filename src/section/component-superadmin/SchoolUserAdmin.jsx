import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import axios from "axios";
const customSelectStyles = Common.customSelectStyles;
export default class SchoolUserAdmin extends Component {
  state = {
    // user data
    user_id: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    user_type: 2,
    active: 1,
    school_id: "",
    branch_id: 0,

    isOpenModal: false,
    isOpenModalDelete: false,
    data: [],
    msg: "",

    list_school: [],
    defaultSchool: {
      value: "",
      label: "โรงเรียน",
    },
  };

  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + "user/all?typeuser=2",
          {
            page: 0,
            per_page: 10,
            search_value: "",
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;

          this.setState({ data: res.data });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getSchool = (search) => {
    try {
      axios
        .post(
          Common.API_URL + "school/all",
          {
            page: 1,
            per_page: 15,
            search_value: search,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;

          let list = res.data;
          var arr = [];

          for (let i = 0; i < list.length; i++) {
            let obj = list[i];

            arr.push({
              value: obj.school_id,
              label: obj.school_name,
            });
          }
          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_school: arr,
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

  getBranch = (school_id) => {
    try {
      axios
        .post(
          Common.API_URL + `school/branch/all/${school_id}`,
          {
            page: 1,
            per_page: 1,
            search_value: "",
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let data = res.data[0];
          this.setState({ branch_id: data.branch_id });
        });
    } catch (error) {
      console.log(error);
    }
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
            user_type: this.state.user_type,
            active: this.state.active,
            branch_id: this.state.branch_id,
            school_id: this.state.school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData();
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
          this.refreshData();
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
      defaultSchool: {
        value: r.school_id,
        label: r.school_user.school_name,
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
      school_id: "",
      branch_id: "",
      defaultSchool: {
        value: "",
        label: "โรงเรียน",
      },
    });
  };

  setSchool_id = async (e) => {
    this.setState({ school_id: e.value, defaultSchool: e });
    this.getBranch(e.value);
  };

  handleDelete = () => {
    try {
      axios
        .delete(Common.API_URL + `user/${this.state.user_id}`, Common.options)
        .then((res) => {
          this.setState({ isOpenModalDelete: false, user_id: "" });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData();
    this.getSchool("");
  }

  render() {
    const {
      isOpenModal,
      isOpenModalDelete,
      msg,
      data,
      defaultSchool,
      list_school,
      user_id,
      username,
      firstname,
      lastname,
    } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ผู้ดูแลระบบโรงเรียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ผู้ดูแลระบบโรงเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ผู้ดูแลระบบโรงเรียน</Col>
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
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>โรงเรียน</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{rs.username}</td>
                    <td>
                      {rs.firstname} {rs.lastname}
                    </td>
                    <td>{rs.school_user.school_name}</td>
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
          </Card.Body>
        </Card>

        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>ผู้ดูแลระบบโรงเรียน</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>นามสกุล</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => this.setState({ lastname: e.target.value })}
                defaultValue={lastname}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>โรงเรียน</Form.Label>
              {/* <Form.Control type="text" required onChange={this.getSchool_id} /> */}

              <Select
                id="branch_id"
                options={list_school}
                onInputChange={this.getSchool}
                styles={customSelectStyles}
                onChange={this.setSchool_id}
                value={defaultSchool}
                cacheOptions
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
        {/* Delete */}
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
            <Button variant="primary" onClick={this.handleDelete}>
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
