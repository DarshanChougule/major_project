package com.example.foodshop.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    String token;
    String tokenType;
    Long userId;
    String name;
    String email;
    String role;
}
