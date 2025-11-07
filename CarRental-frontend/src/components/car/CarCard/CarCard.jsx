import React from 'react';
import { MdDateRange } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
import './CarCard.css';

export default function CarCard({ car }) {
  const {
    image = '/images/cars/placeholder.jpg',
    brand = 'Unknown',
    model = '',
    price = 0,
    year = '',
    fuel = '',
    gearbox = '',
    passengers = ''
  } = car || {};

  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : price;

  return (
    <div className="carcard">
      <div className="carcard__image">
        <img
          src={image}
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
          <div className="carcard__price">{formattedPrice} lei/day</div>
          <div>
            <button className="btn-primary">Book</button>
          </div>
        </div>
      </div>
    </div>
  );
}