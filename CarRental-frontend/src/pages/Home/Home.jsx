import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import NavBar from '../../components/common/NavBar/NavBar';
import carImg from '../../assets/masina.png';
import Contact from '../../components/contact/Contact';
import CarList from '../../components/car/CarList/CarList';

export default function Home() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    query: ''
  });

  function onSearch(e) {
    e.preventDefault();
    if (filters.pickupDate && filters.returnDate && filters.returnDate < filters.pickupDate) {
      alert('Return date nu poate fi înainte de pickup date.');
      return;
    }
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.pickupDate) params.set('pickupDate', filters.pickupDate);
    if (filters.returnDate) params.set('returnDate', filters.returnDate);
    const qs = params.toString();
    navigate(`/cars${qs ? `?${qs}` : ''}`);
  }

  return (
    <div className="home">
      <NavBar />

      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">
            Car Hire in <span className="hero__title--highlight">Cluj-Napoca</span>
          </h1>

          <form className="searchbar" onSubmit={onSearch}>
            <div className="searchbar__item">
              <label>Pickup Location</label>
              <select
                value={filters.location}
                onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              >
                <option value="">Select location</option>
                <option value="Avram Iancu International Airport">Avram Iancu International Airport</option>
                <option value="Autogara Beta">Autogara Beta</option>
              </select>
            </div>

            <div className="searchbar__item">
              <label>Pick-up Date</label>
              <input
                type="date"
                value={filters.pickupDate}
                onChange={e => setFilters(f => ({ ...f, pickupDate: e.target.value }))}
              />
            </div>

            <div className="searchbar__item">
              <label>Return Date</label>
              <input
                type="date"
                value={filters.returnDate}
                onChange={e => setFilters(f => ({ ...f, returnDate: e.target.value }))}
              />
            </div>

            <div className="searchbar__item searchbar__action">
              <button type="submit" className="btn-primary">Search</button>
            </div>
          </form>

          <div className="hero__car">
            <img src={carImg} alt="Featured car" />
          </div>
        </div>
      </section>

      <main className="container">
        <CarList mode="all" />
      </main>

      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}