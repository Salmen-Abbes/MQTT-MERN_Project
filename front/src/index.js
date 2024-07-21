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
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import SignInSide from "components/sign in/SignInSide";
import SignUpSide from "components/signUp/SignUpSide";
import ForgotPassword from "components/forgetPassword/ForgetPassword";
import AdminPage from "components/adminPage";
import ResetPassword from "components/resetPassword/ResetPassword"; 
import CameraPage from "components/adminCamera";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path="/signup" element={<SignUpSide />} />
      <Route path="/signup" element={<SignUpSide />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token/:email" element={<ResetPassword />} />
      <Route path="/user/*" element={<AdminLayout />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/camera" element={<CameraPage />} />
      {/*<Route path="/" element={<Navigate to="/admin/dashboard" replace />} />*/}
    </Routes>
  </BrowserRouter>
);
