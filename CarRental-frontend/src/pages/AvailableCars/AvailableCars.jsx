import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../../components/common/NavBar/NavBar';
import './AvailableCars.css';
import CarList from '../../components/car/CarList/CarList';

export function AvailableCars() {
  const { search } = useLocation();

  const filters = useMemo(() => {
    const sp = new URLSearchParams(search);
    return {
      location: sp.get('location') || '',
      pickupDate: sp.get('pickupDate') || '',
      returnDate: sp.get('returnDate') || '',
      query: sp.get('q') || ''
    };
  }, [search]);

  return (
    <div className="available-cars-page">
      <NavBar />
      <div className="available-cars-container">
        <div className="available-cars-header">
          <h1>Available Cars</h1>
          <p>Browse our collection of rental vehicles</p>
        </div>
        <div className="available-cars-content">
          <CarList mode="filtered" filters={filters} />
        </div>
      </div>
    </div>
  );
}