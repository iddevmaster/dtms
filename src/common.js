const exports = {};
exports.app_name = "DTMS";
exports.API_URL = "http://127.0.0.1:8000/";
exports.IMAGE_URL = "http://127.0.0.1:8000/general/render/?file_path=";

exports.API_ID_CARD =
  "https://localhost:8182/thaiid/read.jsonp?callback=callback&section1=true&section2a=true&section2c=true";
exports.options = {
  headers: {
    "content-type": "application/json",
    Authorization: "Bearer gGaQfRuJ80k4JTErVxA5V9NQ8OB9fP",
  },
};
if (JSON.parse(localStorage.getItem("token_profile")) === null) {
  exports.getUserLoginData = {
    success: false,
    user_id: "",
    user_type: 0,
    full_name: "",
    branch_id: "",
    branch_name: "",
    school_id: "",
    school_name: "",
  };
} else {
  exports.getUserLoginData = JSON.parse(localStorage.getItem("token_profile"));
}

exports.base_school_id = "schoolplatformid";
exports.base_branch_id = "branchplatformid";
exports.customSelectStyles = {
  control: (base) => ({
    ...base,
    height: 47,
    minHeight: 47,
  }),
};
export default exports;
