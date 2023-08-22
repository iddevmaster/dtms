import React, { Component, Suspense } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import axios from "axios";
import Loading_2 from "../../asset/images/Loading_2.gif";

const CourseSeminarForm = React.lazy(() => import("./CourseSeminarForm"));
const CourseSeminarList = React.lazy(() => import("./CourseSeminarList"));

const GetDataForm = () => {
  const { course_id } = useParams();
  return <CourseSeminar course_id={course_id} />;
};
export default GetDataForm;
class CourseSeminar extends Component {
  state = {
    data: [],
    course_name: "",
  };

  refreshData = async () => {
    const { course_id } = this.props;
    try {
      await axios
        .get(Common.API_URL + `course/${course_id}`, Common.options)
        .then((response) => {
          // console.log(response);
          let res = response.data;
          this.setState({
            data: res,
            course_name: res.course_code + " " + res.course_name,
          });
        });
    } catch (error) {
      console.log(error);
      window.location = "/course";
    }
  };
  componentDidMount() {
    this.refreshData();
  }
  render() {
    const { course_id } = this.props;
    const { course_name } = this.state;
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
              <h3>{course_name}</h3>
            </Col>
            <Col sm={4}>
              <Breadcrumb>
                <LinkContainer to="/">
                  <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/course">
                  <Breadcrumb.Item>หลักสูตร</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>กำหนดวันอบรมทฤษฎี</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey="list"
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
          >
            <Tab eventKey="list" title="วันที่อบรม">
              <CourseSeminarList course_id={course_id} />
            </Tab>
            <Tab eventKey="form" title="กำหนดวันอบรมทฤษฎี">
              <CourseSeminarForm course_id={course_id} />
            </Tab>
          </Tabs>
        </Suspense>
      </div>
    );
  }
}
