package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;

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

    @Transactional
    public void deleteCar(Long id) {
        bookingRepository.deleteByCarId(id);
        carRepository.deleteById(id);
    }

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
            throw new IllegalArgumentException("Return date cannot be before pickup date.");
        }

        return carRepository.findAvailable(
                StringUtils.hasText(location) ? location : null,
                pickupDate,
                returnDate
        );
    }
}