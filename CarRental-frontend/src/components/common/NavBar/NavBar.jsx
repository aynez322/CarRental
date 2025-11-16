import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './NavBar.css';
import logo from '../../../assets/logo.png';

export default function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
          
          {user && (
            <Link to="/bookings" className="nav__link">My Bookings</Link>
          )}
          
          <button 
            onClick={() => scrollToSection('contact')} 
            className="nav__link"
          >
            Contact
          </button>
          
          {user ? (
            <>
              <button onClick={handleLogout} className="nav__login">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav__login">Login</Link>
          )}
          
          {isAdmin() && (
            <Link to="/admin" className="nav__admin">Admin</Link>
          )}
        </nav>
      </div>
    </header>
  );
}