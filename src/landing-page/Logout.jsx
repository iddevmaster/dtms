// import { Component } from "react";

// export default class Logout extends Component {
//   componentDidMount() {
//     let school_id = this.props.school_id;
//     localStorage.clear();
//     if (school_id !== "" && school_id !== undefined) {
//       window.location = "/" + school_id + "/login";
//     } else {
//       window.location = "/staff/z/login";
//     }
//   }
//   render() {
//     return true;
//   }
// }

function Logout() {
  localStorage.clear();
  window.location = "/staff/z/login";
  return true;
}

export default Logout;
