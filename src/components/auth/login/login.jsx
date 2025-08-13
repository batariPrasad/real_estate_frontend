import './login.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import loginImage from '../../../assets/auth/loginImage.jpg';



const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState(""); // Can be email or mobile number
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const loginHandler = async (e) => {
        e.preventDefault();

        try {
            const userDetails = await postData(config.login, {
                email: identifier.includes("@") ? identifier : "",  // If input contains "@", treat it as email
                mobilenumber: /^\d+$/.test(identifier) ? identifier : "", // If input is all numbers, treat it as mobile number
                username: !identifier.includes("@") && !/^\d+$/.test(identifier) ? identifier : "", // Otherwise, treat as username
                password
              });

              
            console.log("User Details:", userDetails);

            if (userDetails?.success) {
                Cookies.set("loginToken", userDetails.data.token);
                Cookies.set("fullname", userDetails.data.user.fullname);
                Cookies.set("profile", userDetails.data.user.profile);
                toast.success(`Welcome! ${Cookies.get("fullname")}`);
                setIdentifier(""); // Clear input fields
                setPassword("");
                navigate("/"); // Navigate to home page after login
            } else {
                toast.error("Login failed: Invalid credentials");
            }
        } catch (error) {
            toast.error("Login Failed: " + error.message);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
            <div className="row shadow-lg rounded login-container d-flex flex-column flex-lg-row">

                {/* Left Side - Welcome Section */}
                <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center p-4 bg-primary text-white login-left">
                    <h2 className="fw-bold">Welcome Back!</h2>
                    <p>Sign in to access your account</p>
                    <img
                        // src="/src/assets/auth/loginimage.jpg"
                         src={loginImage}
                        alt="Login Illustration"
                        className="img-fluid mt-3 login-image rounded"
                    />
                    <Link to="/" className="btn btn-light btn-sm mt-4">Go to Home</Link>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-lg-6 d-flex flex-column justify-content-center bg-white p-4 login-right">
                    <h3 className="text-center fw-bold">Login</h3>
                    <p className="text-center text-muted mb-3">Enter your credentials to continue.</p>

                    {/* Email/Mobile Input */}
                    <div className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-0 border-bottom border-2 border-dark rounded-0 text-danger">
                                <i className="pi pi-user"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 border-bottom border-2 border-dark shadow-none rounded-0"
                                placeholder="Enter Email / Mobile / username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}



                    <div className="mb-4">
                        <div className="input-group">
                            {/* Lock Icon */}
                            <span className="input-group-text bg-white border-0 border-bottom border-2 border-dark rounded-0 text-dark">
                                <i className="pi pi-lock"></i>
                            </span>

                            {/* Password Input Field */}
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control border-0 border-bottom border-2   shadow-none border-dark rounded-0"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Eye Icon for Show/Hide Password */}
                            <span
                                className="input-group-text bg-white border-0 border-bottom border-2 border-dark rounded-0 text-dark"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`}></i>
                            </span>
                        </div>
                    </div>


                    {/* Login Button */}
                    <div className="text-center mt-4">
                        <button className="btn btn-primary btn-sm w-100" onClick={loginHandler}>Login</button>
                    </div>

                    {/* Additional Help Links */}
                    <div className="text-center text-muted mt-4">
                        <p>Forgot your password? <Link to="/forgotpassword" className="text-primary fw-bold">Reset it here</Link></p>
                        <p>New here? <Link to="/signup" className="text-primary fw-bold">Create an account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
