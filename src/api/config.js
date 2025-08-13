// const host = "http://localhost:2026";
const host = "https://real-estate-8mg4.onrender.com";

export const config = {
  host: `${host}`,

  // AUTH
  login: `${host}/user/login`,
  register: `${host}/user/register`,
  forgotPassword: `${host}/user/forgot-password`,
  resetPassword: `${host}/user/reset-password`,
  sendOtp: `${host}/user/send-otp`,
  verifyOtp: `${host}/user/verify-otp`,

  // PROPERTIES
  addProperty: `${host}/builder/addProperty`,
  getAllProperties: `${host}/builder/getProperties`,
  getPropertyById: `${host}/builder/get`, // ✅ Corrected API route
  deletePropertyById: `${host}/builder/delete`,

  updateProperty: `${host}/builder/update`,  // ✅ Correct

};
