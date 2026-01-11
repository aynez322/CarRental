import React, { useEffect, useRef, useState } from 'react';
import { formatDateRange, daysBetween } from '../../utils/date';
import exampleFront from '../../assets/fata.png';
import exampleBack from '../../assets/spate.png';

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

  const [showValidation, setShowValidation] = useState(false);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handlePickFile = (which) => {
    if (which === 'front') frontInputRef.current?.click();
    if (which === 'back') backInputRef.current?.click();
  };

  const handleFileChange = (which, file) => {
    if (!file) return;
    setClientData(prev => ({
      ...prev,
      ...(which === 'front' ? { licenseFrontFile: file } : { licenseBackFile: file })
    }));
  };

  useEffect(() => {
    if (!clientData.licenseFrontFile) {
      setFrontPreview(null);
      return;
    }

    const url = URL.createObjectURL(clientData.licenseFrontFile);
    setFrontPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [clientData.licenseFrontFile]);

  useEffect(() => {
    if (!clientData.licenseBackFile) {
      setBackPreview(null);
      return;
    }

    const url = URL.createObjectURL(clientData.licenseBackFile);
    setBackPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [clientData.licenseBackFile]);

  const isCnpValid = clientData.idnp && clientData.idnp.length === 13;

  const isFormValid =
    clientData.firstName &&
    clientData.lastName &&
    clientData.email &&
    clientData.phone &&
    isCnpValid &&
    clientData.licenseFrontFile &&
    clientData.licenseBackFile &&
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

      <form
        className="customer-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isFormValid) {
            setShowValidation(true);
            return;
          }
          onSubmit();
        }}
      >
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

        <div className="form-row">
          <label className={showValidation && !isCnpValid ? 'form-label--error' : ''}>CNP</label>
          <input
            name="idnp"
            type="text"
            value={clientData.idnp || ''}
            onChange={handleChange}
            placeholder="Introduceți CNP-ul (13 cifre)"
            inputMode="numeric"
            maxLength={13}
            autoComplete="off"
            required
          />
          {showValidation && clientData.idnp && clientData.idnp.length !== 13 && (
            <span className="form-field-error">CNP trebuie să aibă exact 13 cifre</span>
          )}
        </div>

        <div className="form-row">
          <label className={showValidation && (!clientData.licenseFrontFile || !clientData.licenseBackFile) ? 'form-label--error' : ''}>
            ID photos (both sides)
          </label>

          <div className="license-upload-grid">
            <div className="license-upload-item">
              <input
                ref={frontInputRef}
                className="license-upload-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('front', e.target.files?.[0])}
              />
              <button
                type="button"
                className={`license-upload-box ${frontPreview ? 'license-upload-box--filled' : ''} ${showValidation && !clientData.licenseFrontFile ? 'license-upload-box--error' : ''}`}
                onClick={() => handlePickFile('front')}
              >
                {frontPreview ? (
                  <img src={frontPreview} alt="Driver license front" className="license-upload-preview" />
                ) : (
                  <>
                    <img src={exampleFront} alt="" className="license-upload-bg" />
                    <span className="license-upload-plus">+</span>
                  </>
                )}
              </button>
              <div className="license-upload-caption">Example (front)</div>
            </div>

            <div className="license-upload-item">
              <input
                ref={backInputRef}
                className="license-upload-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('back', e.target.files?.[0])}
              />
              <button
                type="button"
                className={`license-upload-box ${backPreview ? 'license-upload-box--filled' : ''} ${showValidation && !clientData.licenseBackFile ? 'license-upload-box--error' : ''}`}
                onClick={() => handlePickFile('back')}
              >
                {backPreview ? (
                  <img src={backPreview} alt="Driver license back" className="license-upload-preview" />
                ) : (
                  <>
                    <img src={exampleBack} alt="" className="license-upload-bg" />
                    <span className="license-upload-plus">+</span>
                  </>
                )}
              </button>
              <div className="license-upload-caption">Example (back)</div>
            </div>
          </div>
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