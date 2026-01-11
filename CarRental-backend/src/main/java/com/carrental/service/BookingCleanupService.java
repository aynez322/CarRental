package com.carrental.service;

import com.carrental.model.Booking;
import com.carrental.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(BookingCleanupService.class);
    private static final int PENDING_TIMEOUT_HOURS = 24;

    private final BookingRepository bookingRepository;

    public BookingCleanupService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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
}
