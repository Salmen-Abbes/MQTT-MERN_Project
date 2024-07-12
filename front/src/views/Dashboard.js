import { useEffect, useRef, useState } from "react";
import axios from "axios";
import NotificationAlert from "react-notification-alert";
import { useNavigate  } from "react-router-dom";
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from "reactstrap";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const notificationAlertRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); //eslint-disable-line

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

  const { averageTemperature, averageHumidity, averagePressure } = getAverageValues();

  const radialBarOptions = {
    chart: {
      type: "radialBar",
    },
    // series: [averageTemperature, averageHumidity, averagePressure],
    series: [10, 20, 30],
    labels: ["Temperature", "Humidity", "Pressure"],
  };

  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlertRef} />
        <Row>
          {user && user.access.includes("T") && (
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
          )}
          {user && user.access.includes("H") && (
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
          )}
          {user && user.access.includes("P") && (
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-air-baloon " />
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
          )}
        </Row>
        <Row>
          <Col md="12">
          <Card className="card-stats">
          <CardBody>
                  <Row>
                    <Col >
                      <CardTitle >
                        <h3 >Average Value every 3s</h3>
                        </CardTitle>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        
                        
                      </div>
                    </Col>
                  </Row>
                </CardBody>
            <Chart options={radialBarOptions} series={radialBarOptions.series} type="radialBar" height={350} />
          </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
