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
        image: '/images/cars/honda.jpg',
        year: 2020,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 1, 
        brand: 'BMW', 
        model: '5 Series', 
        price: 200, 
        image: '/images/cars/bmw5.jpg',
        year: 2024,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 5
      },
      { 
        id: 1, 
        brand: 'Audi', 
        model: 'A6', 
        price: 200, 
        image: '/images/cars/audia6.jpg',
        year: 2024,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 5
      },
      { 
        id: 1, 
        brand: 'Peugeot', 
        model: 'Expert', 
        price: 100, 
        image: '/images/cars/peugeot.png',
        year: 2025,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 9
      },
      { 
        id: 1, 
        brand: 'Mercedes-Benz', 
        model: 'CLS', 
        price: 150, 
        image: '/images/cars/mercedescls.jpg',
        year: 2021,
        fuel: 'Petrol',
        gearbox: 'Automatic',
        passengers: 4
      },
      { 
        id: 1, 
        brand: 'Mercedes-Benz', 
        model: 'CLS', 
        price: 150, 
        image: '/images/cars/mercedescls.jpg',
        year: 2021,
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