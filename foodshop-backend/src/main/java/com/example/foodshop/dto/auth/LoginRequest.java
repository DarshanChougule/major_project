package com.example.foodshop.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    @Email 
    String email;
    
    @NotBlank 
    String password;
}
