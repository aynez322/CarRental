import React from 'react';
import LocationSelector from './LocationSelector';
import BookingCalendar from './BookingCalendar';
import { formatDateRange, daysBetween } from '../../utils/date';

export default function Step1LocationDate({
  car,
  location,
  setLocation,
  dateRange,
  setDateRange,
  availability,
  setAvailability,
  loadingCheck,
  setLoadingCheck,
  pricePerDay
}) {

  const handleCheckAvailability = async () => {
    if (!location || !dateRange.start || !dateRange.end) return;
    setLoadingCheck(true);
    setAvailability(null);

    // Simulare apel API de verificare disponibilitate
    await new Promise(res => setTimeout(res, 900));

    // Exemplu logică: indisponibil dacă începutul este astăzi + 1 zi și brandul conține 'X'
    const today = new Date();
    const diffStart = daysBetween(today, dateRange.start);
    const isAvailable = !(diffStart === 1 && car.brand.toLowerCase().includes('x'));
    setAvailability(isAvailable);
    setLoadingCheck(false);
  };

  const totalDays = (dateRange.start && dateRange.end)
    ? daysBetween(dateRange.start, dateRange.end) + 1
    : 0;

  return (
    <div className="step step1">
      <h3>Selectează locația și intervalul</h3>
      <LocationSelector
        selectedLocation={location}
        onSelect={setLocation}
        locations={[
          { id: 'aeroport', label: 'Aeroportul Internațional Avram Iancu Cluj' },
          { id: 'autogara', label: 'Autogara Beta Cluj' }
        ]}
      />
      <BookingCalendar
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <div className="availability-actions">
        <button
          className="btn-secondary"
          disabled={!location || !dateRange.start || !dateRange.end || loadingCheck}
          onClick={handleCheckAvailability}
        >
          {loadingCheck ? 'Verific...' : 'Verifică disponibilitatea'}
        </button>
      </div>

      {availability === false && (
        <div className="availability-message error">
          Mașina nu este disponibilă pentru intervalul selectat.
        </div>
      )}
      {availability === true && (
        <div className="availability-message success">
          Mașina este disponibilă! Poți continua.
        </div>
      )}

      <div className="price-preview">
        {totalDays > 0 && (
          <>
            <div>Interval: {formatDateRange(dateRange.start, dateRange.end)}</div>
            <div>Zile totale: {totalDays}</div>
            <div>Cost estimativ: {(totalDays * pricePerDay).toFixed(2)} $</div>
          </>
        )}
      </div>
    </div>
  );
}