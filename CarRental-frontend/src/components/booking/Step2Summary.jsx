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
    'Este necesar buletin valabil la preluare.',
    'Combustibilul se returnează la același nivel.',
    'Fumatul în mașină este interzis.',
    'Întârzierea la predare poate genera costuri suplimentare.'
  ];

  const locationLabelMap = {
    'aeroport': 'Aeroportul Internațional Avram Iancu Cluj',
    'autogara': 'Autogara Beta Cluj'
  };

  return (
    <div className="step step2">
      <h3>Rezumat rezervare</h3>
      <div className="summary-block">
        <div><strong>Mașină:</strong> {car.brand} {car.model}</div>
        <div><strong>Locație pick-up:</strong> {locationLabelMap[location]}</div>
        <div><strong>Interval:</strong> {formatDateRange(dateRange.start, dateRange.end)}</div>
        <div><strong>Zile:</strong> {totalDays}</div>
        <div><strong>Preț / zi:</strong> {pricePerDay.toFixed(2)} $</div>
        <div><strong>Total estimat:</strong> {totalPrice} $</div>
      </div>

      <div className="rules-block">
        <h4>Reguli de închiriere</h4>
        <ul>
          {rules.map(r => <li key={r}>{r}</li>)}
        </ul>
      </div>

      <div className="actions-inline">
        <button className="btn-secondary" onClick={onBack}>Înapoi</button>
        <button className="btn-primary" onClick={onNext}>Continuă</button>
      </div>
    </div>
  );
}