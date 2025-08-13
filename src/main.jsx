import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import Bootstrap styles and scripts
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Use `.min.js` for better performance

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Import Prime React Styles
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core styles
import "primeicons/primeicons.css"; // Icons

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ToastContainer position="top-right" autoClose={3000} />
    <App />
  </StrictMode>,
)
