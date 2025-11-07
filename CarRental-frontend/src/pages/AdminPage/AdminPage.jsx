import React, { useState } from 'react';
import NavBar from '../../components/common/NavBar/NavBar';
import './AdminPage.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('cars');

  return (
    <div className="admin-page">
      <NavBar />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage your car rental business</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            Cars
          </button>
          <button 
            className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'cars' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Cars</h2>
                <button className="btn-add">+ Add New Car</button>
              </div>
              
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Year</th>
                      <th>Price/Day</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Toyota</td>
                      <td>Camry</td>
                      <td>2020</td>
                      <td>$50</td>
                      <td><span className="status-available">Available</span></td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Honda</td>
                      <td>Civic</td>
                      <td>2021</td>
                      <td>$45</td>
                      <td><span className="status-rented">Rented</span></td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Bookings</h2>
              </div>
              
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Car</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>John Doe</td>
                      <td>Toyota Camry</td>
                      <td>2025-11-05</td>
                      <td>2025-11-10</td>
                      <td><span className="status-confirmed">Confirmed</span></td>
                      <td>
                        <button className="btn-view">View</button>
                        <button className="btn-cancel">Cancel</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Users</h2>
                <button className="btn-add">+ Add New User</button>
              </div>
              
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Admin User</td>
                      <td>admin@carrental.com</td>
                      <td><span className="role-admin">Admin</span></td>
                      <td>2025-01-01</td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}