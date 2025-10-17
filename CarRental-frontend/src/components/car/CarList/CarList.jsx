import { useState, useEffect } from 'react';
import { CarCard } from '../CarCard/CarCard';
import './CarList.css';

function CarList() {
  const [cars, setCars] = useState([]);
  useEffect(() => {
    const mockCars = [
      { 
        id: 1, 
        brand: 'Toyota', 
        model: 'Camry', 
        price: 50, 
        image: '/images/cars/camry.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 2, 
        brand: 'Honda', 
        model: 'Civic', 
        price: 45, 
        image: '/images/cars/camry.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 1, 
        brand: 'Toyota', 
        model: 'Camry', 
        price: 50, 
        image: '/images/cars/camry.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 1, 
        brand: 'Toyota', 
        model: 'Camry', 
        price: 50, 
        image: '/images/cars/camry.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 1, 
        brand: 'Toyota', 
        model: 'Camry', 
        price: 50, 
        image: '/images/cars/camry.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 1, 
        brand: 'Toyota', 
        model: 'Camry', 
        price: 50, 
        image: '/images/cars/camry.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      }
    ];
    
    setCars(mockCars);
    
  }, []); 
  return (
    <div className="car-list">
      <h2>Available Cars</h2>
      <div className="car-grid">
        {cars.map(car => (
          <CarCard 
            key={car.id} 
            image={car.image} 
            brand={car.brand} 
            model={car.model} 
            price={car.price} 
            year={car.year} 
            fuel={car.fuel} 
            gearbox={car.gearbox} 
            passengers={car.passengers}/>
        ))}
      </div>
    </div>
  );
}

export default CarList;