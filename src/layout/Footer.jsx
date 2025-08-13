import React from 'react';
import { Divider } from 'primereact/divider';
import 'primeicons/primeicons.css'; // Import PrimeIcons

export default function Footer() {
    return (
        <div style={{
            backgroundColor: '#f4f4f4',
            padding: '1rem',
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#555'
        }}>
            <Divider />

            <p>© {new Date().getFullYear()} MyCompany. All rights reserved.</p>

            <p>
                <a href="/privacy" style={{ textDecoration: 'none', color: '#007ad9' }}>Privacy Policy</a> |{" "}
                <a href="/terms" style={{ textDecoration: 'none', color: '#007ad9' }}>Terms of Service</a>
            </p>

            {/* Contact & Social Icons */}
            <div style={{ marginTop: '0.5rem' }}>
                <a href="mailto:yourmail@gmail.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', color: '#555' }}>
                    <i className="pi pi-envelope" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', color: '#3b5998' }}>
                    <i className="pi pi-facebook" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', color: '#E1306C' }}>
                    <i className="pi pi-instagram" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', color: '#1DA1F2' }}>
                    <i className="pi pi-twitter" style={{ fontSize: '1.5rem' }}></i>
                </a>
            </div>
        </div>
    );
}
