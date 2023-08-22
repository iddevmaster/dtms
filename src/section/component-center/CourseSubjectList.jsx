import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
export default class CourseSubjectList extends Component {
  state = {
    course_id: this.props.course_id,
    school_id: this.props.school_id,
    data: [],
    isOpenModal: false,
    msg: "ตั้งค่าหลักสูตรใหม่ หมายถึง การลบรายวิชาทั้งหมดออกในหลักสูตรเพื่อจัดการรายวิชาใหม่ คุณแน่ใจที่จะทำรายการนี้หรือไม่ !",
  };
  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `course/s/list/${this.state.course_id}`,
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
  DeleteSubjectInCourse = async () => {
    try {
      await axios
        .delete(
          Common.API_URL + `course/s/${this.state.course_id}`,
          Common.options
        )
        .then((res) => {
          window.location = "/course/subject/" + this.state.course_id;
        });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData();
  }
  render() {
    const { school_id } = this.state;
    const { data } = this.state;
    const { isOpenModal } = this.state;
    const { msg } = this.state;
    return (
      <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr align="center">
              <th>#</th>
              <th>รายวิชา</th>
              <th>ประเภทวิชา</th>
              <th>ประเภทการเรียน</th>
              <th>ชั่วโมงในการเรียน</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rs, index) => (
              <tr key={index}>
                <td align="center">{index + 1}</td>
                <td>
                  {rs.subject_coursewithsubject.subject_code}{" "}
                  {rs.subject_coursewithsubject.subject_name}
                </td>
                <td align="center">
                  {
                    Functions.subject_type[
                      rs.subject_coursewithsubject.subject_type - 1
                    ]
                  }
                </td>
                <td align="center">
                  {Functions.subject_learn_type[rs.subject_learn_type - 1]}
                </td>
                <td align="center">{rs.learn_time}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {Common.getUserLoginData.school_id === school_id && (
          <div style={{ padding: "25px" }} align="center">
            <Button
              variant="outline-danger"
              size="lg"
              onClick={(e) => this.setState({ isOpenModal: true })}
            >
              ตั้งค่าหลักสูตรใหม่
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
              ยกเลิก
            </Button>
            <Button
              variant="danger"
              onClick={(e) => this.DeleteSubjectInCourse()}
            >
              ตกลง
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
