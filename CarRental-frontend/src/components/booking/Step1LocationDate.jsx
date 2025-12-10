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

    try {
      // Format dates as yyyy-MM-dd
      const startDate = dateRange.start.toISOString().split('T')[0];
      const endDate = dateRange.end.toISOString().split('T')[0];
      
      const url = `http://localhost:8080/api/bookings/check-availability?carId=${car.id}&startDate=${startDate}&endDate=${endDate}`;
      console.log('Checking availability:', url);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to check availability');
      }
      
      const data = await response.json();
      console.log('Availability data:', data);
      setAvailability(data.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability(null);
      alert('Failed to check availability. Please try again.');
    } finally {
      setLoadingCheck(false);
    }
  };

  const totalDays = (dateRange.start && dateRange.end)
    ? daysBetween(dateRange.start, dateRange.end) + 1
    : 0;

  return (
    <div className="step step1">
      <h3>Select Location and Dates</h3>
      <LocationSelector
        selectedLocation={location}
        onSelect={setLocation}
        locations={[
          { id: 'aeroport', label: 'Avram Iancu International Airport Cluj' },
          { id: 'autogara', label: 'Beta Bus Station Cluj' }
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
          {loadingCheck ? 'Checking...' : 'Check Availability'}
        </button>
      </div>

      {availability === false && (
        <div className="availability-message error">
          Vehicle is not available for the selected dates.
        </div>
      )}
      {availability === true && (
        <div className="availability-message success">
          Vehicle is available! You can proceed.
        </div>
      )}

      <div className="price-preview">
        {totalDays > 0 && (
          <>
            <div>Period: {formatDateRange(dateRange.start, dateRange.end)}</div>
            <div>Total days: {totalDays}</div>
            <div>Estimated cost: ${(totalDays * pricePerDay).toFixed(2)}</div>
          </>
        )}
      </div>
    </div>
  );
}