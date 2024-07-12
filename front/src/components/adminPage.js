import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { FaCamera, FaSignOutAlt } from "react-icons/fa";
import NotificationAlert from "react-notification-alert";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Nav,
  Navbar,
  NavItem,
  Row,
} from "reactstrap";
import "./adminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const notificationAlertRef = useRef();
  const fetchUsers = ()=> {
    axios
        .get("http://localhost:3001/admin/users")
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((err) => console.log(err));
    }
  
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/");
    } else {
      fetchUsers()
  }}, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/data");
        setData((prevData) => [...prevData, response.data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const latestTemperature = parseInt(data[data.length - 1].temperature);
      showNotification(latestTemperature);
    }
  }, [data]);

  const showNotification = (temperature) => {
    let type;
    let message;
    if (temperature <= 10) {
      type = "success";
      message = (
        <div>
          <div>Temperature is low: {temperature} °C</div>
        </div>
      );
    } else if (temperature >= 28) {
      type = "danger";
      message = (
        <div>
          <div>Temperature is high: {temperature} °C</div>
        </div>
      );
    } else {
      return;
    }

    const options = {
      place: "tr",
      message: message,
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const calculateAverage = (values) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  const getAverageValues = () => {
    const temperatures = data.map((item) => parseInt(item.temperature));
    const humidities = data.map((item) => parseInt(item.humidity));
    const pressures = data.map((item) => parseInt(item.pressure));

    const averageTemperature = calculateAverage(temperatures);
    const averageHumidity = calculateAverage(humidities);
    const averagePressure = calculateAverage(pressures);

    return { averageTemperature, averageHumidity, averagePressure };
  };

  const { averageTemperature, averageHumidity, averagePressure } =
    getAverageValues();

  const radialBarOptions = {
    chart: {
      type: "radialBar",
    },
    // series: [averageTemperature, averageHumidity, averagePressure],
    series: [10, 20, 30],
    labels: ["Temperature", "Humidity", "Pressure"],
  };

  const handleAccessChange = (id, newAccess) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, access: newAccess.join(",") };
      }
      return user;
    });
    setUsers(updatedUsers);
    axios
      .put(`http://localhost:3001/admin/users`, {
        access: newAccess.join(","),
        id,
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteUser = (id)=>{
    axios.delete(`http://localhost:3001/admin/delete/${id}`).then((response)=>{
      if(response.status===200){
        fetchUsers();
      }
    }).catch((err)=>{
      alert(err);
    })
  }

  const handleSwitchChange = (id, type, checked) => {
    const user = users.find((user) => user.id === id);
    let newAccess = user.access ? user.access.split(",") : [];
    if (checked) {
      newAccess.push(type);
    } else {
      newAccess = newAccess.filter((access) => access !== type);
    }
    handleAccessChange(id, newAccess);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="sidebar-wrapper">
          <div className="logo">
            <Link className="simple-text">Admin Dashboard</Link>
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
          <div className="navbar-brand">Admin Dashboard</div>
        </Navbar>
        <div className="content">
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-sun-fog-29 text-success" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Temperature</p>
                        <CardTitle tag="p">
                          {data.length > 0
                            ? parseInt(data[data.length - 1].temperature)
                            : 0}{" "}
                          °C
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fas fa-sync-alt" /> In the Area
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-vector text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Humidity</p>
                        <CardTitle tag="p">
                          {data.length > 0
                            ? parseInt(data[data.length - 1].humidity)
                            : 0}{" "}
                          %
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fas fa-sync-alt" /> In the Area
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-air-baloon" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Pressure</p>
                        <CardTitle tag="p">
                          {data.length > 0
                            ? parseInt(data[data.length - 1].pressure)
                            : 0}{" "}
                          %
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fas fa-sync-alt" /> In the Area
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col>
                      <CardTitle>
                        <h3>Average Value every 3s</h3>
                      </CardTitle>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers"></div>
                    </Col>
                  </Row>
                </CardBody>
                <Chart
                  options={radialBarOptions}
                  series={radialBarOptions.series}
                  type="radialBar"
                  height={350}
                />
              </Card>
            </Col>
          </Row>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Temperature</TableCell>
                  <TableCell align="right">Humidity</TableCell>
                  <TableCell align="right">Pressure</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={user.access?.includes("T")}
                        onChange={(e) =>
                          handleSwitchChange(user.id, "T", e.target.checked)
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={user.access?.includes("H")}
                        onChange={(e) =>
                          handleSwitchChange(user.id, "H", e.target.checked)
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={user.access?.includes("P")}
                        onChange={(e) =>
                          handleSwitchChange(user.id, "P", e.target.checked)
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="delete" onClick={()=>handleDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
