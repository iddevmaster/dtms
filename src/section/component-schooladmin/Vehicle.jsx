import React, { Component } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  InputGroup,
  Form,
  Modal,
  Table,
  Image,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Functions from "../../functions";
import Common from "../../common";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const BASE_IMAGE = Common.IMAGE_URL;
const school_id = Common.getUserLoginData.school_id;
export default class Vehicle extends Component {
  state = {
    vehicle_id: 0,
    vehicle_brand: "",
    vehicle_license_plate: "",
    vehicle_use_date: "",
    vehicle_expiry: "",
    vehicle_cover: "",
    vehicle_description: "",
    vehicle_type_id: 0,
    active: 1,
    province_code: "",
    school_id: "",
    branch_id: "all",

    filecore: "",
    isOpenModal: false,
    isModalFormImg: false,
    data: [],
    param: [],
    branch: [],
    province_data: [],
    vt: [],
    page: 1,
    search_value: "",
  };

  refreshData = async () => {
    // branch_id=all หมายถึง สาขาทั้งหมดภายในโรงเรียน
    try {
      await axios
        .post(
          Common.API_URL + `general/vehicle/${school_id}/all?branch_id=all`,
          {
            page: this.state.page,
            per_page: 25,
            search_value: this.state.search_value,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res.data, param: res });
          // console.log(res.data.Teacher);
        });
    } catch (error) {
      console.log(error);
    }
  };

  getBranch = async () => {
    try {
      await axios
        .post(
          Common.API_URL + `school/branch/all/${school_id}`,
          {
            page: 1,
            per_page: 200,
            search_value: "",
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ branch: res.data });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getProvince = async () => {
    try {
      await axios
        .get(Common.API_URL + "masterdata/province", Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ province_data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = () => {
    if (
      this.state.vehicle_type_id === 0 ||
      this.state.vehicle_brand === "" ||
      this.state.vehicle_license_plate === "" ||
      this.state.vehicle_use_date === "" ||
      this.state.vehicle_expiry === "" ||
      this.state.province_code === "" ||
      this.state.branch_id === "all"
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
          Common.API_URL + "general/vehicle/create",
          {
            vehicle_brand: this.state.vehicle_brand,
            vehicle_license_plate: this.state.vehicle_license_plate,
            vehicle_use_date: this.state.vehicle_use_date,
            vehicle_expiry: this.state.vehicle_expiry,
            vehicle_cover: this.state.vehicle_cover,
            vehicle_description: this.state.vehicle_description,
            vehicle_type_id: this.state.vehicle_type_id,
            active: this.state.active,
            province_code: this.state.province_code,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.clearState();
          this.refreshData();
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
  handleSubmitEdit = () => {
    if (
      this.state.vehicle_type_id === 0 ||
      this.state.vehicle_brand === "" ||
      this.state.vehicle_license_plate === "" ||
      this.state.vehicle_use_date === "" ||
      this.state.vehicle_expiry === "" ||
      this.state.province_code === "" ||
      this.state.branch_id === "all"
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
          Common.API_URL + `general/vehicle/${this.state.vehicle_id}`,
          {
            vehicle_brand: this.state.vehicle_brand,
            vehicle_license_plate: this.state.vehicle_license_plate,
            vehicle_use_date: this.state.vehicle_use_date,
            vehicle_expiry: this.state.vehicle_expiry,
            vehicle_cover: this.state.vehicle_cover,
            vehicle_description: this.state.vehicle_description,
            vehicle_type_id: this.state.vehicle_type_id,
            active: this.state.active,
            province_code: this.state.province_code,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
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

  handleUpdateWithCoverSubmit = (vehicle_cover) => {
    if (
      this.state.vehicle_type_id === 0 ||
      this.state.vehicle_brand === "" ||
      this.state.vehicle_license_plate === "" ||
      this.state.vehicle_use_date === "" ||
      this.state.vehicle_expiry === "" ||
      this.state.province_code === "" ||
      this.state.branch_id === "all"
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
          Common.API_URL + `general/vehicle/${this.state.vehicle_id}`,
          {
            vehicle_brand: this.state.vehicle_brand,
            vehicle_license_plate: this.state.vehicle_license_plate,
            vehicle_use_date: this.state.vehicle_use_date,
            vehicle_expiry: this.state.vehicle_expiry,
            vehicle_cover: vehicle_cover,
            vehicle_description: this.state.vehicle_description,
            vehicle_type_id: this.state.vehicle_type_id,
            active: this.state.active,
            province_code: this.state.province_code,
            branch_id: this.state.branch_id,
            school_id: school_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
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

  handleClickEdit = (res) => {
    let r = res;
    this.setState({
      vehicle_id: r.vehicle_id,
      vehicle_brand: r.vehicle_brand,
      vehicle_license_plate: r.vehicle_license_plate,
      vehicle_use_date: r.vehicle_use_date,
      vehicle_expiry: r.vehicle_expiry,
      vehicle_cover: r.vehicle_cover,
      vehicle_description: r.vehicle_description,
      vehicle_type_id: r.vehicle_type_id,
      active: r.active,
      province_code: r.province_code,
      branch_id: r.branch_id,
    });
  };

  handleDelete = (vehicle_id) => {
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
              Common.API_URL + `general/vehicle/${vehicle_id}`,
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

  clearState = () => {
    this.setState({
      isModalFormImg: false,
      isOpenModal: false,
      vehicle_id: 0,
      vehicle_brand: "",
      vehicle_license_plate: "",
      vehicle_use_date: "",
      vehicle_expiry: "",
      vehicle_cover: "",
      vehicle_description: "",
      vehicle_type_id: 0,
      active: 1,
      province_code: "",
      school_id: "",
      branch_id: "all",
    });
  };

  FormatDateA = async (e) => {
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ vehicle_use_date: fulldate });
    // console.log(fulldate);
  };
  FormatDateB = async (e) => {
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ vehicle_expiry: fulldate });
  };
  getVehicleType = async () => {
    try {
      await axios
        .get(Common.API_URL + "masterdata/vehicle_type")
        .then((response) => {
          let res = response.data;
          this.setState({ vt: res });
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
          if (this.state.vehicle_cover !== "") {
            this.DeleteImage(this.state.vehicle_cover);
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
  componentDidMount() {
    this.refreshData();
    this.getBranch();
    this.getProvince();
    this.getVehicleType();
  }

  render() {
    const {
      data,
      vehicle_id,
      vt,
      param,
      branch,
      province_data,
      page,
      isOpenModal,
      isModalFormImg,
      filecore,
    } = this.state;

    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>ยานพาหนะ</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <LinkContainer to="/">
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>ยานพาหนะ</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>ตารางยานพาหนะ</Col>
              <Col sm={4}>
                <div align="right">
                  <Button onClick={(e) => this.setState({ isOpenModal: true })}>
                    เพิ่มข้อมูล
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col sm={9}>จำนวนข้อมูล {param.total_data} รายการ</Col>
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
                  <th>ประเภทยานพาหนะ</th>
                  <th>ยี่ห้อ / รุ่น</th>
                  <th>ป้ายทะเบียน</th>
                  <th>จังหวัดตามป้ายทะเบียน</th>
                  <th>วันที่นำมาใช้งาน</th>
                  <th>วันหมดอายุป้ายทะเบียน</th>
                  <th>สาขา</th>
                  <th>รูป</th>
                  <th>สถานะ</th>
                  <th>วันที่สร้าง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td>{Functions.vehicle_format(rs.vehicle_type_id)} </td>
                    <td>{rs.vehicle_brand}</td>
                    <td>{rs.vehicle_license_plate}</td>
                    <td>{rs.province_vehicle?.province_name}</td>
                    <td>{Functions.ymdtodmy(rs.vehicle_use_date)} </td>
                    <td>{Functions.ymdtodmy(rs.vehicle_expiry)} </td>
                    <td>{rs.branch_vehicle?.branch_name}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        type="button"
                        onClick={(e) => [
                          this.setState({ isModalFormImg: true }),
                          this.handleClickEdit(rs),
                        ]}
                      >
                        <i
                          className="fa fa-window-restore"
                          aria-hidden="true"
                        ></i>
                      </Button>
                    </td>
                    <td>
                      {rs.active === 1 ? (
                        <span style={{ color: "blue" }}>เปิด</span>
                      ) : (
                        <span style={{ color: "red" }}>ปิด</span>
                      )}
                    </td>
                    <td>{Functions.format_date_time(rs.create_date)} </td>

                    <td align="center">
                      <ButtonGroup>
                        <DropdownButton
                          title="จัดการ"
                          id="bg-nested-dropdown"
                          variant="warning"
                        >
                          <Dropdown.Item
                            eventKey="2"
                            onClick={(e) => [
                              this.setState({
                                isOpenModal: true,
                              }),
                              this.handleClickEdit(rs),
                            ]}
                          >
                            แก้ไข
                          </Dropdown.Item>

                          <Dropdown.Item
                            eventKey="3"
                            onClick={(e) => this.handleDelete(rs.vehicle_id)}
                          >
                            ลบ
                          </Dropdown.Item>
                        </DropdownButton>
                      </ButtonGroup>
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

        {/* Form Teacher */}
        <Modal show={isOpenModal} onHide={this.clearState}>
          <Modal.Header>
            <Modal.Title>ยานพาหนะ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ประเภทยานพาหนะ</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ vehicle_type_id: e.target.value })
                }
                value={this.state.vehicle_type_id}
              >
                <option value="">--เลือกข้อมูล--</option>
                {vt.map((rs, index) => (
                  <option value={rs.vehicle_type_id} key={index}>
                    {rs.vehicle_type_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ยี่ห้อ / รุ่น</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ vehicle_brand: e.target.value })
                }
                value={this.state.vehicle_brand}
                id="vehicle_brand"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ป้ายทะเบียน </Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ vehicle_license_plate: e.target.value })
                }
                value={this.state.vehicle_license_plate}
                id="vehicle_license_plate"
              />
              <Form.Text className="text-muted">ไม่ต้องระบุจังหวัด</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>จังหวัดตามป้ายทะเบียน</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Select
                onChange={(e) =>
                  this.setState({ province_code: e.target.value })
                }
                id="province_code"
                value={this.state.province_code}
              >
                <option value="">--เลือกจังหวัด--</option>
                {province_data.map((rs, index) => (
                  <option value={rs.province_code} key={index}>
                    {rs.province_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>วันที่นำมาใช้งาน</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <DatePicker
                calendar={thai}
                locale={thai_th}
                style={{ height: "40px", width: "100%" }}
                containerStyle={{
                  width: "100%",
                }}
                onChange={(e) => this.FormatDateA(e)}
                value={this.state.vehicle_use_date}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>วันหมดอายุป้ายทะเบียน</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <DatePicker
                calendar={thai}
                locale={thai_th}
                style={{ height: "40px", width: "100%" }}
                containerStyle={{
                  width: "100%",
                }}
                onChange={(e) => this.FormatDateB(e)}
                value={this.state.vehicle_expiry}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>รายละเอียดเพิ่มเติม </Form.Label>

              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ vehicle_description: e.target.value })
                }
                value={this.state.vehicle_description}
                id="vehicle_description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>สาขา</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Select
                onChange={(e) => this.setState({ branch_id: e.target.value })}
                value={this.state.branch_id}
                id="branch_id"
              >
                <option value="">--เลือกสาขา--</option>
                {branch
                  .filter((x) => x.active === 1)
                  .map((rs, index) => (
                    <option value={rs.branch_id} key={index}>
                      {rs.branch_name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>เปิด - ปิด</Form.Label>
              <Form.Select
                onChange={(e) => this.setState({ active: e.target.value })}
                value={this.state.active}
                id="active"
              >
                <option value="0">ปิด</option>
                <option value="1">เปิด</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.clearState}>
              ปิดหน้าต่างนี้
            </Button>

            <Button
              variant="primary"
              type="button"
              onClick={
                vehicle_id === 0 ? this.handleSubmit : this.handleSubmitEdit
              }
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Image LOGO */}
        <Modal show={isModalFormImg} onHide={this.clearState}>
          <Modal.Header closeButton>
            <Modal.Title>รูปยานพาหนะ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={
                Functions.check_empty_value(this.state.vehicle_cover) === true
                  ? require("../../asset/images/no-image-icon-6.png")
                  : BASE_IMAGE + this.state.vehicle_cover
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
