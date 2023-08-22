import Common from "../common";
const school_id = Common.getUserLoginData.school_id;
function LogoutUser() {
  localStorage.clear();
  window.location = "/" + school_id + "/login";
  return true;
}

export default LogoutUser;
