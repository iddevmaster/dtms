import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import Common from "../../common";
import axios from "axios";
import Functions from "../../functions";
import EmptyImage from "../../asset/images/profile.png";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import thai from "../../asset/multi_datepicker/thai";
import thai_th from "../../asset/multi_datepicker/thai_th";
const list_prefix = Common.prefix;
const BASE_IMAGE = Common.IMAGE_URL;
const setMainRegister = Functions.getRegisterIndex(); ///ข้อมูลชั่วคราวที่ใช้ในการสมัคร
const rm_id = setMainRegister.rm_id;
const allStep = Functions.getAllStepRegister(setMainRegister.course_group);
const current_step = 2;
const customStyles = {
  control: (base) => ({
    ...base,
    height: 47,
    minHeight: 47,
  }),
};

export default class RegisterAddStudent extends Component {
  state = {
    student_id: "",
    student_cover: "",
    student_prefix: "",
    student_firstname: "",
    student_lastname: "",
    student_id_number: "",
    student_birthday: "",
    student_gender: 0,
    student_mobile: "-",
    student_email: "",
    student_address: "",
    location_id: 0,
    country_id: 19,
    nationality_id: 19,

    branch_id: setMainRegister.branch_id,
    school_id: setMainRegister.school_id,

    list_location: [],
    defaultLocation: {
      value: 0,
      label: "",
    },

    list_country: [],
    defaultCountry: {
      value: 19,
      label: "ไทย - ราชอาณาจักรไทย",
    },

    list_nationality: [],
    defaultNationality: {
      value: 19,
      label: "ไทย - ราชอาณาจักรไทย",
    },

    msg: "",
    filetmp: "",
    image_cover: EmptyImage,
    data_idcard: [],
  };

  start_read_test = async () => {
    try {
      await axios.get(Common.API_ID_CARD).then((response) => {
        let res = response.data;
        let data = res.substr(13, res.length - 14);
        let json = JSON.parse(data);
        // console.log(data.FirstNameTh);
        let address =
          json.HomeNo + " " + json.Soi + " " + json.Trok + " " + json.Moo;
        this.setState({
          data_idcard: json,
          student_id_number: json.CitizenNo,
          student_prefix: json.TitleNameTh,
          student_firstname: json.FirstNameTh,
          student_lastname: json.LastNameTh,
          student_address: address,
          student_birthday: this.birthdayConvert(json.BirthDate),
          student_gender: json.Gender,
          student_mobile: this.state.student_mobile,
          filetmp: json.Photo,
        });
        this.DeleteImage(this.state.student_cover);
        this.getLocationFilter(json.Tumbol, json.Amphur, json.Province);
      });
    } catch (error) {
      // console.log(error);
      this.setState({ msg: "ยังไม่เชื่อมต่อกับเครื่องอ่านบัตร" });
    }
  };
  refrehData = async () => {
    try {
      await axios
        .get(Common.API_URL + `register/student_tmp/${rm_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let student = res;
          let location = res.student_tmp_location;
          let country = res.country_id[0];
          let nationality = res.nationality_id[0];
          // console.log(student);
          let label =
            location.district_name +
            " - " +
            location.amphur_name +
            " - " +
            location.province_name +
            " - " +
            location.zipcode;
          let phone =
            student.student_mobile === "" || student.student_mobile === "-"
              ? ""
              : student.student_mobile;
          new Promise((accept) =>
            this.setState(
              {
                student_id: student.student_id,
                student_cover: student.student_cover,
                student_prefix: student.student_prefix,
                student_firstname: student.student_firstname,
                student_lastname: student.student_lastname,
                student_id_number: student.student_id_number,
                student_birthday: student.student_birthday,
                student_gender: student.student_gender,
                student_mobile: phone,
                student_email: student.student_email,
                student_address: student.student_address,
                location_id: student.location_id,
                country_id: country.country_id,
                nationality_id: nationality.country_id,
                branch_id: student.branch_id,
                school_id: student.school_id,
                image_cover:
                  student.student_cover === ""
                    ? EmptyImage
                    : BASE_IMAGE + student.student_cover,
                defaultLocation: { value: location.location_id, label: label },
                defaultCountry: {
                  value: country.country_id,
                  label:
                    country.country_name_th +
                    " - " +
                    country.country_official_name_th,
                },
                defaultNationality: {
                  value: nationality.country_id,
                  label:
                    nationality.country_name_th +
                    " - " +
                    nationality.country_official_name_th,
                },
              },
              accept
            )
          );
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

  getLocationFilter = (district_name, amphur_name, province_name) => {
    try {
      axios
        .post(Common.API_URL + "masterdata/location/filter", {
          district_name: district_name,
          amphur_name: amphur_name,
          province_name: province_name,
        })
        .then((response) => {
          let res = response.data;
          //   console.log(res.data);
          let location_id = res.location_id;
          let label =
            res.district_name +
            " - " +
            res.amphur_name +
            " - " +
            res.province_name +
            " - " +
            res.zipcode;

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  defaultLocation: {
                    value: location_id,
                    label: label,
                  },
                  location_id: location_id,
                },
                accept
              );
              this.convertBase64(
                this.state.student_id_number,
                this.state.filetmp
              );
            }, 1000);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getCountry = (newValue) => {
    // console.log(newValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/country",
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
            arr.push({
              value: obj.country_id,
              label: obj.country_name_th + " - " + obj.country_official_name_th,
            });
          }
          //   console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_country: arr,
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
  getNationality = (newValue) => {
    // console.log(newValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/country",
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
            arr.push({
              value: obj.country_id,
              label: obj.country_name_th + " - " + obj.country_official_name_th,
            });
          }
          //   console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_nationality: arr,
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

  convertBase64 = (file_name, file_path) => {
    try {
      axios
        .post(
          Common.API_URL +
            `media/base64tofile?school_id=${this.state.school_id}`,
          {
            file_name: file_name + ".png",
            file_path: file_path,
          }
        )
        .then((response) => {
          let res = response.data;
          this.handleSubmit(res.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };

  birthdayConvert = (birthday) => {
    // let text = "25360319";
    let text = birthday;
    let year = parseInt(text.substring(0, 4)) - 543;
    let month = text.substring(6, 4);
    let day = text.substring(8, 6);
    return year + "-" + month + "-" + day;
  };

  handleSubmit = (student_cover) => {
    // console.log(this.state.location_id);
    if (
      this.state.student_id_number === "" ||
      this.state.student_prefix === "" ||
      this.state.student_firstname === "" ||
      this.state.student_birthday === "" ||
      this.state.student_mobile === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "register/student_tmp",
          {
            student_cover: student_cover,
            student_prefix: this.state.student_prefix,
            student_firstname: this.state.student_firstname,
            student_lastname: this.state.student_lastname,
            student_id_number: this.state.student_id_number,
            student_birthday: this.state.student_birthday,
            student_gender: this.state.student_gender,
            student_mobile: this.state.student_mobile,
            student_email: this.state.student_email,
            student_address: this.state.student_address,
            rm_id: rm_id,
            location_id: this.state.location_id,
            country_id: this.state.country_id,
            nationality_id: this.state.nationality_id,
            branch_id: this.state.branch_id,
            school_id: this.state.school_id,
          },
          Common.options
        )
        .then((res) => {
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleSubmit2 = () => {
    if (
      this.state.student_id_number === "" ||
      this.state.student_prefix === "" ||
      this.state.student_firstname === "" ||
      this.state.student_birthday === "" ||
      this.state.student_mobile === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + "register/student_tmp",
          {
            student_cover: this.state.student_cover,
            student_prefix: this.state.student_prefix,
            student_firstname: this.state.student_firstname,
            student_lastname: this.state.student_lastname,
            student_id_number: this.state.student_id_number,
            student_birthday: this.state.student_birthday,
            student_gender: this.state.student_gender,
            student_mobile: this.state.student_mobile,
            student_email: this.state.student_email,
            student_address: this.state.student_address,
            rm_id: rm_id,
            location_id: this.state.location_id,
            country_id: this.state.country_id,
            nationality_id: this.state.nationality_id,
            branch_id: this.state.branch_id,
            school_id: this.state.school_id,
          },
          Common.options
        )
        .then((res) => {
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  FormatDate = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ student_birthday: fulldate });
    // console.log(fulldate);
  };
  setLocation_id = async (e) => {
    // console.log(e);
    // console.log(e);
    this.setState({ location_id: e.value, defaultLocation: e });
  };
  setCountry_id = async (e) => {
    this.setState({ country_id: e.value, defaultCountry: e });
  };

  setNationality_id = async (e) => {
    this.setState({ nationality_id: e.value, defaultNationality: e });
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
          if (this.state.student_cover !== "") {
            this.DeleteImage(this.state.student_cover);
          }

          let r = res.data;
          this.setState({
            image_cover: r.file_url,
          });
          this.handleSubmit(r.file_path);
          // console.log(r.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };

  DeleteImage = (cover) => {
    try {
      axios
        .delete(
          Common.API_URL + `media/remove/?file_path=${cover}`,
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
    if (
      this.state.student_firstname === "" ||
      this.state.student_lastname === "" ||
      this.state.student_id_number === 0 ||
      this.state.student_birthday === "" ||
      this.state.student_mobile === "" ||
      this.state.student_address === "" ||
      this.state.location_id === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }

    this.uploadImageProfile(this.state.filetmp);
  };

  gotoNextStepForm = () => {
    if (
      this.state.student_id_number === "" ||
      this.state.student_firstname === "" ||
      this.state.student_birthday === "" ||
      this.state.student_mobile === ""
    ) {
      this.setState({ msg: "กรุณาระบุข้อมูลให้ครบ" });
      return false;
    }

    Functions.setRegisterIndex(
      setMainRegister.rm_id,
      setMainRegister.course_group,
      setMainRegister.course_id,
      setMainRegister.teacher_id,
      setMainRegister.dateDefault,
      setMainRegister.typefilter,
      current_step + 1,
      allStep,
      setMainRegister.month,
      setMainRegister.year,
      setMainRegister.start_time,
      setMainRegister.end_time,
      setMainRegister.vehicle_type_id,
      setMainRegister.branch_id,
      setMainRegister.school_id,
      setMainRegister.teacher_event
    );
    this.handleSubmit2();
    window.location.reload();
  };

  componentDidMount() {
    this.refrehData();
  }
  render() {
    const { list_location } = this.state;
    const { list_country } = this.state;
    const { list_nationality } = this.state;

    const { image_cover } = this.state;
    const { msg } = this.state;
    const { filetmp } = this.state;

    const { student_id } = this.state;
    const { student_prefix } = this.state;
    const { student_firstname } = this.state;
    const { student_lastname } = this.state;
    const { student_id_number } = this.state;
    const { student_birthday } = this.state;
    const { student_gender } = this.state;
    const { student_mobile } = this.state;
    const { student_email } = this.state;
    const { student_address } = this.state;
    const { defaultLocation } = this.state;
    const { defaultCountry } = this.state;
    const { defaultNationality } = this.state;
    // const { data_idcard } = this.state;
    return (
      <div>
        {/* {JSON.stringify(data_idcard)} */}
        {/* {JSON.stringify(data_idcard.Photo)} */}
        {/* {JSON.stringify(defaultNationality)} */}

        {msg !== "" && <Alert variant="danger">{msg}</Alert>}
        <Row>
          <Col lg={3} sm={3} md={3}>
            <div align="center">
              <Card.Img
                variant="top"
                src={image_cover}
                id="blah"
                style={{ width: "200px", height: "200px" }}
              />
            </div>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                size="sm"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => this.readURL(e, "blah")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <div className="d-grid gap-2">
                <Button variant="info" size="sm" onClick={this.start_read_test}>
                  อ่านบัตรประชาชน
                </Button>
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสบัตรประชาชน</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    id="student_id_number"
                    onChange={(e) =>
                      this.setState({ student_id_number: e.target.value })
                    }
                    defaultValue={student_id_number}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>คำนำหน้า</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <InputGroup>
                    <DropdownButton
                      variant="outline-secondary"
                      title="เลือกคำนำหน้า"
                      id="input-group-dropdown-1"
                    >
                      {list_prefix.map((value, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={(e) =>
                            this.setState({ student_prefix: value })
                          }
                        >
                          {value}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                    <Form.Control
                      id="student_prefix"
                      value={student_prefix}
                      onChange={(e) =>
                        this.setState({ student_prefix: e.target.value })
                      }
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อ</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    id="student_firstname"
                    onChange={(e) =>
                      this.setState({ student_firstname: e.target.value })
                    }
                    defaultValue={student_firstname}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>นามสกุล</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    id="student_lastname"
                    onChange={(e) =>
                      this.setState({ student_lastname: e.target.value })
                    }
                    defaultValue={student_lastname}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>วันเกิด</Form.Label>
                  <label style={{ color: "red" }}> *</label>

                  <DatePicker
                    id="student_birthday"
                    calendar={thai}
                    locale={thai_th}
                    style={{ height: "40px", width: "100%" }}
                    containerStyle={{
                      width: "100%",
                    }}
                    onChange={(e) => this.FormatDate(e)}
                    value={student_birthday}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>เพศ</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      this.setState({ student_gender: e.target.value })
                    }
                    value={student_gender}
                  >
                    <option value="">--เลือกข้อมูล--</option>
                    <option value="1">ชาย</option>
                    <option value="2">หญิง</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>เบอร์โทรศัพท์</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    id="student_mobile"
                    onChange={(e) =>
                      this.setState({ student_mobile: e.target.value })
                    }
                    value={student_mobile}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>อีเมล</Form.Label>
                  <Form.Control
                    type="email"
                    id="student_email"
                    onChange={(e) =>
                      this.setState({ student_email: e.target.value })
                    }
                    defaultValue={student_email}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ที่อยู่เลขที่</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Form.Control
                    type="text"
                    id="student_address"
                    onChange={(e) =>
                      this.setState({ student_address: e.target.value })
                    }
                    defaultValue={student_address}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ตำบล/อำเภอ/จังหวัด/ไปรษณีย์</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Select
                    id="location_id"
                    isClearable
                    options={list_location}
                    onInputChange={this.getLocation}
                    styles={customStyles}
                    onChange={this.setLocation_id}
                    // defaultValue={defaultLocation}
                    value={defaultLocation}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>สัญชาติ</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Select
                    id="nationality_id"
                    options={list_nationality}
                    onInputChange={this.getNationality}
                    styles={customStyles}
                    onChange={this.setNationality_id}
                    value={defaultNationality}
                    cacheOptions
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ประเทศ</Form.Label>
                  <label style={{ color: "red" }}> *</label>
                  <Select
                    id="country_id"
                    options={list_country}
                    onInputChange={this.getCountry}
                    styles={customStyles}
                    onChange={this.setCountry_id}
                    value={defaultCountry}
                    cacheOptions
                  />
                </Form.Group>
              </Col>
            </Row>

            <div align="center">
              <Button
                variant="primary"
                onClick={filetmp === "" ? this.handleSubmit2 : this.submit}
              >
                บันทึก
              </Button>{" "}
              <Button
                disabled={student_id === "" ? true : false}
                onClick={this.gotoNextStepForm}
                variant="success"
              >
                บันทึกและไปยังขั้นตอนถัดไป
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
