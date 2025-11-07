package com.carrental.repository;

import com.carrental.model.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, Long> {
    List<CarImage> findByCarId(Long carId);
    CarImage findByCarIdAndIsPrimary(Long carId, Boolean isPrimary);
}
