export async function createClient(data) {
  await new Promise(r => setTimeout(r, 500));
  return { clientId: 'cl_' + Date.now() };
}

export async function createReservation({ clientId, carId, location, start, end, total }) {
  await new Promise(r => setTimeout(r, 600));
  return { reservationId: 'res_' + Date.now(), status: 'pending' };
}