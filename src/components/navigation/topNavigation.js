import { Button, Col, Row } from "reactstrap";
import './navigation.css';

function TopNavigation() {
  return (
    <Row className="top-navigation">
        <Col md={4} className="logo">BRAINMAP</Col>
        <Col md={8} className="top-right-nav">
            <Button {...{color:'none'}} className="bg-white">Home</Button>
            <Button {...{color:'none'}} className="mx-4 bg-white">Pro</Button>
            <Button {...{color:'none'}} className="bg-white d-inline-block">Login</Button>
        </Col>
    </Row>
  );
}

export default TopNavigation;
