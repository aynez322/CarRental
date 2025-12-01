package com.carrental.controller;

import com.carrental.model.Car;
import com.carrental.model.CarImage;
import com.carrental.model.User;
import com.carrental.repository.CarImageRepository;
import com.carrental.repository.UserRepository;
import com.carrental.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
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

    @Value("${app.upload.dir:uploads/cars}")
    private String uploadDir;

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return carService.getAllCars();
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
}
