import React, { Component, Suspense } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
import Loading_2 from "../../asset/images/Loading_2.gif";
const pr_receipt_issuer = Common.getUserLoginData.full_name;
const GetDataForm = () => {
  const { rm_id } = useParams();

  return <PaymentRegisterForm rm_id={rm_id} />;
};
export default GetDataForm;
class PaymentRegisterForm extends Component {
  state = {
    rm_id: this.props.rm_id,
    main: [],
    student: [],
    payment: [],

    pr_name: "",
    pr_tax_number: "",
    pr_address: "",
    pr_discount_percent: 0,
    pr_discount_amount: 0,
    pr_total_amount: 0,
    pr_pay: 0,
    pr_debt: 0,
    pr_remark: "",
    line: [],

    // ตั้งไว้คำนวณ
    pr_total_amount2: 0,
    msg: "",
  };

  handleSubmit = () => {
    if (this.state.pr_pay === "" || parseFloat(this.state.pr_pay) === 0) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    if (this.checkNullList() === false) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "register/payment",
          {
            pr_name: this.state.pr_name,
            pr_tax_number: this.state.pr_tax_number,
            pr_address: this.state.pr_address,
            pr_discount_percent: this.state.pr_discount_percent,
            pr_discount_amount: this.state.pr_discount_amount,
            pr_total_amount: this.state.pr_total_amount,
            pr_pay: this.state.pr_pay,
            pr_debt: this.state.pr_debt,
            pr_remark: this.state.pr_remark,
            pr_receipt_issuer: pr_receipt_issuer,
            rm_id: this.state.rm_id,
            line: this.state.line,
          },
          Common.options
        )
        .then((res) => {
          window.location.href = "/register";
        });
    } catch (error) {
      console.log(error);
    }
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
          let main = res.main;
          let payment = res.payment;
          let address =
            student.student_address +
            " " +
            student.student_address +
            " ตำบล/แขวง " +
            student.student_core_location.district_name +
            " เขต/อำเภอ " +
            student.student_core_location.amphur_name +
            " จังหวัด " +
            student.student_core_location.province_name +
            " " +
            student.student_core_location.zipcode;
          // ยอดค้างชำระล่าสุด
          let price;
          if (payment.length > 0) {
            price = payment[0].pr_debt;
          } else {
            price = res.course_price;
          }
          // console.log(price);
          this.setState({
            main: main,
            student: res.student,
            payment: res.payment,
            pr_name:
              student.student_prefix +
              student.student_firstname +
              " " +
              student.student_lastname,
            pr_tax_number: res.student.student_id_number,
            pr_address: address,
            pr_total_amount: price,
            pr_debt: price,
            line: [
              {
                pl_name:
                  main.course_regisetmain_core.course_code +
                  " " +
                  main.course_regisetmain_core.course_name,
                pl_unit: 1,
                pl_price_per_unit: price,
                pl_price_sum: price,
              },
            ],
            pr_total_amount2: price,
          });
        })
        .catch((err) => {
          window.location.href = "/register";
        });
    } catch (error) {
      window.location.href = "/register";
      console.log(error);
    }
  };
  calPrice = (index) => {
    let cal;
    let chkNan;
    let pl_unit = document.getElementById("pl_unit_" + index).value;
    let pl_price_per_unit = document.getElementById(
      "pl_price_per_unit_" + index
    ).value;
    cal = parseInt(pl_unit) * parseFloat(pl_price_per_unit);
    chkNan = !isNaN(cal) ? cal : 0;
    document.getElementById("pl_price_sum_" + index).value = chkNan;
    this.UpdateRowPrice(index);
    this.sumAllPrice();
    document.getElementById("pr_pay").value = 0;
    this.setState({
      pr_pay: 0,
    });
  };

  addRowPrice = async () => {
    const { line } = this.state;
    // console.log(line);
    const arr = {
      pl_name: "",
      pl_unit: 1,
      pl_price_per_unit: 0,
      pl_price_sum: 0,
    };
    line.push(arr);

    await new Promise((accept) =>
      this.setState(
        {
          line: line,
        },
        accept
      )
    );
    this.sumAllPrice();
    this.setResult();
  };
  UpdateRowPrice = async (index) => {
    const { line } = this.state;
    let data = line[index];
    delete line[index];
    let pl_name = document.getElementById("pl_name_" + index).value;
    let pl_unit = document.getElementById("pl_unit_" + index).value;
    let pl_price_per_unit = document.getElementById(
      "pl_price_per_unit_" + index
    ).value;
    let pl_price_sum = document.getElementById("pl_price_sum_" + index).value;

    data["pl_name"] = pl_name;
    data["pl_unit"] = pl_unit;
    data["pl_price_per_unit"] = pl_price_per_unit;
    data["pl_price_sum"] = pl_price_sum;
    // line.push(data);
    // console.log(line);
    var filtered = line.filter(function (item) {
      return item !== null;
    });
    filtered.push(data);
    await new Promise((accept) =>
      this.setState(
        {
          line: filtered,
        },
        accept
      )
    );
    this.sumAllPrice();
    this.setResult();
  };

  deleteRowPrice = async (index) => {
    const { line } = this.state;
    delete line[index];
    var filtered = line.filter(function (item) {
      return item !== null;
    });

    await new Promise((accept) =>
      this.setState(
        {
          line: filtered,
        },
        accept
      )
    );
    this.sumAllPrice();
    this.setResult();
  };

  sumAllPrice = () => {
    let sum = 0;
    const { line } = this.state;

    for (let i = 0; i < line.length; i++) {
      let obj = line[i];
      // console.log(obj);
      if (obj !== undefined) {
        sum += parseFloat(obj.pl_price_sum);
      }
    }
    this.setState({
      pr_total_amount: sum,
      pr_total_amount2: sum,
      pr_debt: sum,
    });
  };

  checkNullList = () => {
    const { line } = this.state;

    for (let i = 0; i < line.length; i++) {
      let obj = line[i];
      // console.log(obj);
      if (obj !== undefined) {
        if (obj.pl_name === undefined || obj.pl_name === "") {
          return false;
        }
        if (
          obj.pl_unit === undefined ||
          obj.pl_unit === "" ||
          obj.pl_unit <= 0
        ) {
          return false;
        }
        if (
          obj.pl_price_per_unit === undefined ||
          obj.pl_price_per_unit === "" ||
          obj.pl_price_per_unit <= 0
        ) {
          return false;
        }
      }
    }
    return true;
  };

  calDiscountPercent = () => {
    const { pr_total_amount2 } = this.state;
    let chkNan;
    let pr_discount_percent = document.getElementById(
      "pr_discount_percent"
    ).value;
    let r =
      ((parseFloat(Functions.valNan(pr_discount_percent)) * 1) / 100) *
      parseFloat(pr_total_amount2); /// เปอร์เซ็นของยอดรวม
    chkNan = !isNaN(r) ? r : 0;
    document.getElementById("pr_discount_amount").value = parseFloat(
      chkNan.toFixed(2)
    );
    let amount = parseFloat(pr_total_amount2) - parseFloat(chkNan);

    this.setState({
      pr_discount_percent: pr_discount_percent,
      pr_discount_amount: chkNan.toFixed(2),
      pr_total_amount: !isNaN(amount) ? amount : pr_total_amount2,
      pr_debt: !isNaN(amount) ? amount : pr_total_amount2,
      pr_pay: 0,
    });

    document.getElementById("pr_pay").value = 0;
    // console.log(isNaN(amount));
  };
  calDiscountAmount = () => {
    const { pr_total_amount2 } = this.state;
    let chkNan;
    let pr_discount_amount =
      document.getElementById("pr_discount_amount").value;
    let r =
      (parseFloat(Functions.valNan(pr_discount_amount)) /
        parseFloat(pr_total_amount2)) *
      100; /// เปอร์เซ็นของยอดรวม
    chkNan = !isNaN(r) ? r : 0;
    document.getElementById("pr_discount_percent").value = parseFloat(
      chkNan.toFixed(2)
    );
    let amount =
      parseFloat(pr_total_amount2) -
      parseFloat(Functions.valNan(pr_discount_amount));
    // console.log(pr_discount_amount);
    // console.log(pr_total_amount2);
    this.setState({
      pr_discount_percent: chkNan.toFixed(2),
      pr_discount_amount: pr_discount_amount,
      pr_total_amount: !isNaN(amount) ? amount : pr_total_amount2,
      pr_debt: !isNaN(amount) ? amount : pr_total_amount2,
      pr_pay: 0,
    });

    document.getElementById("pr_pay").value = 0;
  };

  payForm = (e) => {
    const { pr_total_amount } = this.state;
    let pr_pay = e.target.value;
    let cal = parseFloat(pr_total_amount) - parseFloat(pr_pay);
    let chkNan = !isNaN(cal) ? cal : 0;
    this.setState({ pr_pay: pr_pay, pr_debt: chkNan.toFixed(2) });
  };
  setResult = () => {
    // const { pr_total_amount } = this.state;
    document.getElementById("pr_discount_percent").value = 0;
    document.getElementById("pr_discount_amount").value = 0;
    document.getElementById("pr_debt").value = 0;
    // document.getElementById("pr_pay").value = 0;
    this.setState({
      pr_discount_percent: 0,
      pr_discount_amount: 0,
      pr_pay: 0,
      // pr_debt: pr_total_amount,
    });
  };
  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { pr_name } = this.state;
    const { pr_tax_number } = this.state;
    const { pr_address } = this.state;
    const { pr_discount_percent } = this.state;
    const { pr_discount_amount } = this.state;
    const { pr_total_amount } = this.state;
    const { pr_debt } = this.state;
    const { line } = this.state;
    const { msg } = this.state;

    return (
      <div>
        <Suspense
          fallback={
            <div align="center">
              <Card.Img
                variant="top"
                src={Loading_2}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          }
        >
          {/* {JSON.stringify(line)} */}

          <Row>
            <Col sm={8}>
              <h3>ชำระเงินค่าสมัครเรียน</h3>
            </Col>
            <Col sm={4}>
              <Breadcrumb>
                <LinkContainer to="/">
                  <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Breadcrumb.Item>ข้อมูลการลงทะเบียน</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>ชำระเงินค่าสมัครเรียน</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>

          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>ชื่อ - นามสกุล</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={pr_name}
                      onChange={(e) =>
                        this.setState({ pr_name: e.target.value })
                      }
                      isValid
                    />
                  </Form.Group>
                </Col>
                <Col sm="4" lg="3">
                  <Form.Group>
                    <Form.Label>เลขที่เสียภาษี</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={pr_tax_number}
                      onChange={(e) =>
                        this.setState({ pr_tax_number: e.target.value })
                      }
                      isValid
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>ที่อยู่</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={pr_address}
                      onChange={(e) =>
                        this.setState({ pr_address: e.target.value })
                      }
                      isValid
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Table striped>
                <thead>
                  <tr>
                    <th>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={this.addRowPrice}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </Button>
                    </th>
                    <th>รายการ</th>
                    <th>หน่วย</th>
                    <th>ราคาต่อหน่วย</th>
                    <th>จำนวนเงิน (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {line.map((rs, index) => (
                    <tr key={index}>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={index === 0 ? true : false}
                          onClick={() => [this.deleteRowPrice(index)]}
                        >
                          <i className="fa fa-minus" aria-hidden="true"></i>
                        </Button>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          id={`pl_name_${index}`}
                          onChange={() => [this.UpdateRowPrice(index)]}
                          value={rs.pl_name}
                          isInvalid
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={rs.pl_unit}
                          style={{ textAlign: "right" }}
                          id={`pl_unit_${index}`}
                          onChange={() => [this.calPrice(index)]}
                          isInvalid
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={rs.pl_price_per_unit}
                          style={{ textAlign: "right" }}
                          id={`pl_price_per_unit_${index}`}
                          onChange={() => [this.calPrice(index)]}
                          isInvalid
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={rs.pl_price_sum}
                          style={{ textAlign: "right" }}
                          id={`pl_price_sum_${index}`}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>ส่วนลด (%)</Form.Label>
                    <Form.Control
                      type="number"
                      id="pr_discount_percent"
                      onChange={this.calDiscountPercent}
                      value={pr_discount_percent}
                      isInvalid
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>เป็นจำนวนเงิน</Form.Label>
                    <Form.Control
                      type="number"
                      id="pr_discount_amount"
                      onChange={this.calDiscountAmount}
                      value={pr_discount_amount}
                      isInvalid
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>หมายเหตุ (ถ้ามี)</Form.Label>
                    <Form.Control
                      type="text"
                      id="pr_remark"
                      onChange={(e) =>
                        this.setState({ pr_remark: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group size="lg">
                    <Form.Label>รวมค่าชำระสุทธิ</Form.Label>
                    <Form.Control
                      id="pr_total_amount"
                      type="text"
                      style={{
                        textAlign: "right",
                        height: "65px",
                        fontSize: "30px",
                      }}
                      // onChange={this.sumAllPrice}
                      value={Functions.formatnumberWithcomma(
                        pr_total_amount.toFixed(2)
                      )}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>จำนวนเงินที่ต้องชำระ **</Form.Label>
                    <Form.Control
                      type="number"
                      style={{
                        textAlign: "right",
                        height: "85px",
                        fontSize: "35px",
                      }}
                      onChange={this.payForm}
                      id="pr_pay"
                      isInvalid
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>คงค้างชำระ</Form.Label>
                    <Form.Control
                      type="text"
                      id="pr_debt"
                      value={pr_debt}
                      readOnly
                      style={{
                        textAlign: "right",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>

            <div align="center" style={{ paddingTop: "15px" }}>
              {msg !== "" && <Alert variant="danger">{msg}</Alert>}
              <Button variant="primary" onClick={this.handleSubmit}>
                บันทึกการชำระเงิน
              </Button>
            </div>
          </Card>
        </Suspense>
      </div>
    );
  }
}
