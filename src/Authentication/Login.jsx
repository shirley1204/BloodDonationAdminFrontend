import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/Redux/userSlice";
import {validateLoginForm } from "../Utils/Validation";
import LoginImg from "../assets/loginpage.png";
import Footer from "../DrawerLayout/Footer";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlelogin = async () => {
    const validationErrors = await validateLoginForm(emailId, password);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "login",
        { emailId, password },
        { withCredentials: true },
      );

      if (res.data) {
        dispatch(addUser(res.data?.data));
        const{role} = res.data?.data
        if(role === "admin"){
        navigate("/");
        }else if(role === "user"){
          navigate("/donor/add")
        }else{
          navigate("/")
        }
      }
    } catch (err) {
      setError(err?.response?.data || "Something Went Wrong");
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-left">
          <img
            src={LoginImg}
            alt="Blood Donation"
          />
        </div>

       <div className="login-right">
          <div className="form-card">
            <div className="brand-header">
              <h1 className="brand-title">Possa Hospital</h1>
              <p className="brand-subtitle">Blood Donation System</p>
            </div>

            <h2>{"Welcome Back"}</h2>

            <p className="subtitle">Donate blood, save lives ❤️</p>

            <input
              type="email"
              placeholder="Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {error && (
              <div className="error-box">
                {typeof error === "object"
                  ? Object.values(error).map((e, i) => <p key={i}>{e}</p>)
                  : error}
              </div>
            )}

            <button onClick={handlelogin}>LOGIN</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
