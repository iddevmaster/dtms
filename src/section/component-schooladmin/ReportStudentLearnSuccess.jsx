import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
// import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import { LinkContainer } from "react-router-bootstrap";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";

import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const d = new Date();
const c = d.getMonth() + 1 + "/" + d.getFullYear();

const customSelectStyles = Common.customSelectStyles;
const school_id = Common.getUserLoginData.school_id;
const GetDataForm = () => {
  const { rm_success } = useParams();
  if (rm_success !== "true" && rm_success !== "false") {
    window.location = "/";
  }
  return <ReportStudentLearnSuccess rm_success={rm_success} />;
};
export default GetDataForm;
class ReportStudentLearnSuccess extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.button = React.createRef();
  }

  // present_year:
  state = {
    rm_success: this.props.rm_success,
    branch_id: "all",
    rm_id: "",
    course_group: 0,
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

    present_month: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
    present_year: d.getFullYear(),
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
            `register/report/list/learn/${school_id}?rm_success=${this.state.rm_success}&month=${this.state.present_month}&year=${this.state.present_year}&branch_id=${this.state.branch_id}`,
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

  setMonthFilter = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);

    let getmonth = e.month.number;
    let getyear = e.year;

    await new Promise((accept) =>
      this.setState(
        {
          present_month: getmonth,
          present_year: getyear,
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
    const { data } = this.state;
    const { param } = this.state;

    const { page } = this.state;
    const { defaultBranch } = this.state;
    const { list_branch } = this.state;
    const { rm_success } = this.state;
    let namepage;
    if (rm_success === "true") {
      namepage = "รายงานนักเรียนจบหลักสูตร";
    } else {
      namepage = "รายงานนักเรียนไม่จบหลักสูตร";
    }
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>{namepage}</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>{namepage}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Body>
            <Row>
              <Col sm={6}>จำนวนข้อมูล {param.total_data} เรคคอร์ด</Col>
              <Col>
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
              <Col>
                <DatePicker
                  onlyMonthPicker
                  calendar={thai}
                  locale={thai_th}
                  style={{ height: "45px", width: "250px" }}
                  onChange={(e) => this.setMonthFilter(e)}
                  placeholder={c}
                />
              </Col>
              <Col>
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
      </div>
    );
  }
}
