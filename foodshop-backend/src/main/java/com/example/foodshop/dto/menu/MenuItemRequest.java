package com.example.foodshop.dto.menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class MenuItemRequest {
    @NotBlank 
    String name;
    String description;
    @Positive 
    Double price;
    Boolean available;
    String imageUrl;
}
