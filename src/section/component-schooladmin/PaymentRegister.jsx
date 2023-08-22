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

import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
const customSelectStyles = Common.customSelectStyles;
const school_id = Common.getUserLoginData.school_id;
export default class PaymentRegister extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.button = React.createRef();
  }
  state = {
    branch_id: "all",
    rm_id: "",
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

  onSetidToprint = (rm_id) => {
    // search_value
    // console.log("OK");
    this.setState({ rm_id: rm_id });
  };

  render() {
    const { rm_id } = this.state;
    const { data } = this.state;
    const { param } = this.state;

    const { page } = this.state;
    const { defaultBranch } = this.state;
    const { list_branch } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ข้อมูลการลงทะเบียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ข้อมูลการลงทะเบียน</Breadcrumb.Item>
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
                  <th>เลขที่ใบสมัคร</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>หลักสูตร</th>
                  <th>สาขา</th>
                  <th>พิมพ์ใบสมัคร</th>
                  <th>วันที่ลงทะเบียน</th>
                  <th>สถานะลงทะเบียน</th>
                  <th>สถานะการชำระเงิน</th>
                  <th>ใบเสร็จ</th>
                  <th>ชำระเงิน</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{rs.rm_doc_number}</td>
                    <td>
                      {rs.student_register_core[0].student_prefix}
                      {rs.student_register_core[0].student_firstname}{" "}
                      {rs.student_register_core[0].student_lastname}
                    </td>
                    <td>
                      {rs.course_regisetmain_core.course_code}{" "}
                      {rs.course_regisetmain_core.course_name}
                    </td>
                    <td>{rs.branch_regisetmain_core.branch_name}</td>
                    <td align="center">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => this.handlePrint(rs.rm_id)}
                      >
                        <i className="fa fa-print" aria-hidden="true"></i>
                      </Button>
                    </td>
                    <td>{Functions.format_date_time(rs.create_date)}</td>
                    <td>{Functions.register_status_format(rs.rm_status)}</td>
                    <td>{Functions.pay_status_format(rs.rm_pay_status)}</td>
                    <td align="center">
                      <LinkContainer to={`/register/payment/bill/${rs.rm_id}`}>
                        <Button
                          size="sm"
                          variant="warning"
                          disabled={rs.rm_pay_status === "RS" ? true : false}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </Button>
                      </LinkContainer>
                    </td>
                    <td align="center">
                      <LinkContainer to={`/register/payment/${rs.rm_id}`}>
                        <Button
                          size="sm"
                          variant="success"
                          disabled={rs.rm_pay_status === "PA" ? true : false}
                        >
                          <i
                            className="fa fa-shopping-cart"
                            aria-hidden="true"
                          ></i>
                        </Button>
                      </LinkContainer>
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
      </div>
    );
  }
}
