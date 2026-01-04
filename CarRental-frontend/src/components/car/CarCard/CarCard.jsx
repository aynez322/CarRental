import React, { useState } from 'react';
import { MdDateRange } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CarBookingModal from '../../booking/CarBookingModal';
import './CarCard.css';

export default function CarCard({ car }) {
  const {
    images = [],
    image,
    brand = 'Unknown',
    model = '',
    pricePerDay = 0,
    price,
    year = '',
    fuelType,
    fuel = fuelType,
    gearbox = '',
    passengers = ''
  } = car || {};

  const [showBooking, setShowBooking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Build array of image URLs - add backend URL for uploaded images
  const getFullImageUrl = (url) => {
    if (!url) return '/images/cars/placeholder.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:8080${url}`;
    return url;
  };

  const imageUrls = images && images.length > 0 
    ? images.map(img => getFullImageUrl(img.imageUrl))
    : image ? [getFullImageUrl(image)] : ['/images/cars/placeholder.jpg'];

  const hasMultipleImages = imageUrls.length > 1;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? imageUrls.length - 1 : prev - 1);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === imageUrls.length - 1 ? 0 : prev + 1);
  };

  const carPrice = pricePerDay || price || 0;
  const formattedPrice = typeof carPrice === 'number' ? carPrice.toFixed(2) : carPrice;

  return (
    <>
      <div className="carcard">
        <div className="carcard__image">
          {hasMultipleImages && (
            <button className="image-nav-btn image-nav-btn--prev" onClick={handlePrevImage}>
              <FaChevronLeft />
            </button>
          )}
          <img
            src={imageUrls[currentImageIndex]}
            alt={`${brand} ${model}`}
            onError={(e) => { e.currentTarget.src = '/images/cars/placeholder.jpg'; }}
          />
          {hasMultipleImages && (
            <button className="image-nav-btn image-nav-btn--next" onClick={handleNextImage}>
              <FaChevronRight />
            </button>
          )}
          {hasMultipleImages && (
            <div className="image-indicators">
              {imageUrls.map((_, index) => (
                <span 
                  key={index} 
                  className={`image-indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="carcard__body">
          <div className="carcard__title">{brand} {model}</div>
          <div className="carcard__meta">{year}</div>

            <div className="car-details-list">
              <div className="car-detail">
                <MdDateRange className="icon" />
                <span>{year}</span>
              </div>
              <div className="car-detail">
                <BsFuelPumpFill className="icon" />
                <span>{fuel}</span>
              </div>
              <div className="car-detail">
                <TbManualGearbox className="icon" />
                <span>{gearbox}</span>
              </div>
              <div className="car-detail">
                <IoMdPeople className="icon" />
                <span>{passengers} passengers</span>
              </div>
            </div>

            <div className="carcard__footer">
              <div className="carcard__price">{formattedPrice} $/day</div>
              <div>
                <button className="btn-primary" onClick={() => setShowBooking(true)}>Book</button>
              </div>
            </div>
        </div>
      </div>

      {showBooking && (
        <CarBookingModal
          car={car}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}