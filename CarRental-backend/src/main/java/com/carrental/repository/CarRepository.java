package com.carrental.repository;

import com.carrental.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByStatus(String status);
    List<Car> findByLocation(String location);
    List<Car> findByLocationIgnoreCase(String location);

    /**
     * Available cars within an inclusive interval [pickupDate, returnDate].
     * Overlap blocked if a Booking exists with:
     *   booking.pickupDate <= :returnDate AND booking.returnDate >= :pickupDate
     * and status in ('PENDING','ACTIVE').
     * Location is optional.
     * Exclude non-operational states (maintenance / rented)
     */
    @Query("""
        SELECT c
        FROM Car c
        WHERE (:location IS NULL OR LOWER(c.location) = LOWER(:location))
          AND (c.status IS NULL OR LOWER(c.status) NOT IN ('maintenance','rented'))
          AND NOT EXISTS (
              SELECT b.id
              FROM Booking b
              WHERE b.car = c
                AND LOWER(b.status) IN ('active', 'pending')
                AND b.pickupDate <= :returnDate
                AND b.returnDate >= :pickupDate
          )
        """)
    List<Car> findAvailable(
            @Param("location") String location,
            @Param("pickupDate") LocalDate pickupDate,
            @Param("returnDate") LocalDate returnDate
    );
}