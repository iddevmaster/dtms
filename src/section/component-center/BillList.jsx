import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { LinkContainer } from "react-router-bootstrap";
// import Button from "react-bootstrap/Button";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";

const gridContainer = {
  display: "grid",
  //   gridTemplateColumns: "auto auto auto auto", //4 colum
  gridTemplateColumns: "32.33% 32.33% 32.33%",
  gridGap: "10px",
  //   backgroundColor: "#2196F3",
  padding: "10px",
};

const GetDataForm = () => {
  const { rm_id } = useParams();

  return <BillList rm_id={rm_id} />;
};
export default GetDataForm;
class BillList extends Component {
  state = {
    rm_id: this.props.rm_id,
    main: {},
    student: {},
    payment: [],
    fullname: "",
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `register/result/core/${this.state.rm_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          let student = res.student;
          let payment = res.payment;
          this.setState({
            main: res.main,
            student: student,
            payment: payment,
            fullname:
              student.student_firstname + " " + student.student_lastname,
          });
        })
        .catch((err) => {
          // Handle error
          window.location = "/student";
          // console.log(err);
        });
    } catch (error) {
      window.location = "/student";
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { payment } = this.state;
    const { fullname } = this.state;
    // console.log(schedule.length);
    return (
      <div>
        {/* {JSON.stringify(main)} */}
        <Row>
          <Col sm={8}>
            <h3>ใบเสร็จ : {fullname}</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/register">
                <Breadcrumb.Item>ข้อมูลการลงทะเบียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ใบเสร็จ</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <div style={gridContainer}>
          {payment.map((rs, index) => (
            <div key={index}>
              <Card>
                <Card.Body>
                  <div align="center">
                    <h4>เลขที่ใบเสร็จ {rs.pr_number}</h4>
                  </div>

                  <Table>
                    <tbody>
                      <tr>
                        <th>วันที่ออกใบเสร็จ</th>
                        <td>{Functions.format_date_time(rs.create_date)}</td>
                      </tr>
                      <tr>
                        <th>ชื่อ</th>
                        <td>{rs.pr_name}</td>
                      </tr>
                      <tr>
                        <th>เลขที่เสียภาษี</th>
                        <td>{rs.pr_tax_number}</td>
                      </tr>
                      <tr>
                        <th>ที่อยู่</th>
                        <td>{rs.pr_address}</td>
                      </tr>
                      <tr>
                        <th>ผู้ออกใบเสร็จ</th>
                        <td>{rs.pr_receipt_issuer}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>รายการ</th>
                        <th>หน่วย</th>
                        <th>ราคาต่อหน่วย</th>
                        <th>จำนวนเงิน(บาท)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rs.payment_child.map((rs2, index) => (
                        <tr key={index}>
                          <td>{rs2.pl_name}</td>
                          <td align="right">{rs2.pl_unit}</td>
                          <td align="right">{rs2.pl_price_per_unit}</td>
                          <td align="right">
                            {Functions.formatnumberWithcomma(rs2.pl_price_sum)}
                          </td>
                        </tr>
                      ))}
                      <tr align="right">
                        <td colSpan={3}>ส่วนลด (%)</td>
                        <td>{rs.pr_discount_percent}</td>
                      </tr>
                      <tr align="right">
                        <td colSpan={3}>เป็นจำนวนเงิน</td>
                        <td>
                          {Functions.formatnumberWithcomma(
                            rs.pr_discount_amount
                          )}
                        </td>
                      </tr>
                      <tr align="right">
                        <td colSpan={3}>รวมค่าชำระสุทธิ</td>
                        <td>
                          {Functions.formatnumberWithcomma(rs.pr_total_amount)}
                        </td>
                      </tr>
                      <tr align="right">
                        <td colSpan={3}>
                          <strong>จำนวนเงินที่ชำระ</strong>
                        </td>
                        <td>{Functions.formatnumberWithcomma(rs.pr_pay)}</td>
                      </tr>
                      <tr align="right">
                        <td colSpan={3}>ยอดค้างชำระ</td>
                        <td>{Functions.formatnumberWithcomma(rs.pr_debt)}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <p>หมายเหตุ : {rs.pr_remark}</p>
                  <p>รหัสใบเสร็จ : {rs.pr_id}</p>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
