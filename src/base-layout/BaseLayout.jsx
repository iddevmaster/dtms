import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SectionSuperAdmin from "../section/SectionSuperAdmin";
import SectionSchoolAdmin from "../section/SectionSchoolAdmin";
import LoginUser from "../landing-page/LoginUser";
import Login from "../landing-page/Login";
import BlankPage from "../section/BlankPage";
import Common from "../common";

export default class BaseLayout extends Component {
  state = {
    app_name: Common.app_name,
    user_id: "",
    user_type: 0,
    fullname: "",
  };
  checkAuthen = () => {
    // console.log(Common.getUserLoginData);
    if (Common.getUserLoginData === null) {
      this.setState({ user_id: "", user_type: 0 });
      localStorage.clear();
    } else {
      this.setState({
        user_id: Common.getUserLoginData.user_token,
        user_type: Common.getUserLoginData.user_type,
        fullname: Common.getUserLoginData.full_name,
      });
    }
  };

  componentDidMount() {
    this.checkAuthen();
  }
  render() {
    const { user_type } = this.state;
    const { app_name } = this.state;
    const { fullname } = this.state;
    return (
      <div>
        {user_type === 0 && (
          <Router>
            <Routes>
              <Route path="/:school_id/login" element={<LoginUser />} />
              <Route
                path="/staff/z/login"
                element={<Login app_name={app_name} fullname={fullname} />}
              />
              <Route path="*" element={<BlankPage />} />
            </Routes>
          </Router>
        )}
        {user_type === 1 && (
          <SectionSuperAdmin app_name={app_name} fullname={fullname} />
        )}

        {user_type === 2 && (
          <SectionSchoolAdmin app_name={app_name} fullname={fullname} />
        )}
      </div>
    );
  }
}
