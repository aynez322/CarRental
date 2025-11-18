package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("available");
    }

    public Car saveCar(Car car) {
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    /**
     * Logica de căutare:
     * Fără pickup/return -> toate (sau doar filtrare pe location).
     * Doar location -> filtrare după location.
     * Doar una din date (pickup sau return) -> ignorăm filtrarea pe disponibilitate (returnăm ca și cum nu ai dat interval).
     * Ambele date (+ optional location) -> doar mașinile disponibile (fără booking suprapus).
     */
    public List<Car> search(String location, LocalDate pickupDate, LocalDate returnDate) {
        boolean hasPickup = pickupDate != null;
        boolean hasReturn = returnDate != null;

        if (!hasPickup && !hasReturn) {
            if (StringUtils.hasText(location)) {
                return carRepository.findByLocationIgnoreCase(location);
            }
            return carRepository.findAll();
        }

        if (hasPickup ^ hasReturn) {
            if (StringUtils.hasText(location)) {
                return carRepository.findByLocationIgnoreCase(location);
            }
            return carRepository.findAll();
        }

        if (returnDate.isBefore(pickupDate)) {
            throw new IllegalArgumentException("Return date nu poate fi înainte de pickup date.");
        }

        return carRepository.findAvailable(
                StringUtils.hasText(location) ? location : null,
                pickupDate,
                returnDate
        );
    }
}