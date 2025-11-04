import React from 'react';
import './NavBar.css';
import logo from '../../../assets/logo.png';

export default function NavBar() {
  return (
    <header className="nav">
      <div className="nav__container">
        <div className="nav__brand">
         <a href="/" className="nav__brand-link">
          <img src={logo} alt="Car Rental Logo" className="nav__logo" />
         </a>
        </div>

        <nav className="nav__links">
          <a href="/" className="nav__link">Home</a>
          <a href="#cars" className="nav__link">Cars</a>
          <a href="/bookings" className="nav__link">My Bookings</a>
          <a href="#contact" className="nav__link">Contact</a>
          <button className="nav__login">Login</button>
          <button className="nav__admin">Admin</button>
        </nav>
      </div>
    </header>
  );
}