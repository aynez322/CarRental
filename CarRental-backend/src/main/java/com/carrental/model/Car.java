package com.carrental.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
@Data
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "price_per_day", nullable = false)
    private Double pricePerDay;

    @Column(name = "fuel_type", nullable = false, length = 20)
    private String fuelType;

    @Column(nullable = false, length = 20)
    private String gearbox;

    @Column(nullable = false)
    private Integer passengers;

    @Column(length = 20)
    private String status = "available";

    @Column(length = 100)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CarImage> images = new ArrayList<>();
    
}