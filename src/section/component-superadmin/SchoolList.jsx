import React, { Component } from "react";
import {
  Form,
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  Table,
  InputGroup,
  Modal,
  Image,
} from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
const BASE_IMAGE = Common.IMAGE_URL;
const customStyles = {
  control: (base) => ({
    ...base,
    height: 47,
    minHeight: 47,
  }),
};
const domain = window.location.protocol + "//" + window.location.host;
export default class SchoolList extends Component {
  state = {
    param: [],
    page: 1,
    per_page: 25,
    search_value: "",
    data: [],
    isModalForm: false,
    isModalFormLogo: false,

    school_id: "",
    school_name: "",
    school_description: "",
    school_address: "",
    school_phone: "",
    school_email: "",
    school_tax: "",
    school_branch_amount: "",
    school_cover: "",
    location_id: 0,
    active: 1,

    list_location: [],
    defaultLocation: {
      value: 0,
      label: "",
    },
    filecore: "",
  };

  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + "school/all",
          {
            page: this.state.page,
            per_page: this.state.per_page,
            search_value: this.state.search_value,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res.data, param: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getLocation = (newValue) => {
    // console.log(inputValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/location",
          {
            page: 1,
            per_page: 25,
            search_value: newValue,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          //   console.log(res.data);
          let list = res.data;
          var arr = [];
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];

            // console.log(obj.rs_id);
            let label =
              obj.district_name +
              " - " +
              obj.amphur_name +
              " - " +
              obj.province_name +
              " - " +
              obj.zipcode;
            arr.push({
              value: obj.location_id,
              label: label,
            });
          }
          //   console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_location: arr,
                },
                accept
              );
            }, 1000);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  setLocation_id = async (e) => {
    // console.log(e);

    this.setState({ location_id: e.value, defaultLocation: e });
  };
  handleCreateSubmit = () => {
    if (
      this.state.school_name === "" ||
      this.state.school_address === "" ||
      this.state.school_phone === "" ||
      this.state.school_email === "" ||
      this.state.school_tax === "" ||
      this.state.school_branch_amount === 0 ||
      this.state.location_id === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ไม่สามารถทำรายการได้ !",
      });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + "school/create",
          {
            school_name: this.state.school_name,
            school_description: this.state.school_description,
            school_address: this.state.school_address,
            school_phone: this.state.school_phone,
            school_email: this.state.school_email,
            school_tax: this.state.school_tax,
            school_branch_amount: this.state.school_branch_amount,
            school_cover: this.state.school_cover,
            location_id: this.state.location_id,
            active: this.state.active,
          },
          Common.options
        )
        .then((res) => {
          this.refreshData();
          this.clearState();
          Swal.fire({
            icon: "success",
            title: "ทำรายการสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleUpdateWithCoverSubmit = (school_cover) => {
    if (
      this.state.school_name === "" ||
      this.state.school_address === "" ||
      this.state.school_phone === "" ||
      this.state.school_email === "" ||
      this.state.school_tax === "" ||
      this.state.school_branch_amount === 0 ||
      this.state.location_id === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ไม่สามารถทำรายการได้ !",
      });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `school/${this.state.school_id}`,
          {
            school_name: this.state.school_name,
            school_description: this.state.school_description,
            school_address: this.state.school_address,
            school_phone: this.state.school_phone,
            school_email: this.state.school_email,
            school_tax: this.state.school_tax,
            school_branch_amount: this.state.school_branch_amount,
            school_cover: school_cover,
            location_id: this.state.location_id,
            active: this.state.active,
          },
          Common.options
        )
        .then((res) => {
          this.refreshData();
          this.clearState();
          Swal.fire({
            icon: "success",
            title: "ทำรายการสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleUpdateSubmit = () => {
    if (
      this.state.school_name === "" ||
      this.state.school_address === "" ||
      this.state.school_phone === "" ||
      this.state.school_email === "" ||
      this.state.school_tax === "" ||
      this.state.school_branch_amount === 0 ||
      this.state.location_id === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ไม่สามารถทำรายการได้ !",
      });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `school/${this.state.school_id}`,
          {
            school_name: this.state.school_name,
            school_description: this.state.school_description,
            school_address: this.state.school_address,
            school_phone: this.state.school_phone,
            school_email: this.state.school_email,
            school_tax: this.state.school_tax,
            school_branch_amount: this.state.school_branch_amount,
            school_cover: this.state.school_cover,
            location_id: this.state.location_id,
            active: this.state.active,
          },
          Common.options
        )
        .then((res) => {
          this.refreshData();
          this.clearState();
          Swal.fire({
            icon: "success",
            title: "ทำรายการสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = (school_id) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลหรือไม่ ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(Common.API_URL + `school/${school_id}`, Common.options)
            .then((res) => {
              Swal.fire("ลบข้อมูลแล้ว!", "", "success");

              this.refreshData();
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  handleClickEdit = (rs) => {
    let label =
      rs.location_school?.district_name +
      " - " +
      rs.location_school?.amphur_name +
      " - " +
      rs.location_school?.province_name +
      " - " +
      rs.location_school?.zipcode;
    this.setState({
      school_id: rs.school_id,
      school_name: rs.school_name,
      school_description: rs.school_description,
      school_address: rs.school_address,
      school_phone: rs.school_phone,
      school_email: rs.school_email,
      school_tax: rs.school_tax,
      school_branch_amount: rs.school_branch_amount,
      school_cover: rs.school_cover,
      active: rs.active,
      location_id: rs.location_id,
      defaultLocation: {
        value: rs.location_id,
        label: label,
      },
    });
  };

  readURL = (event, id) => {
    if (event.target.files && event.target.files[0]) {
      var output = document.getElementById(id);
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
      };

      this.setState({
        filecore: event,
      });
    }
  };
  uploadImageProfile = async (event) => {
    let file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);

    try {
      await axios
        .post(
          Common.API_URL + `media/upload/image?resize=1`,
          formdata,
          Common.options
        )
        .then((res) => {
          if (this.state.school_cover !== "") {
            this.DeleteImage(this.state.school_cover);
          }
          let r = res.data;
          this.handleUpdateWithCoverSubmit(r?.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };
  DeleteImage = (cover) => {
    try {
      axios.delete(
        Common.API_URL + `media/remove/?file_path=${cover}`,
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  clearState = () => {
    this.setState({
      isModalForm: false,
      isModalFormLogo: false,
      school_id: "",
      school_name: "",
      school_description: "",
      school_address: "",
      school_phone: "",
      school_email: "",
      school_tax: "",
      school_branch_amount: "",
      school_cover: "",
      location_id: 0,
      defaultLocation: {
        value: 0,
        label: "",
      },
    });
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {
      data,
      param,
      page,
      isModalForm,
      isModalFormLogo,
      list_location,
      defaultLocation,
      school_id,
      filecore,
    } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ข้อมูลโรงเรียน</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>

              <Breadcrumb.Item active>ข้อมูลโรงเรียน</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางข้อมูลโรงเรียน</Col>
              <Col sm={4}>
                <div align="right">
                  <Button onClick={(e) => this.setState({ isModalForm: true })}>
                    เพิ่มข้อมูล
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col sm={9}>จำนวนข้อมูล {param?.total_data} รายการ</Col>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="ค้นหา"
                  onChange={(e) => [
                    this.setState({
                      search_value: e.target.value,
                    }),
                    this.refreshData(),
                  ]}
                  onKeyUp={(e) => [
                    this.setState({
                      search_value: e.target.value,
                    }),
                    this.refreshData(),
                  ]}
                />
              </Col>
            </Row>
            <Table striped>
              <thead>
                <tr>
                  <th>โรงเรียน</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>อีเมล</th>
                  <th>สถานะ</th>
                  <th>วันที่ทำรายการ</th>
                  <th>URL เข้าสู่ระบบ</th>
                  <th>โลโก้</th>
                  <th>บริษัท</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((rs, index) => (
                  <tr key={index}>
                    <td>{rs.school_name}</td>
                    <td>{rs.school_phone}</td>
                    <td>{rs.school_email}</td>
                    <td>{rs.active === 1 ? "กำลังใช้งาน" : "ปิดการใช้งาน"}</td>

                    <td>{Functions.format_date_time(rs.create_date)}</td>
                    <td>{`${domain}/${rs.school_id}/login`}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        type="button"
                        onClick={(e) => [
                          this.setState({ isModalFormLogo: true }),
                          this.handleClickEdit(rs),
                        ]}
                      >
                        <i
                          className="fa fa-window-restore"
                          aria-hidden="true"
                        ></i>
                      </Button>
                    </td>
                    <td align="center">
                      <LinkContainer to={`/company/form/${rs.school_id}`}>
                        <Button size="sm" variant="success" type="button">
                          <i className="fa fa-building" aria-hidden="true"></i>
                        </Button>
                      </LinkContainer>
                    </td>

                    <td align="center">
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => [
                          this.handleClickEdit(rs),
                          this.setState({ isModalForm: true }),
                        ]}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="danger"
                        type="button"
                        onClick={() => this.handleDelete(rs.school_id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row>
              <Col></Col>
              <Col sm={2}>
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>หน้าที่</InputGroup.Text>
                  <Form.Control
                    type="number"
                    defaultValue={page}
                    onChange={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.refreshData(),
                    ]}
                    onKeyUp={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.refreshData(),
                    ]}
                    onClick={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.refreshData(),
                    ]}
                    style={{ textAlign: "center" }}
                  />
                  <InputGroup.Text>
                    ทั้งหมด {param.total_page} หน้า
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>

        <Modal
          show={isModalForm}
          onHide={(e) => this.setState({ isModalForm: false })}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>แบบฟอร์มโรงเรียน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>ชื่อโรงเรียน</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({ school_name: e.target.value })
                    }
                    value={this.state.school_name}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>เลขประจำตัวผูเสียภาษี</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({ school_tax: e.target.value })
                    }
                    value={this.state.school_tax}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>รายละเอียด</Form.Label>

                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({
                        school_description: e.target.value,
                      })
                    }
                    value={this.state.school_description}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>ที่อยู่</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({ school_address: e.target.value })
                    }
                    value={this.state.school_address}
                  />
                </Form.Group>
              </Col>
              <Col lg="8" md="6" sm="12">
                <Form.Group>
                  <Form.Label>ตำบล-อำเภอ-จังหวัด-ไปรษณีย์</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Select
                    id="location_id"
                    isClearable
                    options={list_location}
                    onInputChange={this.getLocation}
                    styles={customStyles}
                    onChange={this.setLocation_id}
                    value={defaultLocation}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>เบอร์โทรศัพท์</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({ school_phone: e.target.value })
                    }
                    value={this.state.school_phone}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>อีเมล</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({ school_email: e.target.value })
                    }
                    value={this.state.school_email}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>จำนวนสาขา</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="number"
                    onChange={(e) =>
                      this.setState({
                        school_branch_amount: e.target.value,
                      })
                    }
                    value={this.state.school_branch_amount}
                  />
                </Form.Group>
              </Col>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>สถานะ </Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Select
                    onChange={(e) => this.setState({ active: e.target.value })}
                    value={this.state.active}
                    size="lg"
                  >
                    <option value="0">ปิด</option>
                    <option value="1">เปิด</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.clearState}>
              ปิดหน้าต่างนี้
            </Button>
            <Button
              variant="primary"
              onClick={
                school_id === ""
                  ? this.handleCreateSubmit
                  : this.handleUpdateSubmit
              }
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Image LOGO */}
        <Modal show={isModalFormLogo} onHide={this.clearState}>
          <Modal.Header closeButton>
            <Modal.Title>โลโก้</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={
                Functions.check_empty_value(this.state.school_cover) === true
                  ? require("../../asset/images/no-image-icon-6.png")
                  : BASE_IMAGE + this.state.school_cover
              }
              thumbnail
              style={{ width: "100%", height: "300px" }}
              id="blah"
            />
            <Form.Group style={{ paddingTop: "25px" }}>
              <Form.Control
                type="file"
                size="sm"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => this.readURL(e, "blah")}
              />
              <div style={{ fontSize: "12px", color: "red" }}>
                ขนาดแนะนำ 200 x 200
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.clearState}>
              ปิดหน้าต่างนี้
            </Button>
            <Button
              variant="primary"
              onClick={() => this.uploadImageProfile(filecore)}
              disabled={filecore === "" ? true : false}
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
