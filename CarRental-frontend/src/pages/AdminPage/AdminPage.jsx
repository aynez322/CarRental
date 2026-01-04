import React, { useState, useEffect } from 'react';
import NavBar from '../../components/common/NavBar/NavBar';
import { FaTimes, FaUpload } from 'react-icons/fa';
import './AdminPage.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carFormData, setCarFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: '',
    fuelType: 'Petrol',
    gearbox: 'Manual',
    passengers: 5,
    location: '',
    description: '',
    status: 'available'
  });
  const [carImages, setCarImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });

  useEffect(() => {
    if (activeTab === 'cars') {
      fetchCars();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/cars', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cars');
      const data = await response.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const approveBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/bookings/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to approve booking');
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete car');
      fetchCars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCarImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setCarImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetCarForm = () => {
    setCarFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      pricePerDay: '',
      fuelType: 'Petrol',
      gearbox: 'Manual',
      passengers: 5,
      location: '',
      description: '',
      status: 'available'
    });
    setCarImages([]);
    setShowCarForm(false);
    setEditingCar(null);
  };

  const openAddCarForm = () => {
    resetCarForm();
    setShowCarForm(true);
  };

  const openEditCarForm = (car) => {
    setCarFormData({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      pricePerDay: car.pricePerDay || '',
      fuelType: car.fuelType || 'Petrol',
      gearbox: car.gearbox || 'Manual',
      passengers: car.passengers || 5,
      location: car.location || '',
      description: car.description || '',
      status: car.status || 'available'
    });
    setEditingCar(car);
    setCarImages([]);
    setShowCarForm(true);
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const isEditing = editingCar !== null;
      const url = isEditing 
        ? `http://localhost:8080/api/admin/cars/${editingCar.id}`
        : 'http://localhost:8080/api/admin/cars';
      const method = isEditing ? 'PUT' : 'POST';

      const carResponse = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(carFormData)
      });

      if (!carResponse.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} car`);
      const savedCar = await carResponse.json();

      // If there are new images, upload them
      if (carImages.length > 0) {
        const formData = new FormData();
        carImages.forEach(image => {
          formData.append('images', image);
        });

        await fetch(`http://localhost:8080/api/admin/cars/${savedCar.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }

      resetCarForm();
      fetchCars();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'customer'
    });
    setShowUserForm(false);
    setEditingUser(null);
  };

  const openAddUserForm = () => {
    resetUserForm();
    setShowUserForm(true);
  };

  const openEditUserForm = (user) => {
    setUserFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      role: user.role || 'customer'
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const isEditing = editingUser !== null;
      const url = isEditing 
        ? `http://localhost:8080/api/admin/users/${editingUser.id}`
        : 'http://localhost:8080/api/admin/users';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = { ...userFormData };
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} user`);

      const successMessage = isEditing ? 'User changes saved successfully!' : 'User created successfully!';
      alert(successMessage);
      
      resetUserForm();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <NavBar />
      
      {/* Add/Edit User Modal */}
      {showUserForm && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-small">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={resetUserForm}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmitUser} className="add-car-form">
              <div className="form-group">
                <label htmlFor="userName">Full Name *</label>
                <input
                  type="text"
                  id="userName"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userEmail">Email *</label>
                <input
                  type="email"
                  id="userEmail"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  required
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userPassword">{editingUser ? 'New Password (leave empty to keep current)' : 'Password *'}</label>
                <input
                  type="password"
                  id="userPassword"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  required={!editingUser}
                  placeholder="Enter password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userPhone">Phone</label>
                <input
                  type="tel"
                  id="userPhone"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                  placeholder="e.g. +40 712 345 678"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userRole">Role *</label>
                <select
                  id="userRole"
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel-form" onClick={resetUserForm} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={submitting}>
                  {submitting ? (editingUser ? 'Saving...' : 'Creating...') : (editingUser ? 'Save Changes' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Car Modal */}
      {showCarForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button className="modal-close" onClick={resetCarForm}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmitCar} className="add-car-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand">Brand *</label>
                  <input
                    type="text"
                    id="brand"
                    value={carFormData.brand}
                    onChange={(e) => setCarFormData({...carFormData, brand: e.target.value})}
                    required
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="model">Model *</label>
                  <input
                    type="text"
                    id="model"
                    value={carFormData.model}
                    onChange={(e) => setCarFormData({...carFormData, model: e.target.value})}
                    required
                    placeholder="e.g. Camry"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year *</label>
                  <input
                    type="number"
                    id="year"
                    value={carFormData.year}
                    onChange={(e) => setCarFormData({...carFormData, year: parseInt(e.target.value)})}
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pricePerDay">Price per Day ($) *</label>
                  <input
                    type="number"
                    id="pricePerDay"
                    value={carFormData.pricePerDay}
                    onChange={(e) => setCarFormData({...carFormData, pricePerDay: parseFloat(e.target.value)})}
                    required
                    min="1"
                    step="0.01"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fuelType">Fuel Type *</label>
                  <select
                    id="fuelType"
                    value={carFormData.fuelType}
                    onChange={(e) => setCarFormData({...carFormData, fuelType: e.target.value})}
                    required
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="gearbox">Gearbox *</label>
                  <select
                    id="gearbox"
                    value={carFormData.gearbox}
                    onChange={(e) => setCarFormData({...carFormData, gearbox: e.target.value})}
                    required
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="passengers">Passengers *</label>
                  <input
                    type="number"
                    id="passengers"
                    value={carFormData.passengers}
                    onChange={(e) => setCarFormData({...carFormData, passengers: parseInt(e.target.value)})}
                    required
                    min="1"
                    max="12"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    value={carFormData.location}
                    onChange={(e) => setCarFormData({...carFormData, location: e.target.value})}
                  >
                    <option value="">Select location</option>
                    <option value="Avram Iancu International Airport">"Avram Iancu" International Airport</option>
                    <option value="Autogara Beta">Autogara Beta</option>
                  </select>
                </div>
              </div>

              {editingCar && (
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={carFormData.status}
                    onChange={(e) => setCarFormData({...carFormData, status: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={carFormData.description}
                  onChange={(e) => setCarFormData({...carFormData, description: e.target.value})}
                  placeholder="Optional description of the car"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Photos</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="carImages"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <label htmlFor="carImages" className="image-upload-label">
                    <FaUpload />
                    <span>{editingCar ? 'Click to add more images' : 'Click to upload images'}</span>
                  </label>
                </div>
                {carImages.length > 0 && (
                  <div className="image-preview-list">
                    {carImages.map((file, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                        <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel-form" onClick={resetCarForm} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={submitting}>
                  {submitting ? (editingCar ? 'Saving...' : 'Adding...') : (editingCar ? 'Save Changes' : 'Add Car')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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
          {error && <div className="error-message">{error}</div>}
          
          {activeTab === 'cars' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Cars</h2>
                <button className="btn-add" onClick={openAddCarForm}>+ Add New Car</button>
              </div>
              
              {loading ? (
                <div className="loading">Loading cars...</div>
              ) : (
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
                      {cars.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="no-data">No cars found</td>
                        </tr>
                      ) : (
                        cars.map(car => (
                          <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.brand}</td>
                            <td>{car.model}</td>
                            <td>{car.year}</td>
                            <td>${car.pricePerDay}</td>
                            <td>
                              <span className={`status-${car.status?.toLowerCase()}`}>
                                {car.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-edit" onClick={() => openEditCarForm(car)}>Edit</button>
                              <button className="btn-delete" onClick={() => deleteCar(car.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Bookings</h2>
              </div>
              
              {loading ? (
                <p>Loading bookings...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Car</th>
                        <th>Pickup</th>
                        <th>Return</th>
                        <th>Location</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center' }}>No bookings found</td>
                        </tr>
                      ) : (
                        bookings.map(booking => (
                          <tr key={booking.id}>
                            <td>#{booking.id}</td>
                            <td>{booking.customerName}</td>
                            <td>{booking.customerEmail}</td>
                            <td>{booking.car?.brand} {booking.car?.model}</td>
                            <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                            <td>{booking.pickupLocation}</td>
                            <td>${booking.totalPrice}</td>
                            <td>
                              <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="booking-actions">
                                {booking.status === 'pending' && (
                                  <button 
                                    className="btn-approve" 
                                    onClick={() => approveBooking(booking.id)}
                                  >
                                    Approve
                                  </button>
                                )}
                                {(booking.status === 'pending' || booking.status === 'active') && (
                                  <button className="btn-cancel" onClick={() => deleteBooking(booking.id)}>Cancel</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Users</h2>
                <button className="btn-add" onClick={openAddUserForm}>+ Add New User</button>
              </div>
              
              {loading ? (
                <div className="loading">Loading users...</div>
              ) : (
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="no-data">No users found</td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || 'N/A'}</td>
                            <td>
                              <span className={`role-${user.role}`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td>
                              <button className="btn-edit" onClick={() => openEditUserForm(user)}>Edit</button>
                              <button className="btn-delete" onClick={() => deleteUser(user.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}