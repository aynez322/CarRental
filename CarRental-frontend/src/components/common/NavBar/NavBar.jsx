import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../../../assets/logo.png';

export default function NavBar() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="nav">
      <div className="nav__container">
        <div className="nav__brand">
          <Link to="/" className="nav__brand-link">
            <img src={logo} alt="Car Rental Logo" className="nav__logo" />
          </Link>
        </div>

        <nav className="nav__links">
          <Link to="/" className="nav__link">Home</Link>
          <Link to="/cars" className="nav__link">Cars</Link>
          <Link to="/bookings" className="nav__link">My Bookings</Link>
          
          <button 
            onClick={() => scrollToSection('contact')} 
            className="nav__link"
          >
            Contact
          </button>
          
          <button className="nav__login">Login</button>
          
          <Link to="/admin" className="nav__admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}