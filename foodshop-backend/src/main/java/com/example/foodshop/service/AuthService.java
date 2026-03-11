package com.example.foodshop.service;

import com.example.foodshop.domain.Role;
import com.example.foodshop.domain.User;
import com.example.foodshop.dto.auth.JwtResponse;
import com.example.foodshop.dto.auth.LoginRequest;
import com.example.foodshop.dto.auth.RegisterRequest;
import com.example.foodshop.repository.UserRepository;
import com.example.foodshop.security.JwtTokenService;
import lombok.RequiredArgsConstructor;
import lombok.var;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtTokenService jwt;

    public void register(RegisterRequest req) {
        if (users.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        var user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .role(Role.CUSTOMER)
                .build();
        users.save(user);
    }

    public JwtResponse login(LoginRequest req) {
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        var u = users.findByEmail(req.getEmail()).orElseThrow();
        return JwtResponse.builder()
                .token(jwt.generate(auth))
                .tokenType("Bearer")
                .userId(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .build();
    }
}
