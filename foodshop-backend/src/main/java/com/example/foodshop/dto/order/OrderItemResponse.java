package com.example.foodshop.dto.order;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    Long id;
    Long menuItemId;
    String name;
    Integer quantity;
    Double unitPrice;
}
