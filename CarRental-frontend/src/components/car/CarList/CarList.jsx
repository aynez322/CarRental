import { useState, useEffect } from "react";
import CarCard from "../CarCard/CarCard.jsx";
import "./CarList.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

const mockCars = [
  { id: 1, brand: "Toyota", model: "Camry", pricePerDay: 50, year: 2020, fuelType: "Petrol", gearbox: "Automatic", passengers: 4 },
  { id: 2, brand: "Honda", model: "Civic", pricePerDay: 45, year: 2020, fuelType: "Petrol", gearbox: "Automatic", passengers: 4 },
  { id: 3, brand: "BMW", model: "5 Series", pricePerDay: 200, year: 2024, fuelType: "Petrol", gearbox: "Automatic", passengers: 5 },
  { id: 4, brand: "Audi", model: "A6", pricePerDay: 200, year: 2024, fuelType: "Petrol", gearbox: "Automatic", passengers: 5 },
  { id: 5, brand: "Peugeot", model: "Expert", pricePerDay: 100, year: 2025, fuelType: "Petrol", gearbox: "Automatic", passengers: 9 },
  { id: 6, brand: "Mercedes-Benz", model: "CLS", pricePerDay: 150, year: 2021, fuelType: "Petrol", gearbox: "Automatic", passengers: 4 },
];

function CarList({ mode = "filtered", filters = {} }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (mode !== "all") return;

    let abort = false;
    setLoading(true);
    setErr(null);

    const url = `${API_BASE}/cars`;
    console.log("FETCH cars (ALL) URL:", url);

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status} ${res.statusText}: ${txt}`);
        }
        return res.json();
      })
      .then((data) => {
        if (abort) return;

        const list = Array.isArray(data) ? data : data.cars || [];
        setCars(list);
      })
      .catch((e) => {
        console.error("CarList fetch error (ALL):", e.message);
        if (!abort) {
          setCars(mockCars);
          setErr(e.message);
        }
      })
      .finally(() => {
        if (!abort) setLoading(false);
      });

    return () => { abort = true; };
  }, [mode]);

  useEffect(() => {
    if (mode !== "filtered") return;

    let abort = false;
    setLoading(true);
    setErr(null);

    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.pickupDate) params.append("pickupDate", filters.pickupDate); // YYYY-MM-DD
    if (filters.returnDate) params.append("returnDate", filters.returnDate); // YYYY-MM-DD

    const url = `${API_BASE}/cars${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("FETCH cars (FILTERED) URL:", url);

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status} ${res.statusText}: ${txt}`);
        }
        return res.json();
      })
      .then((data) => {
        if (abort) return;
        const list = Array.isArray(data) ? data : data.cars || [];
        const filtered = applyClientQueryFilter(list, filters.query);
        setCars(filtered);
      })
      .catch((e) => {
        console.error("CarList fetch error (FILTERED):", e.message);
        if (!abort) {
          setCars(applyClientQueryFilter(mockCars, filters.query));
          setErr(e.message);
        }
      })
      .finally(() => {
        if (!abort) setLoading(false);
      });

    return () => { abort = true; };
  }, [mode, filters.location, filters.pickupDate, filters.returnDate, filters.query]);

  function applyClientQueryFilter(list, query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => (`${c.brand} ${c.model} ${c.year}`).toLowerCase().includes(q));
  }

  return (
    <div id="cars" className="car-list">
      <h2>{mode === "all" ? "Featured cars" : "Available Cars"}</h2>
      {loading && <div className="carlist__loading">Loading cars...</div>}
      {!loading && err && <div className="carlist__error">Eroare: {err}</div>}
      {!loading && !cars.length && <div className="carlist__empty">No cars available.</div>}
      {!loading && cars.length > 0 && (
        <div className="car-grid">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CarList;