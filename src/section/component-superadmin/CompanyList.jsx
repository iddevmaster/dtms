import React, { Component } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  Table,
  Modal,
  Image,
} from "react-bootstrap";
import Select from "react-select";
import Functions from "../../functions";
import { LinkContainer } from "react-router-bootstrap";
import Common from "../../common";
import axios from "axios";
import Swal from "sweetalert2";
const customStyles = {
  control: (base) => ({
    ...base,
    height: 47,
    minHeight: 47,
  }),
};
const BASE_IMAGE = Common.IMAGE_URL;
const GetDataForm = () => {
  const { school_id } = useParams();

  return <CompanyList school_id={school_id} />;
};
export default GetDataForm;

class CompanyList extends Component {
  state = {
    company_name: "",
    company_tax: "",
    company_description: "",
    company_address: "",
    company_phone: "",
    company_email: "",
    company_cover: "",
    active: 1,
    location_id: 0,

    data: [],
    isModalForm: false,
    isModalFormLogo: false,

    list_location: [],
    defaultLocation: {
      value: 0,
      label: "",
    },
    filecore: "",
  };

  refreshData = async () => {
    const school_id = this.props.school_id;
    try {
      await axios
        .get(Common.API_URL + "school/company/all/" + school_id, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
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
    const school_id = this.props.school_id;
    if (
      this.state.company_name === "" ||
      this.state.company_tax === "" ||
      this.state.company_description === "" ||
      this.state.company_address === "" ||
      this.state.company_phone === "" ||
      this.state.company_email === "" ||
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
          Common.API_URL + "school/company/create",
          {
            company_name: this.state.company_name,
            company_tax: this.state.company_tax,
            company_description: this.state.company_description,
            company_address: this.state.company_address,
            company_phone: this.state.company_phone,
            company_email: this.state.company_email,
            company_cover: this.state.company_cover,
            active: this.state.active,
            location_id: this.state.location_id,
            school_id: school_id,
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
    const school_id = this.props.school_id;
    if (
      this.state.company_id === "" ||
      this.state.company_name === "" ||
      this.state.company_tax === "" ||
      this.state.company_description === "" ||
      this.state.company_address === "" ||
      this.state.company_phone === "" ||
      this.state.company_email === "" ||
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
          Common.API_URL + `school/company/${this.state.company_id}`,
          {
            company_name: this.state.company_name,
            company_tax: this.state.company_tax,
            company_description: this.state.company_description,
            company_address: this.state.company_address,
            company_phone: this.state.company_phone,
            company_email: this.state.company_email,
            company_cover: this.state.company_cover,
            active: this.state.active,
            location_id: this.state.location_id,
            school_id: school_id,
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

  handleUpdateWithCoverSubmit = (company_cover) => {
    const school_id = this.props.school_id;
    if (
      this.state.company_id === "" ||
      this.state.company_name === "" ||
      this.state.company_tax === "" ||
      this.state.company_description === "" ||
      this.state.company_address === "" ||
      this.state.company_phone === "" ||
      this.state.company_email === "" ||
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
          Common.API_URL + `school/company/${this.state.company_id}`,
          {
            company_name: this.state.company_name,
            company_tax: this.state.company_tax,
            company_description: this.state.company_description,
            company_address: this.state.company_address,
            company_phone: this.state.company_phone,
            company_email: this.state.company_email,
            company_cover: company_cover,
            active: this.state.active,
            location_id: this.state.location_id,
            school_id: school_id,
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
  handleClickEdit = (rs) => {
    let label =
      rs.location_company?.district_name +
      " - " +
      rs.location_company?.amphur_name +
      " - " +
      rs.location_company?.province_name +
      " - " +
      rs.location_company?.zipcode;
    this.setState({
      company_id: rs.company_id,
      company_name: rs.company_name,
      company_tax: rs.company_tax,
      company_description: rs.company_description,
      company_address: rs.company_address,
      company_phone: rs.company_phone,
      company_email: rs.company_email,
      company_cover: rs.company_cover,
      location_id: rs.location_id,
      defaultLocation: {
        value: rs.location_id,
        label: label,
      },
    });
  };

  clearState = () => {
    this.setState({
      isModalForm: false,
      isModalFormLogo: false,
      company_name: "",
      company_tax: "",
      company_description: "",
      company_address: "",
      company_phone: "",
      company_email: "",
      company_cover: "",
      location_id: "",
      defaultLocation: {
        value: 0,
        label: "",
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
          if (this.state.company_cover !== "") {
            this.DeleteImage(this.state.company_cover);
          }
          let r = res.data;
          this.handleUpdateWithCoverSubmit(r?.file_path);
          // this.setState({
          //   company_cover: r?.file_path,
          // });
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

  handleDelete = (company_id) => {
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
            .delete(
              Common.API_URL + `school/company/${company_id}`,
              Common.options
            )
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
  componentDidMount() {
    this.refreshData();
    this.getLocation("");
  }

  render() {
    const {
      company_id,
      list_location,
      defaultLocation,
      data,
      isModalForm,
      isModalFormLogo,
      filecore,
    } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ข้อมูลบริษัท</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <LinkContainer to="/school">
                <Breadcrumb.Item>ข้อมูลโรงเรียน</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ข้อมูลบริษัท</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางข้อมูลบริษัท</Col>
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
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>บริษัท</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>อีเมล</th>
                  <th>โลโก้</th>
                  <th>สถานะ</th>
                  <th>วันที่ทำรายการ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((rs, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{rs.company_name}</td>
                    <td>{rs.company_phone}</td>
                    <td>{rs.company_email}</td>
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
                    <td>{rs.active === 1 ? "กำลังใช้งาน" : "ปิดการใช้งาน"}</td>

                    <td>{Functions.format_date_time(rs.create_date)}</td>

                    <td>
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
                        onClick={() => this.handleDelete(rs.company_id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal
          show={isModalForm}
          onHide={(e) => this.setState({ isModalForm: false })}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>แบบฟอร์มบริษัท</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg="4" md="6" sm="12">
                <Form.Group>
                  <Form.Label>ชื่อบริษัท</Form.Label>{" "}
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.setState({ company_name: e.target.value })
                    }
                    value={this.state.company_name}
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
                      this.setState({ company_tax: e.target.value })
                    }
                    value={this.state.company_tax}
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
                        company_description: e.target.value,
                      })
                    }
                    value={this.state.company_description}
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
                      this.setState({ company_address: e.target.value })
                    }
                    value={this.state.company_address}
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
                      this.setState({ company_phone: e.target.value })
                    }
                    value={this.state.company_phone}
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
                      this.setState({ company_email: e.target.value })
                    }
                    value={this.state.company_email}
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
                company_id === ""
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
                Functions.check_empty_value(this.state.company_cover) === true
                  ? require("../../asset/images/no-image-icon-6.png")
                  : BASE_IMAGE + this.state.company_cover
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
