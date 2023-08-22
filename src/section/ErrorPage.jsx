import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

function ErrorPage() {
  return (
    <Alert variant="warning">
      <Alert.Heading>ErrorPage 404</Alert.Heading>
      <p>ไม่มีหน้านี้ หรือข้อมูลนี้ภายในระบบกรุณาทำรายการใหม่อีกครั้ง !</p>
      <hr />
      <p className="mb-0">
        <LinkContainer to="/">
          <Button variant="info" size="sm">
            กลับไปยังหน้าหลัก
          </Button>
        </LinkContainer>
      </p>
    </Alert>
  );
}

export default ErrorPage;
