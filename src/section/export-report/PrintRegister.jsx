import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
import EmptyImage from "../../asset/images/profile.png";
const BASE_IMAGE = Common.IMAGE_URL;
const mystyle = {
  borderRadius: "20px",
  padding: "40px",
  border: "1px solid red",
};

export default class PrintRegister extends Component {
  state = {
    main: [],
    student: [],
    payment: [],
  };
  refreshData = async (rm_id) => {
    // const rm_id = this.props.rm_id;
    try {
      await axios
        .get(Common.API_URL + `register/result/core/${rm_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          //   console.log(res.main.rm_doc_number);
          let student = res.student;
          let main = res.main;
          let payment = res.payment;

          this.setState({
            student: student,
            main: main,
            payment: payment,
          });
        })
        .catch((err) => {
          // console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData(this.props.rm_id);
  }
  componentDidUpdate() {
    this.refreshData(this.props.rm_id);
  }
  render() {
    const { main } = this.state;
    const { student } = this.state;
    return (
      <div>
        {/* {JSON.stringify(main)} */}
        <div style={{ padding: "35px" }}>
          {main.school_id !== undefined && (
            <div>
              <div align="center">
                <h3>ใบสมัคร </h3>
                <p>{main.school_regisetmain_core.school_name}</p>
              </div>
              <table border="0" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>
                      เลขที่ใบสมัคร <strong> {main.rm_doc_number} </strong>{" "}
                      วันที่สมัคร{" "}
                      <strong>
                        {" "}
                        {Functions.format_date_time(main.create_date)}
                      </strong>
                    </td>
                    <td colSpan="1" rowSpan="4" align="right">
                      <Card.Img
                        variant="top"
                        src={
                          student.student_cover === undefined
                            ? EmptyImage
                            : BASE_IMAGE + student.student_cover
                        }
                        style={{ width: "150px", height: "150px" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ข้าพเจ้า{" "}
                      <strong>
                        {" "}
                        {student.student_prefix}
                        {student.student_firstname} {student.student_lastname}{" "}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ที่อยู่ <strong>{student.student_address}</strong> ตำบล /
                      แขวง{" "}
                      {student.student_core_location !== undefined && (
                        <span>
                          <strong>
                            {student.student_core_location.district_name}
                          </strong>{" "}
                          อำเภอ / เขต{" "}
                          <strong>
                            {student.student_core_location.amphur_name}
                          </strong>{" "}
                          จังหวัด{" "}
                          <strong>
                            {" "}
                            {student.student_core_location.province_name}{" "}
                            {student.student_core_location.zipcode}
                          </strong>
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      เบอร์โทร {student.student_mobile} อีเมล{" "}
                      {student.student_email === ""
                        ? "-"
                        : student.student_email}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>
                ขอสมัครเรียนฝึกหัดขับ{" "}
                <strong>
                  {Functions.vehicle_type_format(main.vehicle_type_id)}
                </strong>{" "}
                หลักสูตร{" "}
                <strong>
                  {main.course_regisetmain_core.course_code}{" "}
                  {main.course_regisetmain_core.course_name}
                </strong>
              </p>
              <div style={mystyle}>
                ข้าพเจ้าได้ทราบระเบียบการเรียนแล้วและขอรับรองดังต่อไปนี้
                <p>
                  1.ข้าพเจ้ามิได้เป็นโรคลมชัก บ้าหมู
                  หรือความผิดปกติของร่างกายและจิตใจ
                  อันเป็นอุปสรรคและความสามารถในการขับรถซึ่งอาจเกิดอันตรายแก่ตนเองและผู้อื่นได้
                </p>
                <p>
                  2.ข้าพเจ้าจะปฏิบัติตามกฎ ข้อบังคับ ระเบียบ ของ{" "}
                  {main.school_regisetmain_core.school_name} ทุกประการ
                  เมื่อชำระเงินค่าหลักสูตรแล้ว
                  และจะไม่เรียกร้องค่าหลักสูตรหรือค่าชดเชยใดๆ ทั้งสิ้น
                </p>
                <p>
                  3.กรณีหากมีการเกิดอุบัติเหตุในขณะการฝึกหัดและทดสอบขับรถข้าพเจ้าไม่เอาผิดกับผู้ใดในเหตุที่ได้กระทำไปโดยจะไม่เรียกร้องใดต่อ{" "}
                  {main.school_regisetmain_core.school_name}{" "}
                  ให้เป็นผู้รับผิดชอบใดๆ ทั้งสิ้น
                </p>
                <p>
                  {" "}
                  4.หากข้าพเจ้าทำความเสียหายแกทรัพย์สินของทาง{" "}
                  {main.school_regisetmain_core.school_name} หรือบุคคลอื่น
                  ข้าพเจ้ายินยอมชดเชยค่าเสียหายทั้งสิ้นโดยไม่มีเงื่อนไขใดๆ
                </p>
                <p>
                  5.ข้าพเจ้ามีสิทธิ์สอบใบอนุญาตขับขี่ได้ที่
                  {main.school_regisetmain_core.school_name} จากวันสมัครได้ภายใน
                  90 วัน มิฉะนั้นถือว่าสละสิทธิ์
                </p>
                <p>
                  6.
                  ข้าพเจ้ายินยอมให้มีการบันทึกข้อมูลส่วนตัวของข้าพเจ้าให้กับทาง{" "}
                  {main.school_regisetmain_core.school_name}{" "}
                </p>
              </div>
              <div style={{ paddingTop: "30px" }}>
                <Row>
                  <Col style={{ textAlign: "center" }}>
                    <p>
                      {" "}
                      ลงชื่อ................................................เจ้าหน้าที่
                    </p>
                    <p>
                      {" "}
                      (.......................................................)
                    </p>
                  </Col>
                  <Col style={{ textAlign: "center" }}>
                    <p>
                      {" "}
                      ลงชื่อ................................................ผู้สมัครเรียน
                    </p>
                    <p>
                      {" "}
                      (.......................................................)
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
