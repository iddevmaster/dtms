import React, { Component, Suspense } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import axios from "axios";
import Loading_2 from "../../asset/images/Loading_2.gif";

const CourseSubjectList = React.lazy(() => import("./CourseSubjectList"));
const CourseSubjectTheory = React.lazy(() => import("./CourseSubjectTheory"));
const CourseSubjectPractice = React.lazy(() =>
  import("./CourseSubjectPractice")
);

const GetDataForm = () => {
  const { course_id } = useParams();

  return <CourseSubject course_id={course_id} />;
};
export default GetDataForm;
class CourseSubject extends Component {
  state = {
    course_id: this.props.course_id,
    data: [],
    course_name: "",
    isOpenModal: false,
    msg: "",
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `course/${this.state.course_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res, course_name: res.course_name });
        });
    } catch (error) {
      console.log(error);
      window.location = "/course";
    }
  };
  setCourseReady = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `course/s/${this.state.course_id}`,
          Common.options
        )
        .then((response) => {
          window.location = "/course/subject/" + this.state.course_id;
        });
    } catch (error) {
      // console.log(error);
      // alert("กำหนดชั่วโมงในรายวิชาให้ครบและถูกต้อง");
      this.setState({
        isOpenModal: true,
        msg: "กำหนดชั่วโมงในรายวิชาให้ครบและถูกต้อง !",
      });
    }
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    const { course_name } = this.state;
    const { isOpenModal } = this.state;
    const { msg } = this.state;
    const course_readey = data.course_readey;
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
          <Row>
            <Col sm={8}>
              <h3>
                จัดการรายวิชาหลักสูตร <u>{course_name}</u>
              </h3>
            </Col>
            <Col sm={4}>
              <Breadcrumb>
                <LinkContainer to="/">
                  <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/course">
                  <Breadcrumb.Item>หลักสูตร</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>จัดการรายวิชา</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <div>
            <h5>
              ประเภทยานพาหนะ : {data.join_vehicle_type_id} | ทฤษฏี :{" "}
              {data.course_theory_hour} ชั่วโมง | ปฏิบัติ :{" "}
              {data.course_practice_hour} ชั่วโมง
            </h5>
          </div>
          {/* CourseSubjectList */}
          {course_readey === 1 && (
            <CourseSubjectList
              course_id={data.course_id}
              school_id={data.school_id}
            />
          )}

          <Row>
            <Col>
              {data.vehicle_type_id !== undefined && course_readey === 0 && (
                <CourseSubjectTheory
                  course_id={data.course_id}
                  vehicle_type_id={data.vehicle_type_id}
                  course_theory_hour={data.course_theory_hour}
                />
              )}
            </Col>
            <Col>
              {data.vehicle_type_id !== undefined && course_readey === 0 && (
                <CourseSubjectPractice
                  course_id={data.course_id}
                  vehicle_type_id={data.vehicle_type_id}
                  course_practice_hour={data.course_practice_hour}
                />
              )}
            </Col>
          </Row>
          {course_readey === 0 && (
            <div style={{ padding: "25px" }} align="center">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={this.setCourseReady}
              >
                ตั้งค่าหลักสูตรนี้
              </Button>
            </div>
          )}

          <Modal show={isOpenModal} size="sm">
            <Modal.Header>
              <Modal.Title>คำเตือน</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msg}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={(e) => this.setState({ isOpenModal: false })}
              >
                ตกลง
              </Button>
            </Modal.Footer>
          </Modal>
        </Suspense>
      </div>
    );
  }
}
