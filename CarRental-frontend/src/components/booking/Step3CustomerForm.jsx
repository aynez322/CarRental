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

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setClientData(prev => ({ ...prev, idPhotos: files }));
  };

  const isFormValid =
    clientData.firstName &&
    clientData.lastName &&
    clientData.email &&
    clientData.cnp &&
    clientData.idPhotos.length > 0 &&
    acceptTerms;

  const totalDays = (dateRange.start && dateRange.end)
    ? daysBetween(dateRange.start, dateRange.end) + 1
    : 0;
  const totalPrice = (totalDays * pricePerDay).toFixed(2);

  return (
    <div className="step step3">
      <h3>Date client & confirmare</h3>
      <div className="summary-inline-box">
        <div><strong>Mașină:</strong> {car.brand} {car.model}</div>
        <div><strong>Interval:</strong> {formatDateRange(dateRange.start, dateRange.end)}</div>
        <div><strong>Total de achitat la locație:</strong> {totalPrice} $</div>
      </div>

      <form className="customer-form" onSubmit={(e) => { e.preventDefault(); if (isFormValid) onSubmit(); }}>
        <div className="form-row">
          <label>Prenume</label>
          <input
            name="firstName"
            value={clientData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Nume</label>
          <input
            name="lastName"
            value={clientData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={clientData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>CNP</label>
          <input
            name="cnp"
            value={clientData.cnp}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Buletin (poze față & verso)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            required
          />
          {clientData.idPhotos.length > 0 && (
            <div className="files-preview">
              {clientData.idPhotos.map((f, i) => (
                <span key={i}>{f.name}</span>
              ))}
            </div>
          )}
        </div>

        <div className="form-row checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>Sunt de acord cu termenii și condițiile platformei.</span>
          </label>
        </div>

        <div className="actions-inline">
          <button type="button" className="btn-secondary" onClick={onBack}>Înapoi</button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormValid || submitting}
          >
            {submitting ? 'Procesez...' : 'Book'}
          </button>
        </div>
      </form>
    </div>
  );
}