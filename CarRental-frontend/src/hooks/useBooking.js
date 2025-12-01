import { useState } from 'react';

/**
 * Hook generic (extensibil) pentru logica suplimentară:
 * - verificare disponibilitate via API real
 * - calcul cost dinamic (weekend, reducere, etc.)
 */
export default function useBooking(car) {
  const basePrice = car.pricePerDay || car.price || 0;
  const [dynamicPricePerDay] = useState(basePrice);

  const checkAvailabilityApi = async ({ carId, location, start, end }) => {
    // Exemplu: înlocuiește cu fetch real.
    await new Promise(r => setTimeout(r, 500));
    return { available: true };
  };

  return {
    dynamicPricePerDay,
    checkAvailabilityApi
  };
}