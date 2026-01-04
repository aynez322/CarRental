import React, { useState } from 'react';
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
  const [validationMessage, setValidationMessage] = useState('');

  const getValidationMessage = () => {
    const missing = [];
    if (!dateRange.start) missing.push('start date');
    if (!dateRange.end) missing.push('end date');
    
    if (missing.length === 0) return '';
    if (missing.length === 1) return `Please select the ${missing[0]} to continue.`;
    return `Please select the ${missing[0]} and ${missing[1]} to continue.`;
  };

  const handleCheckAvailability = async () => {
    if (!location || !dateRange.start || !dateRange.end) {
      setValidationMessage(getValidationMessage());
      return;
    }
    setValidationMessage('');
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

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setValidationMessage('');
  };

  return (
    <div className="step step1">
      <h3>Select Dates</h3>
      
      <div className="location-display">
        <label>Pickup Location:</label>
        <span className="location-value">{location || car.location || 'Not specified'}</span>
      </div>

      <BookingCalendar
        dateRange={dateRange}
        setDateRange={handleDateRangeChange}
      />

      {validationMessage && (
        <div className="validation-message warning">
          {validationMessage}
        </div>
      )}

      <div className="availability-actions">
        <button
          className="btn-secondary"
          disabled={loadingCheck}
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