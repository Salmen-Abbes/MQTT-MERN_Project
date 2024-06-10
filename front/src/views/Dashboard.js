import React, { useEffect, useState, useRef } from "react";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
import NotificationAlert from "react-notification-alert";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
// core components
import { dashboard24HoursPerformanceChart } from "variables/charts.js";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const notificationAlertRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Clean up interval on unmount
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
      return; // Do not show notification if temperature is within normal range
    }

    const options = {
      place: "tr", // top right
      message: message,
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  return (
    <>
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
                        {" "}
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
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Plants Health Prediction</CardTitle>
                <p className="card-category">24 Hours stats</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
//arrow function
/* 
const dashboard = ()=>{

}
*/
export default Dashboard;
