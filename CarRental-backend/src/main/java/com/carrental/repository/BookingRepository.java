package com.carrental.repository;

import com.carrental.model.Booking;
import com.carrental.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    @Query("SELECT b FROM Booking b WHERE LOWER(b.status) = 'pending' AND b.createdAt < :cutoffTime")
    List<Booking> findStalePendingBookings(@Param("cutoffTime") LocalDateTime cutoffTime);
    List<Booking> findByUserOrderByPickupDateDesc(User user);
    
    List<Booking> findByUserIdOrderByPickupDateDesc(Long userId);
    
    List<Booking> findByCarId(Long carId);
    
    void deleteByCarId(Long carId);
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.car.id = :carId " +
           "AND LOWER(b.status) IN ('pending', 'active') " +
           "AND ((b.pickupDate <= :endDate AND b.returnDate >= :startDate))")
    boolean existsActiveBookingForCarInDateRange(
        @Param("carId") Long carId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT b.car.id FROM Booking b WHERE LOWER(b.status) = 'pending'")
    List<Long> findCarIdsWithPendingBookings();
    
    // Paginated queries with eager fetching to avoid N+1
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.car")
    List<Booking> findAllWithUserAndCar();
    
    @Query(value = "SELECT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.car",
           countQuery = "SELECT COUNT(b) FROM Booking b")
    Page<Booking> findAllWithUserAndCar(Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE LOWER(b.status) = 'active' AND b.returnDate < :today")
    List<Booking> findExpiredActiveBookings(@Param("today") LocalDate today);
    
    @Query("SELECT b FROM Booking b WHERE LOWER(b.status) = 'pending' AND b.pickupDate < :today")
    List<Booking> findPendingBookingsWithPastPickupDate(@Param("today") LocalDate today);
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.user.id = :userId AND b.car.id = :carId " +
           "AND LOWER(b.status) IN ('pending', 'active') " +
           "AND ((b.pickupDate <= :endDate AND b.returnDate >= :startDate))")
    boolean existsUserBookingForCarInDateRange(
        @Param("userId") Long userId,
        @Param("carId") Long carId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}