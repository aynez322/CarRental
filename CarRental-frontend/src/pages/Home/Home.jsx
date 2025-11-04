import React, { useState } from 'react';
import './Home.css';
import NavBar from '../../components/common/NavBar/NavBar';
import CarList from '../../components/car/CarList/CarList';
import carImg from '../../assets/masina.png';
import Contact from '../../components/contact/Contact';


export default function Home() {
  const [filters, setFilters] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    query: ''
  });

  function onSearch(e) {
    e.preventDefault();
  }

  return (
    <div className="home">
      <NavBar />

      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">Car Hire in Cluj-Napoca</h1>
          

          <form className="searchbar" onSubmit={onSearch}>
            <div className="searchbar__item">
              <label>Pickup Location</label>
              <select value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
                <option value="">Select location</option>
                <option value="aeroport">"Avram Iancu" International Airport</option>
                <option value="autogara">Autogara Beta</option>
              </select>
            </div>

            <div className="searchbar__item">
              <label>Pick-up Date</label>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} />
            </div>

            <div className="searchbar__item">
              <label>Return Date</label>
              <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} />
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
       
        <CarList filters={filters} />
      </main>
      <Contact />
    </div>
  );
}