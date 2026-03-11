package com.example.foodshop.domain;

import com.example.foodshop.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "menu_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Positive @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Boolean available = true;

    private String imageUrl;
}
