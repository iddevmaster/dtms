import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import axios from "axios";
const api_idcard = Common.API_ID_CARD;
export default class idCardManual extends Component {
  state = {
    msg: "",
    status: 0,
  };
  refreshData = async () => {
    try {
      await axios
        .get(api_idcard)
        .then((response) => {
          this.setState({
            msg: "เชื่อมต่อกับเครื่องอ่านบัตร",
            status: 1,
          });
        })
        .catch((err) => {
          this.setState({
            msg: "ยังไม่เชื่อมต่อกับเครื่องอ่านบัตร",
            status: 0,
          });
        });
    } catch (error) {
      this.setState({
        msg: "ยังไม่เชื่อมต่อกับเครื่องอ่านบัตร",
        status: 0,
      });
    }
  };

  targetLink = () => {
    window.open(api_idcard, "_blank");
  };
  componentDidMount() {
    this.refreshData();
  }
  render() {
    const { msg } = this.state;
    const { status } = this.state;
    return (
      <div>
        {" "}
        <Row>
          <Col sm={8}>
            <h3>ติดตั้งเครื่องอ่านบัตร</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ติดตั้งเครื่องอ่านบัตร</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Body>
            <Button variant="primary" onClick={this.targetLink}>
              อนุญาตการเข้าถึง
            </Button>{" "}
            <Button variant="success" onClick={this.refreshData}>
              รีเฟรช
            </Button>
            <h4>
              สถานะ :{" "}
              <span style={{ color: status === 1 ? "blue" : "red" }}>
                {msg}
              </span>
            </h4>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
