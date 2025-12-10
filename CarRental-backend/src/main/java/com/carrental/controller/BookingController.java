package com.carrental.controller;

import com.carrental.model.Booking;
import com.carrental.model.Car;
import com.carrental.model.User;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam Long carId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            
            boolean hasConflict = bookingRepository.existsActiveBookingForCarInDateRange(carId, start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("available", !hasConflict);
            response.put("carId", carId);
            response.put("startDate", startDate);
            response.put("endDate", endDate);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to check availability: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> bookingData, Authentication authentication) {
        try {
            Long carId = Long.parseLong(bookingData.get("carId").toString());
            String pickupLocation = bookingData.get("pickupLocation").toString();
            LocalDate pickupDate = LocalDate.parse(bookingData.get("pickupDate").toString());
            LocalDate returnDate = LocalDate.parse(bookingData.get("returnDate").toString());
            String customerName = bookingData.get("customerName").toString();
            String customerEmail = bookingData.get("customerEmail").toString();
            String customerPhone = bookingData.get("customerPhone").toString();

            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new RuntimeException("Car not found"));

            // Calculate total price
            long days = ChronoUnit.DAYS.between(pickupDate, returnDate);
            if (days <= 0) days = 1;
            BigDecimal totalPrice = BigDecimal.valueOf(car.getPricePerDay() * days);

            Booking booking = new Booking();
            booking.setCar(car);
            booking.setPickupLocation(pickupLocation);
            booking.setPickupDate(pickupDate);
            booking.setReturnDate(returnDate);
            booking.setTotalPrice(totalPrice);
            booking.setStatus("pending");
            booking.setCustomerName(customerName);
            booking.setCustomerEmail(customerEmail);
            booking.setCustomerPhone(customerPhone);

            // If user is authenticated, link the booking to the user
            if (authentication != null && authentication.isAuthenticated()) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email).orElse(null);
                booking.setUser(user);
            }

            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create booking: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Booking> bookings = bookingRepository.findByUserOrderByPickupDateDesc(user);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch bookings: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Check if the booking belongs to the authenticated user
            if (authentication != null && authentication.isAuthenticated()) {
                String email = authentication.getName();
                if (booking.getUser() == null || !booking.getUser().getEmail().equals(email)) {
                    return ResponseEntity.status(403).body("Forbidden");
                }
            }

            booking.setStatus("cancelled");
            bookingRepository.save(booking);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to cancel booking: " + e.getMessage());
        }
    }
}
