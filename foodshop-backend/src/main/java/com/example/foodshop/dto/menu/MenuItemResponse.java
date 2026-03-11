package com.example.foodshop.dto.menu;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuItemResponse {
    Long id; 
    String name; 
    String description; 
    Double price; 
    Boolean available; 
    String imageUrl;
}
