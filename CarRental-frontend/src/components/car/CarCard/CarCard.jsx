import React, { useState } from 'react';
import { MdDateRange } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
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

  const imageUrl = images && images.length > 0 
    ? images.find(img => img.isPrimary)?.imageUrl || images[0]?.imageUrl
    : image || '/images/cars/placeholder.jpg';

  const carPrice = pricePerDay || price || 0;
  const formattedPrice = typeof carPrice === 'number' ? carPrice.toFixed(2) : carPrice;

  return (
    <>
      <div className="carcard">
        <div className="carcard__image">
          <img
            src={imageUrl}
            alt={`${brand} ${model}`}
            onError={(e) => { e.currentTarget.src = '/images/cars/placeholder.jpg'; }}
          />
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