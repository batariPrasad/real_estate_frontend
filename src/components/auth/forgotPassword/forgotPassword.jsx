import './forgotPassword.css';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../../api/apiHandler";
import { config } from "../../../api/config";
import { InputOtp } from 'primereact/inputotp';
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message1, setMessage1] = useState("");
    const [error1, setError1] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(360); // 5 minutes (300 seconds)

    const [showPassword, setShowPassword] = useState(false);


    // Start Timer when OTP is sent
    useEffect(() => {
        if (showResetPassword && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showResetPassword, timeLeft]);

    // Handle OTP request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setOtpLoading(true);

        let response = await postData(config.forgotPassword, { email });
        console.log("Response at forgot password:", response);
        if (response.success) {
            setMessage(response.data.message);
            setShowResetPassword(true);
            setError("");
            setTimeLeft(360); // Reset timer to 5 minutes
        } else {
            setError("Failed to send OTP");
        }

        setOtpLoading(false);
    };

    // Handle Password Reset
    const resetHandler = async (e) => {
        e.preventDefault();
        setMessage1("");
        setError1("");
        setLoading(true);

        // Password Regex Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!newPassword.match(passwordRegex)) {
            toast.error("Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character.");
            setLoading(false);
            return;
        }

        let res = await postData(config.resetPassword, { otp, newPassword });
        if (res.success) {
            alert(res.data.message);
            navigate("/login");
        } else {
            setError1("Failed to reset password");
        }

        setLoading(false);
    };

    // Format Timer (mm:ss)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="row shadow-lg bg-white rounded w-75 align-items-stretch">
                {/* Left Side - Image */}
                <div className="col-lg-6  d-none d-sm-flex align-items-center justify-content-center">
                    <img
                        src="/src/assets/auth/forgotPassword.jpg"
                        alt="Forgot Password"
                        className="w-100 h-100"
                        style={{ objectFit: "cover", maxHeight: "100%" }}
                    />
                </div>


                {/* Right Side - Form */}
                <div className="col-lg-6 pt-3 pb-3 d-flex flex-column justify-content-center">
                    <div className="shadow-lg p-4 rounded w-100 bg-white">
                        <h3 className="text-center text-primary">Forgot Password?</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Enter Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            {message && <div className="alert alert-success p-2">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="text-center">
                                <button type="submit" className="btn btn-success btn-sm col-6 m-auto">
                                    <i className={otpLoading ? "spinner-border me-1" : ''} style={{ width: "1rem", height: "1rem" }}></i> Send OTP
                                </button>
                            </div>
                        </form>

                        {/* Reset Password Section (Visible After OTP is Sent) */}
                        {showResetPassword && (
                            <>
                                <hr />
                                <h3 className="text-center text-info">Reset Password</h3>
                                <form onSubmit={resetHandler}>
                                    <div className="mb-3 justify-content-center">
                                        <label className="form-label">Enter OTP</label>
                                        <InputOtp
                                            value={otp}
                                            onChange={(e) => setOtp(e.value)}
                                            length={6}
                                            inputTemplate={({ events, props }) => (
                                                <input {...events} {...props} type="text" className="custom-otp-input mb-3" />
                                            )}
                                        />
                                        {/* Timer below password input */}
                                        <small className="text-danger">
                                            OTP expires in: {formatTime(timeLeft)}
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Enter New Password</label>
                                        {/* <input
                                            type="password"
                                            className="form-control"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            value={newPassword}
                                            placeholder="Enter New Password"
                                            required
                                        /> */}
                                        <div className="input-group">

                                            {/* Password Input Field */}
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />

                                            {/* Eye Icon for Show/Hide Password */}
                                            <span
                                                className="input-group-text"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`}></i>
                                            </span>


                                        </div>
                                    </div>

                                    {message1 && <div className="alert alert-success">{message1}</div>}
                                    {error1 && <div className="alert alert-danger">{error1}</div>}
                                    <div className="text-center">
                                        <button className="btn btn-info btn-sm col-6 m-auto" type="submit" disabled={loading || timeLeft === 0}>
                                            {loading ? "Processing..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        <div className="text-center mt-3">
                            <p className="text-muted">Remembered your password?</p>
                            <Link to="/login" className="btn btn-outline-primary btn-sm">Back to Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
