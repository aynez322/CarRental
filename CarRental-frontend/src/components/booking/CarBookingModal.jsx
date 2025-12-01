import React, { useState } from 'react';
import Step1LocationDate from './Step1LocationDate';
import Step2Summary from './Step2Summary';
import Step3CustomerForm from './Step3CustomerForm';
import './bookingStyles.css';
import { createClient, createReservation } from '../../api/booking';
import useBooking from '../../hooks/useBooking';

export default function CarBookingModal({ car, onClose }) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [availability, setAvailability] = useState(null); // true / false / null
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cnp: '',
    idPhotos: []
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pricePerDay = car.pricePerDay || car.price || 0;

  const resetToStep1 = () => {
    setStep(1);
    setAvailability(null);
  };

  const canProceedStep1 = location && dateRange.start && dateRange.end && availability === true;

  const handleCreateBooking = async () => {
    if (!acceptTerms) return;
    setSubmitting(true);
    try {
      // 1. Creează automat clientul (mock)
      // 2. Creează cererea de rezervare (mock)
      await new Promise(res => setTimeout(res, 1200));
      // Aici ai putea primi un ID de rezervare
      alert('Rezervarea a fost creată și este în așteptarea aprobării de către admin.');
      onClose();
    } catch (e) {
      console.error(e);
      alert('A apărut o eroare la trimiterea rezervării.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-modal__backdrop">
      <div className="booking-modal__container">
        <div className="booking-modal__header">
          <h2>Rezervare - {car.brand} {car.model}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="booking-modal__steps-indicator">
          <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>1</div>
          <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>2</div>
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>3</div>
        </div>

        <div className="booking-modal__body">
          {step === 1 && (
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
          {step === 2 && (
            <Step2Summary
              car={car}
              location={location}
              dateRange={dateRange}
              pricePerDay={pricePerDay}
              onBack={resetToStep1}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
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
              Continuă
            </button>
          )}
        </div>
      </div>
    </div>
  );
}