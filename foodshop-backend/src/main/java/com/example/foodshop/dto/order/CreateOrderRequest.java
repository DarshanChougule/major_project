package com.example.foodshop.dto.order;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty 
    private List<CreateOrderItem> items;

    private String description; // ✅ added field for optional order notes
}
