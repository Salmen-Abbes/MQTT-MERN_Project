/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Logout from "views/logout";
import Map from "views/Map";
var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/user",
  },
  {
    path: "/map",
    name: "Camera",
    icon: "nc-icon nc-camera-compact",
    component: <Map />,
    layout: "/user",
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-button-power",
    component: <Logout />,
    layout: "/user",
  },
];
export default routes;
