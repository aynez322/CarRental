import React from 'react';

export default function LocationSelector({ locations, selectedLocation, onSelect }) {
  return (
    <div className="location-selector">
      <h4>Pickup Location:</h4>
      <div className="location-options">
        {locations.map(loc => (
          <label
            key={loc.id}
            className={`location-option ${selectedLocation === loc.id ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="pickup_location"
              value={loc.id}
              checked={selectedLocation === loc.id}
              onChange={() => onSelect(loc.id)}
            />
            <span>{loc.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}