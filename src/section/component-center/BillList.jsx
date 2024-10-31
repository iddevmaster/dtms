import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import axios from "axios";
import Bill from "./Bill";

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "32.33% 32.33% 32.33%",
  gridGap: "10px",
  padding: "10px",
};

const GetDataForm = () => {
  const { rm_id } = useParams();
  return <BillList rm_id={rm_id} />;
};
export default GetDataForm;

const BillList = ({ rm_id }) => {
  // const [main, setMain] = useState({});
  // const [student, setStudent] = useState({});
  const [payment, setPayment] = useState([]);
  const [fullname, setFullname] = useState("");

  const refreshData = async () => {
    try {
      const response = await axios.get(
        Common.API_URL + `register/result/core/${rm_id}`,
        Common.options
      );
      const res = response.data;
      const studentData = res.student;
      const paymentData = res.payment;
      // setMain(res.main);
      // setStudent(studentData);
      setPayment(paymentData);
      setFullname(
        `${studentData.student_firstname} ${studentData.student_lastname}`
      );
    } catch (error) {
      window.location = "/student";
      console.log(error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div>
      <Row>
        <Col sm={8} className="d-flex">
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
            <Bill rs={rs} key={index} />
          ))}
      </div>
    </div>
  );
};
