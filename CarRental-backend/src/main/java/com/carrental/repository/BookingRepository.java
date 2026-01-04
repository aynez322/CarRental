package com.carrental.repository;

import com.carrental.model.Booking;
import com.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserOrderByPickupDateDesc(User user);
    
    List<Booking> findByCarId(Long carId);
    
    void deleteByCarId(Long carId);
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.car.id = :carId " +
           "AND b.status IN ('pending', 'active') " +
           "AND ((b.pickupDate <= :endDate AND b.returnDate >= :startDate))")
    boolean existsActiveBookingForCarInDateRange(
        @Param("carId") Long carId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}