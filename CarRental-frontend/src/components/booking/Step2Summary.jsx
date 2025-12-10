import React from 'react';
import { formatDateRange, daysBetween } from '../../utils/date';

export default function Step2Summary({
  car,
  location,
  dateRange,
  pricePerDay,
  onBack,
  onNext
}) {
  const totalDays = (dateRange.start && dateRange.end)
    ? daysBetween(dateRange.start, dateRange.end) + 1
    : 0;
  const totalPrice = (totalDays * pricePerDay).toFixed(2);

  const rules = [
    'Valid ID is required at pick-up.',
    'Fuel must be returned at the same level.',
    'Smoking in the vehicle is prohibited.',
    'Late returns may incur additional charges.'
  ];

  const locationLabelMap = {
    'aeroport': 'Avram Iancu International Airport Cluj',
    'autogara': 'Beta Bus Station Cluj'
  };

  return (
    <div className="step step2">
      <h3>Booking Summary</h3>
      <div className="summary-block">
        <div><strong>Vehicle:</strong> {car.brand} {car.model}</div>
        <div><strong>Pick-up Location:</strong> {locationLabelMap[location]}</div>
        <div><strong>Rental Period:</strong> {formatDateRange(dateRange.start, dateRange.end)}</div>
        <div><strong>Days:</strong> {totalDays}</div>
        <div><strong>Price / day:</strong> ${pricePerDay.toFixed(2)}</div>
        <div><strong>Total Estimate:</strong> ${totalPrice}</div>
      </div>

      <div className="rules-block">
        <h4>Rental Terms</h4>
        <ul>
          {rules.map(r => <li key={r}>{r}</li>)}
        </ul>
      </div>

      <div className="actions-inline">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}