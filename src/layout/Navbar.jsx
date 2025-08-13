import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Avatar } from 'primereact/avatar';
import "./nav.css"

const Navbar = () => {
  const navigate = useNavigate();
  const loginToken = Cookies.get('loginToken');
  const fullname = Cookies.get('fullname');
  const profile = Cookies.get('profile');

  const [property, setProperty] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setProperty({ id: '123' });
    }, 1000);
  }, []);

  const signOut = () => {
    Cookies.remove('loginToken');
    Cookies.remove('fullname');
    Cookies.remove('profile');
    toast.success('Logout Successfully!');
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-sm navbar-dark shadow-sm sticky-top"
      style={{ backgroundColor: '#ADD8E6' }} // Light Blue
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fs-2 text-secondary">
          ApnaNest
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item ">
              <Link to="/home" className="nav-link text-dark fw-semibold ">
                Home
              </Link>
            </li>

            {profile === 'builder' && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link active dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Become a Builder
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/addproperty">
                      Add Property
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/manageProperty">
                      Manage Properties
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Avatar Profile Dropdown */}
            <li className="nav-item dropdown ms-3">
              <button
                className="nav-link active dropdown-toggle d-flex align-items-center gap-2"
                role="button"
                data-bs-toggle="dropdown"
              >
                <Avatar
                  label={fullname ? fullname.charAt(0).toUpperCase() : 'P'}
                  size="small"
                  shape="circle"
                  style={{ backgroundColor: '#0d6efd', color: '#fff' }}
                />
                <span className="text-dark fw-semibold">{fullname || 'Profile'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {!loginToken ? (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        <i className="pi pi-sign-in me-2"></i> Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/signup">
                        <i className="pi pi-user-plus me-2"></i> Signup
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <button className="dropdown-item" onClick={signOut}>
                      <i className="pi pi-sign-out me-2"></i> Sign Out
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
