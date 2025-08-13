
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "../routes/routes";
import Navbar from "./Navbar";


const Dashboard = () => {

    const location = useLocation();

    // Hide Navbar for these routes
    const hideNavbarRoutes = ["/login", "/signup", "/forgotpassword"];
    const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && <Navbar />}
            <AppRoutes />
        </>
    );

}


export default Dashboard;