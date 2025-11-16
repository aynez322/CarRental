import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './NavBar.css';
import logo from '../../../assets/logo.png';

export default function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
          
          <button 
            onClick={() => scrollToSection('contact')} 
            className="nav__link"
          >
            Contact
          </button>
          
          {user ? (
            <div className="nav__user-menu" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="nav__user-button">
                <FaUserCircle className="nav__user-icon" />
                <span className="nav__user-name">{user.name}</span>
              </button>
              
              {dropdownOpen && (
                <div className="nav__dropdown">
                  {isAdmin() ? (
                    <>
                      <Link to="/admin" className="nav__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Admin Panel
                      </Link>
                      <button onClick={handleLogout} className="nav__dropdown-item">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="nav__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/bookings" className="nav__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        My Bookings
                      </Link>
                      <button onClick={handleLogout} className="nav__dropdown-item">
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav__login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}