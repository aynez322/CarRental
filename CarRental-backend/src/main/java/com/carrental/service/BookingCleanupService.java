package com.carrental.service;

import com.carrental.model.Booking;
import com.carrental.model.Car;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(BookingCleanupService.class);
    private static final int PENDING_TIMEOUT_HOURS = 24;

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    public BookingCleanupService(BookingRepository bookingRepository, CarRepository carRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cancelStalePendingBookings() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(PENDING_TIMEOUT_HOURS);
        List<Booking> staleBookings = bookingRepository.findStalePendingBookings(cutoffTime);

        if (!staleBookings.isEmpty()) {
            logger.info("Found {} pending bookings older than {} hours. Auto-cancelling...", 
                    staleBookings.size(), PENDING_TIMEOUT_HOURS);

            for (Booking booking : staleBookings) {
                booking.setStatus("cancelled");
                bookingRepository.save(booking);
                logger.info("Auto-cancelled booking ID {} for car {} (created at: {})",
                        booking.getId(),
                        booking.getCar().getBrand() + " " + booking.getCar().getModel(),
                        booking.getCreatedAt());
            }
        }
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void completeExpiredBookings() {
        LocalDate today = LocalDate.now();
        List<Booking> expiredBookings = bookingRepository.findExpiredActiveBookings(today);

        if (!expiredBookings.isEmpty()) {
            logger.info("Found {} active bookings with past return date. Auto-completing...", 
                    expiredBookings.size());

            for (Booking booking : expiredBookings) {
                booking.setStatus("completed");
                bookingRepository.save(booking);
                
                // Restore car to available status
                Car car = booking.getCar();
                car.setStatus("available");
                carRepository.save(car);
                
                logger.info("Auto-completed booking ID {} for car {} (return date: {})",
                        booking.getId(),
                        booking.getCar().getBrand() + " " + booking.getCar().getModel(),
                        booking.getReturnDate());
            }
        }
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cancelPendingBookingsWithPastPickupDate() {
        LocalDate today = LocalDate.now();
        List<Booking> expiredPendingBookings = bookingRepository.findPendingBookingsWithPastPickupDate(today);

        if (!expiredPendingBookings.isEmpty()) {
            logger.info("Found {} pending bookings with past pickup date. Auto-cancelling...", 
                    expiredPendingBookings.size());

            for (Booking booking : expiredPendingBookings) {
                booking.setStatus("cancelled");
                bookingRepository.save(booking);
                logger.info("Auto-cancelled pending booking ID {} for car {} (pickup date: {})",
                        booking.getId(),
                        booking.getCar().getBrand() + " " + booking.getCar().getModel(),
                        booking.getPickupDate());
            }
        }
    }
}
