package com.example.foodshop.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class CreateOrderItem {
    @NotNull 
    Long menuItemId;
    @Min(1) 
    Integer quantity;
}
