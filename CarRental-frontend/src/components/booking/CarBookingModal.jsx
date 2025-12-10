import React, { useState } from 'react';
import Step1LocationDate from './Step1LocationDate';
import Step2Summary from './Step2Summary';
import Step3CustomerForm from './Step3CustomerForm';
import './bookingStyles.css';
import { createBooking } from '../../api/booking';

export default function CarBookingModal({ car, onClose }) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [availability, setAvailability] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const pricePerDay = car.pricePerDay || car.price || 0;

  const resetToStep1 = () => {
    setStep(1);
    setAvailability(null);
  };

  const canProceedStep1 = location && dateRange.start && dateRange.end && availability === true;

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCreateBooking = async () => {
    if (!acceptTerms) return;
    setSubmitting(true);
    try {
      const bookingData = {
        carId: car.id,
        pickupLocation: location,
        pickupDate: formatDate(dateRange.start),
        returnDate: formatDate(dateRange.end),
        customerName: `${clientData.firstName} ${clientData.lastName}`,
        customerEmail: clientData.email,
        customerPhone: clientData.phone
      };

      await createBooking(bookingData);
      setBookingSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (e) {
      console.error(e);
      alert('Failed to create booking: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-modal__backdrop">
      <div className="booking-modal__container">
        <div className="booking-modal__header">
          <h2>Book - {car.brand} {car.model}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="booking-modal__steps-indicator">
          <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>1</div>
          <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>2</div>
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>3</div>
        </div>

        <div className="booking-modal__body">
          {bookingSuccess && (
            <div className="booking-success-message">
              <div className="success-icon">✓</div>
              <h3>Booking Created Successfully!</h3>
              <p>Your booking is pending admin approval.</p>
              <p className="auto-close-text">This window will close automatically...</p>
            </div>
          )}
          {!bookingSuccess && step === 1 && (
            <Step1LocationDate
              car={car}
              location={location}
              setLocation={setLocation}
              dateRange={dateRange}
              setDateRange={setDateRange}
              availability={availability}
              setAvailability={setAvailability}
              loadingCheck={loadingCheck}
              setLoadingCheck={setLoadingCheck}
              pricePerDay={pricePerDay}
            />
          )}
          {!bookingSuccess && step === 2 && (
            <Step2Summary
              car={car}
              location={location}
              dateRange={dateRange}
              pricePerDay={pricePerDay}
              onBack={resetToStep1}
              onNext={() => setStep(3)}
            />
          )}
          {!bookingSuccess && step === 3 && (
            <Step3CustomerForm
              clientData={clientData}
              setClientData={setClientData}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              onBack={() => setStep(2)}
              onSubmit={handleCreateBooking}
              submitting={submitting}
              location={location}
              dateRange={dateRange}
              car={car}
              pricePerDay={pricePerDay}
            />
          )}
        </div>

        <div className="booking-modal__footer">
          {step === 1 && (
            <button
              className="btn-primary"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}