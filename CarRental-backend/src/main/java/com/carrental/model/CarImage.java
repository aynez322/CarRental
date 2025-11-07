package com.carrental.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "car_images")
@Data
public class CarImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    @JsonIgnore
    private Car car;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;
}
