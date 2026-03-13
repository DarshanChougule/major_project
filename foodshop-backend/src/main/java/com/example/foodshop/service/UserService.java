package com.example.foodshop.service;

import com.example.foodshop.domain.User;
import com.example.foodshop.dto.auth.UserResponse;
import com.example.foodshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .createdAt(u.getCreatedAt())
                .totalOrders(u.getOrders() != null ? u.getOrders().size() : 0)
                .build();
    }
}
