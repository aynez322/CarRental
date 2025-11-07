import React from 'react';
import NavBar from '../../components/common/NavBar/NavBar';
import './AvailableCars.css';
import CarList from '../../components/car/CarList/CarList';

export function AvailableCars() {
  return (
    <div className="available-cars-page">
      <NavBar />
      
      <div className="available-cars-container">
        <div className="available-cars-header">
          <h1>Available Cars</h1>
          <p>Browse our collection of rental vehicles</p>
        </div>
        
        <div className="available-cars-content">
          <CarList/>
        </div>
      </div>
    </div>
  );
}