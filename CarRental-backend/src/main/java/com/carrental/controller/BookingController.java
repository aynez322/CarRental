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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp");

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload-license")
    public ResponseEntity<?> uploadLicense(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file provided");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            Path uploadPath = Paths.get("uploads", "licenses");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = ".jpg";
            if (originalFilename != null && originalFilename.contains(".")) {
                String extractedExt = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
                if (ALLOWED_EXTENSIONS.contains(extractedExt)) {
                    extension = extractedExt;
                }
            }

            String newFilename = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            Map<String, Object> response = new HashMap<>();
            response.put("url", "/uploads/licenses/" + newFilename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload license image: " + e.getMessage());
        }
    }

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
    @Transactional
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> bookingData, Authentication authentication) {
        try {
            Long carId = Long.parseLong(bookingData.get("carId").toString());
            String pickupLocation = bookingData.get("pickupLocation").toString();
            LocalDate pickupDate = LocalDate.parse(bookingData.get("pickupDate").toString());
            LocalDate returnDate = LocalDate.parse(bookingData.get("returnDate").toString());
            String customerName = bookingData.get("customerName").toString();
            String customerEmail = bookingData.get("customerEmail").toString();
            String customerPhone = bookingData.get("customerPhone").toString();

            String idnp = bookingData.get("idnp") != null ? bookingData.get("idnp").toString().trim() : "";
            String driverLicenseFrontUrl = bookingData.get("driverLicenseFrontUrl") != null ? bookingData.get("driverLicenseFrontUrl").toString().trim() : "";
            String driverLicenseBackUrl = bookingData.get("driverLicenseBackUrl") != null ? bookingData.get("driverLicenseBackUrl").toString().trim() : "";

            if (pickupDate.isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body("Pickup date cannot be in the past");
            }
            if (returnDate.isBefore(pickupDate)) {
                return ResponseEntity.badRequest().body("Return date must be after pickup date");
            }
            if (idnp.isEmpty()) {
                return ResponseEntity.badRequest().body("CNP is required");
            }
            if (idnp.length() != 13 || !idnp.matches("\\d{13}")) {
                return ResponseEntity.badRequest().body("CNP must be exactly 13 digits");
            }
            if (driverLicenseFrontUrl.isEmpty() || driverLicenseBackUrl.isEmpty()) {
                return ResponseEntity.badRequest().body("Driver license photos (front and back) are required");
            }

            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new RuntimeException("Car not found"));

            // Check car status - only available cars can be booked
            if (!"available".equalsIgnoreCase(car.getStatus())) {
                return ResponseEntity.badRequest().body("Car is not available for booking (status: " + car.getStatus() + ")");
            }

            boolean hasConflict = bookingRepository.existsActiveBookingForCarInDateRange(carId, pickupDate, returnDate);
            if (hasConflict) {
                return ResponseEntity.badRequest().body("Car is not available for the selected dates");
            }

            long days = ChronoUnit.DAYS.between(pickupDate, returnDate);
            // Minimum 1 day booking duration
            if (days < 1) {
                return ResponseEntity.badRequest().body("Minimum booking duration is 1 day");
            }
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
            booking.setIdnp(idnp);
            booking.setDriverLicenseFrontUrl(driverLicenseFrontUrl);
            booking.setDriverLicenseBackUrl(driverLicenseBackUrl);

            if (authentication != null && authentication.isAuthenticated()) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email).orElse(null);
                booking.setUser(user);
                
                // Check for duplicate booking by same user for same car in overlapping dates
                if (user != null && bookingRepository.existsUserBookingForCarInDateRange(
                        user.getId(), carId, pickupDate, returnDate)) {
                    return ResponseEntity.badRequest().body("You already have an active booking for this car during the selected dates");
                }
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
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Authentication required");
            }

            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            String email = authentication.getName();
            if (booking.getUser() == null || !booking.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            String currentStatus = booking.getStatus().toLowerCase();
            if ("cancelled".equals(currentStatus) || "completed".equals(currentStatus)) {
                return ResponseEntity.badRequest().body("Booking cannot be cancelled");
            }

            // Prevent cancellation within 24 hours of pickup date
            LocalDate today = LocalDate.now();
            long daysUntilPickup = ChronoUnit.DAYS.between(today, booking.getPickupDate());
            if (daysUntilPickup < 1) {
                return ResponseEntity.badRequest().body("Cannot cancel booking within 24 hours of pickup date. Please contact support.");
            }

            booking.setStatus("cancelled");
            bookingRepository.save(booking);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to cancel booking: " + e.getMessage());
        }
    }
}
