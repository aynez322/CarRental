import React, { useState } from 'react';
import NavBar from '../../components/common/NavBar/NavBar';
import './MyBookings.css';

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('active');

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
          {activeTab === 'active' && (
            <div className="mybookings-section">
              <div className="section-header">
                <h2>Active Bookings</h2>
              </div>
              
              <div className="empty-state">
                <div className="empty-state__icon">📅</div>
                <h3>No Active Bookings</h3>
                <p>You don't have any active bookings at the moment.</p>
                <button className="btn-primary">Browse Cars</button>
              </div>
            </div>
          )}

          {activeTab === 'past' && (
            <div className="mybookings-section">
              <div className="section-header">
                <h2>Past Bookings</h2>
              </div>
              
              <div className="empty-state">
                <div className="empty-state__icon">🕒</div>
                <h3>No Past Bookings</h3>
                <p>Your booking history will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'cancelled' && (
            <div className="mybookings-section">
              <div className="section-header">
                <h2>Cancelled Bookings</h2>
              </div>
              
              <div className="empty-state">
                <div className="empty-state__icon">❌</div>
                <h3>No Cancelled Bookings</h3>
                <p>You haven't cancelled any bookings.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}