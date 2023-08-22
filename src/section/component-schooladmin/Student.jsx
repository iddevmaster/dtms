import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import { LinkContainer } from "react-router-bootstrap";
import ReactToPrint from "react-to-print";
import PrintRegister from "../export-report/PrintRegister";

import Modal from "react-bootstrap/Modal";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
const customSelectStyles = Common.customSelectStyles;
const school_id = Common.getUserLoginData.school_id;
export default class Student extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.button = React.createRef();
  }
  state = {
    branch_id: "all",
    rm_id: "",
    course_group: 0,
    rm_success: false,
    msg: "",
    data: [],
    param: [],
    page: 1,
    search_value: "",
    isOpenModal: false,
    list_branch: [],
    defaultBranch: {
      value: "",
      label: "สาขา",
    },
  };
  handlePrint = async (rm_id) => {
    await new Promise((accept) =>
      this.setState(
        {
          rm_id: rm_id,
        },
        accept
      )
    );

    this.myRef.rm_id = rm_id;
    this.button.current.click();
    // console.log(this.myRef.rm_id);
  };
  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL +
            `register/list/${school_id}?branch_id=${this.state.branch_id}`,
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
    // let branch_id = (document.getElementById("branch_id").value = e.value);
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

  onChangeFilter = () => {
    // search_value
    this.refreshData();
  };

  componentDidMount() {
    this.refreshData();
    this.getBranch("");
  }

  render() {
    const { rm_id } = this.state;
    const { course_group } = this.state;
    const { rm_success } = this.state;

    const { data } = this.state;
    const { param } = this.state;
    const { page } = this.state;
    const { defaultBranch } = this.state;
    const { list_branch } = this.state;
    const { isOpenModal } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ทะเบียนนักเรียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ทะเบียนนักเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Body>
            <Row>
              <Col sm={6}>จำนวนข้อมูล {param.total_data} เรคคอร์ด</Col>
              <Col sm={3}>
                <Select
                  id="branch_id"
                  options={list_branch}
                  onInputChange={this.getBranch}
                  styles={customSelectStyles}
                  onChange={this.setBranch_id}
                  value={defaultBranch}
                  cacheOptions
                />
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
                  <th>เลขบัตรประชาชน / Passport</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>เพศ</th>
                  <th>เบอร์โทร</th>
                  <th>อีเมล</th>
                  <th>สาขา</th>
                  <th>วันที่ลงทะเบียน</th>
                  <th>รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td> {rs.student_register_core[0].student_id_number}</td>
                    <td>
                      {rs.student_register_core[0].student_prefix}
                      {rs.student_register_core[0].student_firstname}{" "}
                      {rs.student_register_core[0].student_lastname}
                    </td>
                    <td>
                      {Functions.genderFormat(
                        rs.student_register_core[0].student_gender
                      )}
                    </td>
                    <td>{rs.student_register_core[0].student_mobile}</td>
                    <td>{rs.student_register_core[0].student_email}</td>
                    <td>{rs.branch_regisetmain_core.branch_name}</td>
                    <td>{Functions.format_date_time(rs.create_date)}</td>

                    <td align="center">
                      <Button
                        size="sm"
                        variant="info"
                        onClick={(e) =>
                          this.setState({
                            isOpenModal: true,
                            rm_id: rs.rm_id,
                            course_group: rs.course_group,
                            rm_success: rs.rm_success,
                          })
                        }
                      >
                        รายละเอียด
                      </Button>
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

        {rm_id !== "" && (
          <div>
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="info"
                  size="sm"
                  ref={this.button}
                  style={{ display: "none" }}
                >
                  พิมพ์
                </Button>
              )}
              content={() => this.myRef}
              onAfterPrint={() => this.myRef.refreshData(rm_id)}
              onBeforeGetContent={() => this.myRef.refreshData(rm_id)}
            />
            <div style={{ display: "none" }}>
              <PrintRegister ref={(el) => (this.myRef = el)} rm_id={rm_id} />
            </div>
          </div>
        )}

        {/* Form Detail */}
        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>รายละเอียด</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col style={{ textAlign: "center" }}>
                <LinkContainer to={`/student/${rm_id}`}>
                  <Button size="lg" variant="primary">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                  </Button>
                </LinkContainer>{" "}
                <p>ข้อมูลการสมัคร</p>
              </Col>

              <Col style={{ textAlign: "center" }}>
                <Button
                  size="lg"
                  variant="info"
                  onClick={() => this.handlePrint(rm_id)}
                >
                  <i className="fa fa-print" aria-hidden="true"></i>
                </Button>{" "}
                <p>พิมพ์ใบสมัคร</p>
              </Col>
              <Col style={{ textAlign: "center" }}>
                <LinkContainer to={`/student/update/${rm_id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    disabled={rm_success === true ? true : false}
                  >
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </Button>
                </LinkContainer>{" "}
                <p>แก้ไขข้อมูลนักเรียน</p>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }}>
                <LinkContainer to={`/student/schedule/${rm_id}`}>
                  <Button
                    size="lg"
                    variant="warning"
                    disabled={
                      course_group === 3 || rm_success === true ? true : false
                    }
                  >
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                  </Button>
                </LinkContainer>{" "}
                <p>แก้ไขตารางเรียน</p>
              </Col>
              <Col style={{ textAlign: "center" }}>
                <LinkContainer to={`/student/seminar/${rm_id}`}>
                  <Button
                    size="lg"
                    variant="success"
                    disabled={
                      course_group === 2 || rm_success === true
                        ? true
                        : false
                        ? true
                        : false
                    }
                  >
                    <i className="fa fa-clock" aria-hidden="true"></i>
                  </Button>
                </LinkContainer>{" "}
                <p>แก้ไขวันที่อบรม</p>
              </Col>

              <Col style={{ textAlign: "center" }}>
                <LinkContainer to={`/student/exam/${rm_id}`}>
                  <Button
                    size="lg"
                    variant="danger"
                    disabled={
                      course_group !== 1 || rm_success === true
                        ? true
                        : false
                        ? true
                        : false
                    }
                  >
                    <i className="fa fa-clock" aria-hidden="true"></i>
                  </Button>
                </LinkContainer>{" "}
                <p>แก้ไขวันสอบ</p>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ isOpenModal: false })}
            >
              ปิดหน้าต่างนี้
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
