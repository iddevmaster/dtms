import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Common from "../common";
import axios from "axios";
import "../asset/Login.css";
const app_name = Common.app_name;
const GetDataForm = () => {
  const { school_id } = useParams();
  return <LoginUser school_id={school_id} />;
};
export default GetDataForm;
class LoginUser extends Component {
  state = {
    user_name: "",
    password: "",
    msg: "",
    school_id: this.props.school_id,
    school_name: "",
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `school/${this.state.school_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ school_name: res.school_name });
        })
        .catch((err) => {
          window.location = "/";
        });
    } catch (error) {
      console.log(error);
      window.location = "/";
    }
  };

  handleSubmit = () => {
    if (this.state.user_name.length < 2 || this.state.password.length < 2) {
      this.setState({ msg: "ระบุ Username หรือ Password ไม่ถูกต้อง!" });
      return false;
    }
    // console.log(this.state.school_id);
    try {
      axios
        .post(
          Common.API_URL + "user/login",
          {
            username: this.state.user_name,
            password: this.state.password,
            school_id: this.state.school_id,
          },
          Common.options
        )
        .then((res) => {
          let user = res.data;

          // console.log(JSON.stringify(user));
          localStorage.setItem("token_profile", JSON.stringify(user));
          window.location = "/";
        })
        .catch((err) => {
          // Handle error
          this.setState({ msg: "ระบุ Username หรือ Password ไม่ถูกต้อง!" });
          // console.log(err);
        });
    } catch (error) {
      this.setState({ msg: "ระบุ Username หรือ Password ไม่ถูกต้อง!" });
      console.log(error);
    }
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { school_name } = this.state;
    const { msg } = this.state;

    return (
      <div>
        <div className="wrapper">
          <div className="form-signin">
            <h2 className="form-signin-heading">{school_name} </h2>

            <div className="inner-addon">
              {msg !== "" && <Alert variant="danger">{msg}</Alert>}
              <label className="control-label">Username</label>

              <input
                type="text"
                className="form-control"
                onChange={(e) => this.setState({ user_name: e.target.value })}
              />
            </div>
            <div className="inner-addon">
              <label className="control-label">Password</label>

              <input
                type="password"
                className="form-control"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>

            <div align="center">
              <button
                className="btn btn-lg btn-primary btn-block"
                type="button"
                onClick={this.handleSubmit}
              >
                Login
              </button>
            </div>
          </div>
          <div align="center"> {app_name} </div>
        </div>
      </div>
    );
  }
}
