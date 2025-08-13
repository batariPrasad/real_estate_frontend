import { Route, Routes } from "react-router-dom";

import Home from "../components/home/Home";
import Login from "../components/auth/login/login";
import Signup from "../components/auth/signup/signup";
import ForgotPassword from "../components/auth/forgotPassword/forgotPassword";

import AddProperty from "../components/builder/AddProperty";
import PropertyDetails from "../components/allproperties/getPropertyDetails/PropertyDetails";
import PropertyManagement from "../components/manageProperties/ManageProperties";
import EditProperty from "../components/manageProperties/edit";


const AppRoutes = () => (
  <Routes>
    {/* HOME */}
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />

    {/* AUTH */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgotPassword" element={<ForgotPassword />} />

    {/* PROPERTIES */}
    
    <Route path="/addproperty" element={<AddProperty />} />
    <Route path="/property/:id" element={<PropertyDetails />} />
    <Route path="/manageProperty" element={<PropertyManagement />} />
    <Route path="/editProperty/:id" element={<EditProperty />} />


  </Routes>
);

export default AppRoutes;
