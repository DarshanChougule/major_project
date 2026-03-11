package com.example.foodshop.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank 
    String name;

    @Email 
    String email;

    @Size(min = 8, message = "Password must be at least 8 chars") 
    String password;
}
