import { useState, useEffect } from "react";
import CarCard from "../CarCard/CarCard.jsx";
import "./CarList.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";
const mockCars = [
    {
      id: 1,
      brand: "Toyota",
      model: "Camry",
      price: 50,
      image: "/images/cars/camry.jpg",
      year: 2020,
      fuel: "Petrol",
      gearbox: "Automatic",
      passengers: 4,
    },
    {
      id: 2,
      brand: "Honda",
      model: "Civic",
      price: 45,
      image: "/images/cars/honda.jpg",
      year: 2020,
      fuel: "Petrol",
      gearbox: "Automatic",
      passengers: 4,
    },
    {
      id: 3,
      brand: "BMW",
      model: "5 Series",
      price: 200,
      image: "/images/cars/bmw5.jpg",
      year: 2024,
      fuel: "Petrol",
      gearbox: "Automatic",
      passengers: 5,
    },
    {
      id: 4,
      brand: "Audi",
      model: "A6",
      price: 200,
      image: "/images/cars/audia6.jpg",
      year: 2024,
      fuel: "Petrol",
      gearbox: "Automatic",
      passengers: 5,
    },
    {
      id: 5,
      brand: "Peugeot",
      model: "Expert",
      price: 100,
      image: "/images/cars/peugeot.png",
      year: 2025,
      fuel: "Petrol",
      gearbox: "Automatic",
      passengers: 9,
    },
    {
      id: 6,
      brand: "Mercedes-Benz",
      model: "CLS",
      price: 150,
      image: "/images/cars/mercedescls.jpg",
      year: 2021,
      fuel: "Petrol",
      gearbox: "Automatic",
      passengers: 4,
    },
  ];
  
function CarList({ filters = {} }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  

  

  useEffect(() => {
    setCars(mockCars);
  //   let isMounted = true;
  //   setLoading(true);

  //   const params = new URLSearchParams();
  //   if (filters.query) params.append("q", filters.query);
  //   if (filters.location) params.append("location", filters.location);
  //   if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  //   if (filters.dateTo) params.append("dateTo", filters.dateTo);

  //   fetch(`${API_BASE}/cars?${params.toString()}`)
  //     .then((res) => {
  //       if (!res.ok) throw new Error("API response not ok");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if (!isMounted) return;
  //       const list = Array.isArray(data) ? data : data.cars || [];
  //       const filtered = applyClientFilters(list, filters);
  //       setCars(filtered);
  //     })
  //     .catch(() => {
  //       const filtered = applyClientFilters(mockCars, filters);
  //       // if (isMounted) 
  //       setCars(filtered);
  //       console.log('Sasat');
  //     })
  //     .finally(() => {
  //       if (isMounted) setLoading(false);
  //     });

  //   return () => {
  //     isMounted = false;
  //   };
  // 
  }, []);

  // function applyClientFilters(list, filters) {
  //   const q = (filters.query || "").trim().toLowerCase();
  //   if (!q) return list;
  //   return list.filter((c) => {
  //     const text = `${c.brand} ${c.model} ${c.year} ${
  //       c.plateNumber ?? ""
  //     }`.toLowerCase();
  //     return text.includes(q);
  //   });}

  return (
  <div id="cars" className="car-list">
    <h2>Featured cars</h2>

    {loading && <div className="carlist__loading">Loading cars...</div>}
    {!loading && !cars.length && <div className="carlist__empty">No cars available.</div>}

    {!loading && cars.length > 0 && (
      <div className="car-grid">
        {cars.map(car => (
          <CarCard 
            car = {car}
          />
        ))}
      </div>
    )}
  </div>
);
}

export default CarList;
