import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar/NavBar';
import { getMyBookings, cancelBooking } from '../../api/booking';
import './MyBookings.css';

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('active');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await cancelBooking(id);
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (err) {
      alert('Failed to cancel booking: ' + err.message);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    switch (activeTab) {
      case 'active':
        return bookings.filter(b => b.status === 'active' || b.status === 'pending');
      case 'past':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="mybookings-page">
      <NavBar />
      
      <div className="mybookings-container">
        <div className="mybookings-header">
          <h1>My Bookings</h1>
          <p>View and manage your car rental bookings</p>
        </div>

        <div className="mybookings-tabs">
          <button 
            className={`mybookings-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Bookings
          </button>
          <button 
            className={`mybookings-tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Bookings
          </button>
          <button 
            className={`mybookings-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>

        <div className="mybookings-content">
          {loading ? (
            <p>Loading bookings...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <>
              {activeTab === 'active' && (
                <div className="mybookings-section">
                  <div className="section-header">
                    <h2>Active Bookings</h2>
                  </div>
                  
                  {filteredBookings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state__icon">📅</div>
                      <h3>No Active Bookings</h3>
                      <p>You don't have any active bookings at the moment.</p>
                      <button className="btn-primary" onClick={() => navigate('/available-cars')}>Browse Cars</button>
                    </div>
                  ) : (
                    <div className="bookings-list">
                      {filteredBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                          <div className="booking-card__header">
                            <h3>{booking.car?.brand} {booking.car?.model}</h3>
                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                              {booking.status === 'pending' ? 'Pending Approval' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="booking-card__body">
                            <div className="booking-detail">
                              <strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()}
                            </div>
                            <div className="booking-detail">
                              <strong>Return:</strong> {new Date(booking.returnDate).toLocaleDateString()}
                            </div>
                            <div className="booking-detail">
                              <strong>Location:</strong> {booking.pickupLocation}
                            </div>
                            <div className="booking-detail">
                              <strong>Total:</strong> ${booking.totalPrice}
                            </div>
                          </div>
                          <div className="booking-card__footer">
                            {(booking.status === 'pending' || booking.status === 'active') && (
                              <button className="btn-cancel" onClick={() => handleCancelBooking(booking.id)}>
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'past' && (
                <div className="mybookings-section">
                  <div className="section-header">
                    <h2>Past Bookings</h2>
                  </div>
                  
                  {filteredBookings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state__icon">🕒</div>
                      <h3>No Past Bookings</h3>
                      <p>Your booking history will appear here.</p>
                    </div>
                  ) : (
                    <div className="bookings-list">
                      {filteredBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                          <div className="booking-card__header">
                            <h3>{booking.car?.brand} {booking.car?.model}</h3>
                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="booking-card__body">
                            <div className="booking-detail">
                              <strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()}
                            </div>
                            <div className="booking-detail">
                              <strong>Return:</strong> {new Date(booking.returnDate).toLocaleDateString()}
                            </div>
                            <div className="booking-detail">
                              <strong>Location:</strong> {booking.pickupLocation}
                            </div>
                            <div className="booking-detail">
                              <strong>Total:</strong> ${booking.totalPrice}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cancelled' && (
                <div className="mybookings-section">
                  <div className="section-header">
                    <h2>Cancelled Bookings</h2>
                  </div>
                  
                  {filteredBookings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state__icon">❌</div>
                      <h3>No Cancelled Bookings</h3>
                      <p>You haven't cancelled any bookings.</p>
                    </div>
                  ) : (
                    <div className="bookings-list">
                      {filteredBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                          <div className="booking-card__header">
                            <h3>{booking.car?.brand} {booking.car?.model}</h3>
                            <span className={`status-badge status-cancelled`}>
                              CANCELLED
                            </span>
                          </div>
                          <div className="booking-card__body">
                            <div className="booking-detail">
                              <strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()}
                            </div>
                            <div className="booking-detail">
                              <strong>Return:</strong> {new Date(booking.returnDate).toLocaleDateString()}
                            </div>
                            <div className="booking-detail">
                              <strong>Location:</strong> {booking.pickupLocation}
                            </div>
                            <div className="booking-detail">
                              <strong>Total:</strong> ${booking.totalPrice}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}