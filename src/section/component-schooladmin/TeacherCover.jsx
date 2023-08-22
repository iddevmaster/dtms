import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Common from "../../common";
import axios from "axios";
import EmptyImage from "../../asset/images/profile.png";
const BASE_IMAGE = Common.IMAGE_URL;
export default class TeacherCover extends Component {
  state = {
    teacher_prefix: "",
    teacher_firstname: "",
    teacher_lastname: "",
    teacher_id_number: "",
    teacher_gender: 0,
    teacher_email: "",
    teacher_cover: "",
    image_cover: EmptyImage,

    data: this.props.data,
    teacher_id: this.props.teacher_id,
    branch_id: Common.getUserLoginData.branch_id,
    school_id: Common.getUserLoginData.school_id,
    isOpenModal: false,
    msg: "",
    filetmp: "",
  };

  uploadImageProfile = async (event) => {
    let file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      await axios
        .post(
          Common.API_URL +
            `general/upload/profile?school_id=${this.state.school_id}`,
          formdata,
          Common.options
        )
        .then((res) => {
          if (this.state.teacher_cover !== "") {
            this.DeleteImage(this.state.teacher_cover);
          }

          let r = res.data;
          this.setState({
            image_cover: r.file_url,
          });
          this.handleSubmitEdit(r.file_path);
          // console.log(r.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmitEdit = async (teacher_cover) => {
    try {
      await axios
        .put(
          Common.API_URL + `teacher/${this.state.teacher_id}`,
          {
            teacher_prefix: this.state.teacher_prefix,
            teacher_firstname: this.state.teacher_firstname,
            teacher_lastname: this.state.teacher_lastname,
            teacher_id_number: this.state.teacher_id_number,
            teacher_gender: this.state.teacher_gender,
            teacher_phone: this.state.teacher_phone,
            teacher_email: this.state.teacher_email,
            teacher_cover: teacher_cover,
            active: this.state.active,
            branch_id: this.state.branch_id,
            school_id: this.state.school_id,
          },
          Common.options
        )
        .then((res) => {
          window.location = "/teacher";
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleEdit = (res) => {
    let r = res;
    this.setState({
      teacher_id: r.teacher_id,
      teacher_prefix: r.teacher_prefix,
      teacher_firstname: r.teacher_firstname,
      teacher_lastname: r.teacher_lastname,
      teacher_id_number: r.teacher_id_number,
      teacher_gender: r.teacher_gender,
      teacher_phone: r.teacher_phone,
      teacher_email: r.teacher_email,
      teacher_cover: r.teacher_cover,
      active: r.active,
      branch_id: r.branch_id,
      school_id: r.school_id,
      image_cover:
        r.teacher_cover === "" ? EmptyImage : BASE_IMAGE + r.teacher_cover,
      msg: "",
      teacher_cover_compair: r.teacher_cover,
    });
  };

  componentDidMount() {
    this.handleEdit(this.state.data);
  }

  DeleteImage = (cover) => {
    try {
      axios
        .delete(
          Common.API_URL + `general/remove/?file_path=${cover}`,
          Common.options
        )
        .then((res) => {
          //
        });
    } catch (error) {
      console.log(error);
    }
  };

  readURL = (event, id) => {
    if (event.target.files && event.target.files[0]) {
      var output = document.getElementById(id);
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
      };

      this.setState({
        filetmp: event,
      });
    }
  };
  submit = () => {
    this.uploadImageProfile(this.state.filetmp);
  };

  render() {
    const { image_cover } = this.state;
    const { filetmp } = this.state;
    return (
      <div>
        {/* {JSON.stringify(data)} */}
        <Card border="info">
          <Card.Body>
            <div align="center">
              <Card.Img
                variant="top"
                id="blah"
                src={image_cover}
                style={{ width: "200px", height: "200px" }}
              />
              <Form.Group className="mb-3">
                <Form.Label>อัปโหลดรูป</Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={(e) => this.readURL(e, "blah")}
                  accept=".png, .jpg, .jpeg"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={this.submit}
                disabled={filetmp === "" ? true : false}
              >
                บันทึก
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
