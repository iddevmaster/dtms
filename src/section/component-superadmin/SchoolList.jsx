import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
const domain = window.location.protocol + "//" + window.location.host;
export default class SchoolList extends Component {
  state = {
    page: 0,
    per_page: 25,
    search_value: "",
    data: [],
    isOpenModal: false,
    school_id: "",
  };

  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + "school/all",
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
          //   console.log(res.data);
          //   alert(JSON.stringify(res.data));
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL + `school/${this.state.school_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false, school_id: "" });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };
  targetLink = (school_id) => {
    let url = `${domain}/${school_id}/login`;
    window.open(url, "_blank");
  };
  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    const { isOpenModal } = this.state;
    // const { school_id } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ข้อมูลโรงเรียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>

              <Breadcrumb.Item active>ข้อมูลโรงเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางข้อมูลโรงเรียน</Col>
              <Col sm={4}>
                {" "}
                <div align="right">
                  <LinkContainer to="/school/addform">
                    <Button>เพิ่มข้อมูล</Button>
                  </LinkContainer>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>โรงเรียน</th>
                  <th>สถานะ</th>
                  <th>วันที่ทำรายการ</th>
                  <th>URL เข้าสู่ระบบ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{rs.school_name}</td>
                    <td>{rs.active === 1 ? "กำลังใช้งาน" : "ปิดการใช้งาน"}</td>
                    <td>{Functions.format_date_time(rs.create_date)}</td>
                    <td>
                      {`${domain}/${rs.school_id}/login`}
                      {/* <Button
                        size="sm"
                        onClick={(e) => this.targetLink(rs.school_id)}
                      >
                        {`${domain}/${rs.school_id}/login`}
                      </Button> */}
                    </td>
                    <td>
                      <LinkContainer to={`/school/updateform/${rs.school_id}`}>
                        <Button size="sm" variant="warning">
                          แก้ไข
                        </Button>
                      </LinkContainer>{" "}
                      <Button
                        size="sm"
                        variant="danger"
                        type="button"
                        onClick={(e) =>
                          this.setState({
                            isOpenModal: true,
                            school_id: rs.school_id,
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
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>ยืนยันการลบหรือไม่ !</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModal: false })}
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
