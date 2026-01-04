package com.carrental.controller;

import com.carrental.model.Booking;
import com.carrental.model.Car;
import com.carrental.model.CarImage;
import com.carrental.model.User;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarImageRepository;
import com.carrental.repository.UserRepository;
import com.carrental.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CarService carService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarImageRepository carImageRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir:uploads/cars}")
    private String uploadDir;

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/cars/with-pending-bookings")
    public List<Long> getCarsWithPendingBookings() {
        return bookingRepository.findCarIdsWithPendingBookings();
    }

    @PostMapping("/cars")
    public Car createCar(@RequestBody Car car) {
        return carService.saveCar(car);
    }

    @PutMapping("/cars/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car car) {
        car.setId(id);
        return carService.saveCar(car);
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> userData) {
        try {
            String email = userData.get("email").toString();
            
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("User with this email already exists");
            }
            
            User user = new User();
            user.setName(userData.get("name").toString());
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(userData.get("password").toString()));
            user.setPhone(userData.get("phone") != null ? userData.get("phone").toString() : null);
            user.setRole(userData.get("role") != null ? userData.get("role").toString() : "customer");
            
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (userData.get("name") != null) {
                user.setName(userData.get("name").toString());
            }
            if (userData.get("email") != null) {
                String newEmail = userData.get("email").toString();
                if (!newEmail.equals(user.getEmail()) && userRepository.findByEmail(newEmail).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already in use");
                }
                user.setEmail(newEmail);
            }
            if (userData.get("password") != null && !userData.get("password").toString().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(userData.get("password").toString()));
            }
            if (userData.get("phone") != null) {
                user.setPhone(userData.get("phone").toString());
            }
            if (userData.get("role") != null) {
                user.setRole(userData.get("role").toString());
            }
            
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody String role) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cars/{carId}/images")
    public ResponseEntity<?> uploadCarImages(@PathVariable Long carId, 
                                              @RequestParam("images") MultipartFile[] images) {
        try {
            Car car = carService.getCarById(carId);

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            List<CarImage> savedImages = new ArrayList<>();
            int displayOrder = car.getImages().size();

            for (MultipartFile image : images) {
                // Generate unique filename
                String originalFilename = image.getOriginalFilename();
                String extension = originalFilename != null ? 
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String newFilename = UUID.randomUUID().toString() + extension;

                // Save file to disk
                Path filePath = uploadPath.resolve(newFilename);
                Files.copy(image.getInputStream(), filePath);

                // Create CarImage entity
                CarImage carImage = new CarImage();
                carImage.setCar(car);
                carImage.setImageUrl("/uploads/cars/" + newFilename);
                carImage.setIsPrimary(displayOrder == 0);
                carImage.setDisplayOrder(displayOrder++);

                savedImages.add(carImageRepository.save(carImage));
            }

            return ResponseEntity.ok(savedImages);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload images: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PutMapping("/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            if (!"pending".equals(booking.getStatus())) {
                return ResponseEntity.badRequest().body("Only pending bookings can be approved");
            }
            
            booking.setStatus("active");
            bookingRepository.save(booking);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to approve booking: " + e.getMessage());
        }
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            String status = payload.get("status").toString();
            booking.setStatus(status);
            bookingRepository.save(booking);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus("cancelled");
            bookingRepository.save(booking);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
