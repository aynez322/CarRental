const API_URL = 'http://localhost:8080';

export async function createBooking(bookingData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(bookingData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create booking');
  }

  return await response.json();
}

export async function getMyBookings() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/bookings/my`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return await response.json();
}

export async function cancelBooking(bookingId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to cancel booking');
  }

  return await response.json();
}