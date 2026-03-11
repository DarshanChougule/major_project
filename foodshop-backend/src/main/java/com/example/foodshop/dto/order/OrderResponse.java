package com.example.foodshop.dto.order;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;
    private String status;
    private Double totalPrice;
    private List<OrderItemResponse> items;
    private Instant createdAt;
    private Instant updatedAt;

    private String description; // ✅ added for returning order notes
}
