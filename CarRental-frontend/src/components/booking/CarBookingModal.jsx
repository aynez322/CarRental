import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
import Step1LocationDate from './Step1LocationDate';
import Step2Summary from './Step2Summary';
import Step3CustomerForm from './Step3CustomerForm';
import './bookingStyles.css';
import { createBooking, uploadBookingLicense } from '../../api/booking';

export default function CarBookingModal({ car, onClose }) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(car.location || null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [availability, setAvailability] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idnp: '',
    licenseFrontFile: null,
    licenseBackFile: null
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const pricePerDay = car.pricePerDay || car.price || 0;

  const getFullImageUrl = (url) => {
    if (!url) return '/images/cars/placeholder.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:8080${url}`;
    return url;
  };

  const images = car.images || [];
  const imageUrls = images.length > 0 
    ? images.map(img => getFullImageUrl(img.imageUrl))
    : car.image ? [getFullImageUrl(car.image)] : ['/images/cars/placeholder.jpg'];

  const hasMultipleImages = imageUrls.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? imageUrls.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === imageUrls.length - 1 ? 0 : prev + 1);
  };

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
      if (!clientData.idnp || !clientData.licenseFrontFile || !clientData.licenseBackFile) {
        alert('Please provide IDNP and both driver license photos (front and back).');
        return;
      }

      const frontUpload = await uploadBookingLicense(clientData.licenseFrontFile);
      const backUpload = await uploadBookingLicense(clientData.licenseBackFile);

      const bookingData = {
        carId: car.id,
        pickupLocation: location,
        pickupDate: formatDate(dateRange.start),
        returnDate: formatDate(dateRange.end),
        customerName: `${clientData.firstName} ${clientData.lastName}`,
        customerEmail: clientData.email,
        customerPhone: clientData.phone,
        idnp: clientData.idnp,
        driverLicenseFrontUrl: frontUpload.url,
        driverLicenseBackUrl: backUpload.url
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="booking-modal__backdrop" onClick={handleBackdropClick}>
      <div className="booking-modal__container">
        <div className="booking-modal__header">
          <div className="header-title">
            <span className="header-label">Car reservation</span>
            <h2>{car.brand} {car.model}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="booking-modal__main">
          <div className="booking-modal__gallery-section">
            <div className="main-image-container">
              {hasMultipleImages && (
                <button className="gallery-nav-btn gallery-nav-btn--prev" onClick={handlePrevImage}>
                  <FaChevronLeft />
                </button>
              )}
              <img
                src={imageUrls[currentImageIndex]}
                alt={`${car.brand} ${car.model}`}
                className="main-image"
                onError={(e) => { e.currentTarget.src = '/images/cars/placeholder.jpg'; }}
              />
              {hasMultipleImages && (
                <button className="gallery-nav-btn gallery-nav-btn--next" onClick={handleNextImage}>
                  <FaChevronRight />
                </button>
              )}
            </div>
            
            {hasMultipleImages && (
              <div className="thumbnail-strip">
                {imageUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={url} alt={`${car.brand} ${car.model} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {hasMultipleImages && (
              <div className="gallery-dots">
                {imageUrls.map((_, index) => (
                  <span 
                    key={index} 
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}

            <div className="car-specs-bar">
              <div className="car-spec">
                <MdDateRange className="spec-icon" />
                <span>{car.year}</span>
              </div>
              <div className="car-spec">
                <BsFuelPumpFill className="spec-icon" />
                <span>{car.fuelType}</span>
              </div>
              <div className="car-spec">
                <TbManualGearbox className="spec-icon" />
                <span>{car.gearbox}</span>
              </div>
              <div className="car-spec">
                <IoMdPeople className="spec-icon" />
                <span>{car.passengers} pers.</span>
              </div>
              <div className="car-price-tag">
                <span className="price-value">${pricePerDay}</span>
                <span className="price-period">/day</span>
              </div>
            </div>
          </div>

          <div className="booking-modal__form-section">
            <div className="booking-modal__steps-indicator">
              <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>1</div>
              <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>2</div>
              <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>3</div>
            </div>

            <div className="booking-form-content">
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

              {step === 1 && (
                <div className="form-footer">
                  <button
                    className="btn-primary"
                    disabled={!canProceedStep1}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}