import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Common from "../../common";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Functions from "../../functions";
export default class CourseSubjectTheory extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    // console.log(this.props);
  }

  state = {
    vehicle_type_id: this.props.vehicle_type_id,
    course_id: this.props.course_id,
    course_theory_hour: this.props.course_theory_hour,

    school_id: Common.getUserLoginData.school_id,
    data: [],
    subject_learn_type: 1,

    learn_time: 0,
    subject_id: 0,
    sum_hour_total: 0,

    isOpenModal: false,
    msg: "",
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL +
            `course/subject/${this.state.subject_learn_type}/${this.state.vehicle_type_id}/${this.state.school_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };
  addSubjectInCourse = (learn_time, subject_id) => {
    try {
      axios
        .post(
          Common.API_URL + "course/s/add_subject",
          {
            learn_time: learn_time,
            subject_learn_type: this.state.subject_learn_type,
            subject_id: subject_id,
            course_id: this.state.course_id,
          },
          Common.options
        )
        .then((res) => {
          let r = res.data;
          this.setState({ sum_hour_total: r.sum_hour_total });
        })
        .catch((err) => {
          // Handle error
          // alert("ระบุชั่วโมงเกินกำหนด");
          // console.log(err);
          this.setState({
            isOpenModal: true,
            msg: "ระบุชั่วโมงเกินกำหนด !",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  DeleteSubjectInCourse = async () => {
    try {
      await axios
        .delete(
          Common.API_URL + `course/s/${this.state.course_id}`,
          Common.options
        )
        .then((res) => {
          // let r = res.data;
        });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData();
    this.DeleteSubjectInCourse();
  }
  render() {
    const { data } = this.state;
    const { sum_hour_total } = this.state;
    const { course_theory_hour } = this.props;

    const { isOpenModal } = this.state;
    const { msg } = this.state;
    return (
      <div>
        <Card border="success">
          <Card.Header>
            ประเภทการเรียน <u>ทฤษฎี</u>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>รายวิชา</th>
                  <th>ประเภทวิชา</th>
                  <th style={{ width: "20%" }}>กำหนดชั่วโมง</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td>
                      {rs.subject_code} {rs.subject_name}
                    </td>
                    <td>{Functions.subject_type[rs.subject_type - 1]}</td>
                    <td>
                      <Form.Control
                        type="number"
                        onChange={(e) =>
                          this.addSubjectInCourse(e.target.value, rs.subject_id)
                        }
                        id={`hour-${index}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div align="center">
              <h4>
                <span style={{ color: "red" }}> {sum_hour_total}</span> /
                <span style={{ color: "blue" }}> {course_theory_hour}</span>
              </h4>
            </div>
          </Card.Body>
        </Card>

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
      </div>
    );
  }
}
