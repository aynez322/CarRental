import React from 'react';
import { formatDateRange, daysBetween } from '../../utils/date';

export default function Step3CustomerForm({
  clientData,
  setClientData,
  acceptTerms,
  setAcceptTerms,
  onBack,
  onSubmit,
  submitting,
  location,
  dateRange,
  car,
  pricePerDay
}) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    clientData.firstName &&
    clientData.lastName &&
    clientData.email &&
    clientData.phone &&
    acceptTerms;

  const totalDays = (dateRange.start && dateRange.end)
    ? daysBetween(dateRange.start, dateRange.end) + 1
    : 0;
  const totalPrice = (totalDays * pricePerDay).toFixed(2);

  return (
    <div className="step step3">
      <h3>Complete Your Booking</h3>
      <div className="summary-inline-box">
        <div><strong>Vehicle:</strong> {car.brand} {car.model}</div>
        <div><strong>Rental Period:</strong> {formatDateRange(dateRange.start, dateRange.end)}</div>
        <div><strong>Total Amount:</strong> ${totalPrice}</div>
      </div>

      <form className="customer-form" onSubmit={(e) => { e.preventDefault(); if (isFormValid) onSubmit(); }}>
        <div className="form-row">
          <label>First Name</label>
          <input
            name="firstName"
            value={clientData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="form-row">
          <label>Last Name</label>
          <input
            name="lastName"
            value={clientData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>
        <div className="form-row">
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={clientData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div className="form-row">
          <label>Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={clientData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        <div className="form-row checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>I agree to the rental terms and conditions.</span>
          </label>
        </div>

        <div className="actions-inline">
          <button type="button" className="btn-secondary" onClick={onBack}>Back</button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormValid || submitting}
          >
            {submitting ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}