import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdminPage from './pages/AdminPage/AdminPage';
import './App.css';
import MyBookings from './pages/MyBookings/MyBookings';
import { AvailableCars } from './pages/AvailableCars/AvailableCars';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/bookings" element={<MyBookings/>} />
      <Route path="/cars" element={<AvailableCars/>}/>
    </Routes>
  );
}

export default App;