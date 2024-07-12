import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Row, Col, Navbar, Nav, NavItem, Button } from "reactstrap";
import { FaCamera, FaSignOutAlt } from 'react-icons/fa';
import './adminPage.css'; // Reuse the CSS file for consistent styling

const MapWrapper = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        title="Live Stream"
        src="http://192.168.242.134/"
        width="100%"
        height="100%"
        allowFullScreen
      />
    </div>
  );
};

const CameraPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="sidebar-wrapper">
          <div className="logo">
            <Link to="/admin" className="simple-text">
              Admin Dashboard
            </Link>
          </div>
          <Nav>
            <NavItem>
              <Link to="/admin/camera" className="nav-link">
                <FaCamera /> Camera
              </Link>
            </NavItem>
            <NavItem>
              <Button color="danger" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </Button>
            </NavItem>
          </Nav>
        </div>
      </div>
      <div className="main-panel">
        <Navbar color="light" light expand="md">
          <div className="navbar-brand">Camera Page</div>
        </Navbar>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>Live Cam</CardHeader>
                <CardBody>
                  <div
                    id="map"
                    className="map"
                    style={{ position: "relative", overflow: "hidden", height: "500px" }}
                  >
                    <MapWrapper />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
