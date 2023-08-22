import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import { useParams } from "react-router-dom";
import axios from "axios";

const GetDataForm = () => {
  const { school_id } = useParams();

  return <SchoolUpdateForm school_id={school_id} />;
};
export default GetDataForm;

class SchoolUpdateForm extends Component {
  state = {
    school_id: this.props.school_id,
    school_name: "",
    active: 0,
    data: [],
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `school/${this.state.school_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ school_name: res.school_name });
        });
    } catch (error) {
      console.log(error);
      window.location = "/school-list";
    }
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { school_name } = this.state;
    const { school_id } = this.state;
    // const school_id = window.location.href.split("/")[4];

    const handleSubmit = (e) => {
      e.preventDefault();
      try {
        axios
          .put(
            Common.API_URL + `school/${school_id}`,
            {
              school_name: school_name,
              active: 1,
            },
            Common.options
          )
          .then((res) => {
            // console.log(res);
            // console.log(res.data);
            window.location = "/school";
          });
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>เพิ่มโรงเรียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/school-list">
                <Breadcrumb.Item>ข้อมูลโรงเรียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>เพิ่มโรงเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Body>
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>ชื่อโรงเรียน</Form.Label>

                <Form.Control
                  type="text"
                  onChange={(e) =>
                    this.setState({ school_name: e.target.value })
                  }
                  defaultValue={school_name}
                  required
                />
              </Form.Group>
              <div align="center">
                <Button variant="primary" type="submit">
                  บันทึก
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
