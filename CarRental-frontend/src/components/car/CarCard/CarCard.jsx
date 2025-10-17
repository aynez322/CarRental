import { MdDateRange } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
import './CarCard.css'
export function CarCard ( {image, brand, model, price, year, fuel, gearbox, passengers} ){
    return (
    <div className="car-card">
      <img src={image} alt={`${brand} ${model}`} />
      <div className="car-card-content">
        <h3>{brand} {model}</h3>
        <div className="car-details-list">
          <p>
            <MdDateRange className="icon" />
            <span>{year}</span>
          </p>
          <p>
            <BsFuelPumpFill className="icon" />
            <span>{fuel}</span>
          </p>
          <p>
            <TbManualGearbox className="icon" />
            <span>{gearbox}</span>
          </p>
          <p>
            <IoMdPeople className="icon" />
            <span>{passengers} Passengers</span>
          </p>
        </div>
        
        <p className="price">${price}/day</p>
        <button>Book Now</button>
      </div>
    </div>
  );
}
