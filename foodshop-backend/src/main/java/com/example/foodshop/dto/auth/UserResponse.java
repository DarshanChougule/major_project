package com.example.foodshop.dto.auth;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Instant createdAt;
    private long totalOrders;
}
