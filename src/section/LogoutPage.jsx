import React from "react";
import Common from "../common";
import LogoutUser from "../landing-page/LogoutUser";
import Logout from "../landing-page/Logout";

function LogoutPage() {
    const school_id = Common.getUserLoginData.school_id;
    console.log("school_id ",school_id)
  return (
    <div>
      <div align="center" style={{ padding: "150px" }}>
        <h1>DTMS</h1>
        <h3>ระบบบริหารการจัดการศูนย์สอนขับรถขั้นพื้นฐาน</h3>
        <p className="text-warning">ไม่พบข้อมูลผู้ใช้งาน</p>
        <button className="btn btn-info" onClick={school_id ? LogoutUser : Logout}>กลับไปยังหน้าหลัก</button>
      </div>
    </div>
  );
}

export default LogoutPage;
