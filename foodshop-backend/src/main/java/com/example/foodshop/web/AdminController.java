package com.example.foodshop.web;

import com.example.foodshop.dto.admin.DashboardResponse;
import com.example.foodshop.dto.auth.UserResponse;
import com.example.foodshop.service.DashboardService;
import com.example.foodshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final DashboardService dashboardService;

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }
}
