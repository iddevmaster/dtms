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

const TeacherLicence = React.lazy(() => import("./TeacherLicence"));
const TeacherIncome = React.lazy(() => import("./TeacherIncome"));
const TeacherCover = React.lazy(() => import("./TeacherCover"));

const GetDataForm = () => {
  const { teacher_id } = useParams();
  return <TeacherForm teacher_id={teacher_id} />;
};
export default GetDataForm;
class TeacherForm extends Component {
  state = {
    data: [],
    full_name: "",
  };

  refreshData = async () => {
    const { teacher_id } = this.props;
    try {
      await axios
        .get(Common.API_URL + `teacher/${teacher_id}`, Common.options)
        .then((response) => {
          // console.log(response);
          let res = response.data;
          this.setState({
            data: res,
            full_name: res.teacher_firstname + " " + res.teacher_lastname,
          });
        });
    } catch (error) {
      console.log(error);
      window.location = "/teacher";
    }
  };
  componentDidMount() {
    this.refreshData();
  }
  render() {
    const { teacher_id } = this.props;
    const { full_name } = this.state;
    const { data } = this.state;
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
              <h3>รายละเอียดครู : {full_name}</h3>
            </Col>
            <Col sm={4}>
              <Breadcrumb>
                <LinkContainer to="/">
                  <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/teacher">
                  <Breadcrumb.Item>ทะเบียนครู</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>รายละเอียดครู</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey="home"
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="ใบอนุญาต">
              <TeacherLicence teacher_id={teacher_id} />
            </Tab>
            <Tab eventKey="profile" title="ค่าตอบแทน">
              <TeacherIncome teacher_id={teacher_id} />
            </Tab>
            <Tab eventKey="contact" title="รูปประจำตัว">
              {full_name !== "" && (
                <TeacherCover teacher_id={teacher_id} data={data} />
              )}
            </Tab>
          </Tabs>
        </Suspense>
      </div>
    );
  }
}
