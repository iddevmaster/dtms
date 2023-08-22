import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Common from "../common";
import axios from "axios";
import "../asset/Login.css";
const base_school_id = Common.base_school_id;
// https://medium.com/makers-byte/30-codepens-for-your-login-form-layouts-bc700c02ae59
export default class Login extends Component {
  state = {
    user_name: "",
    password: "",
    msg: "",
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
            school_id: base_school_id,
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

  render() {
    const { app_name } = this.props;

    const { msg } = this.state;
    return (
      <div>
        <div className="wrapper">
          <div className="form-signin">
            <h2 className="form-signin-heading">Login to {app_name}</h2>

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
        </div>
      </div>
    );
  }
}
