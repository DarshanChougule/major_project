package com.example.foodshop.service;

import com.example.foodshop.domain.Order;
import com.example.foodshop.domain.OrderStatus;
import com.example.foodshop.domain.Role;
import com.example.foodshop.dto.admin.DashboardResponse;
import com.example.foodshop.repository.FeedbackRepository;
import com.example.foodshop.repository.MenuItemRepository;
import com.example.foodshop.repository.OrderRepository;
import com.example.foodshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.var;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepo;
    private final OrderRepository orderRepo;
    private final MenuItemRepository menuRepo;
    private final FeedbackRepository feedbackRepo;

    public DashboardResponse getDashboard() {

        // Users
        var allUsers = userRepo.findAll();
        long totalUsers = allUsers.size();
        long totalCustomers = allUsers.stream().filter(u -> u.getRole() == Role.CUSTOMER).count();
        long totalAdmins = allUsers.stream().filter(u -> u.getRole() == Role.ADMIN).count();

        // Orders by status
        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus s : OrderStatus.values()) {
            ordersByStatus.put(s.name(), orderRepo.countByStatus(s));
        }
        long totalOrders = ordersByStatus.values().stream().mapToLong(Long::longValue).sum();

        // Revenue (sum of COMPLETED orders)
        var allOrders = orderRepo.findAll();
        double totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .mapToDouble(Order::getTotalPrice)
                .sum();

        // Menu items
        long totalMenuItems = menuRepo.count();
        long availableMenuItems = menuRepo.findAll().stream()
                .filter(m -> Boolean.TRUE.equals(m.getAvailable()))
                .count();

        // Feedback
        var allFeedbacks = feedbackRepo.findAll();
        long totalFeedbacks = allFeedbacks.size();
        double avgRating = allFeedbacks.isEmpty() ? 0.0
                : allFeedbacks.stream().mapToInt(f -> f.getRating()).average().orElse(0.0);

        // Recent 5 orders
        var recentPage = orderRepo.findAll(
                PageRequest.of(0, 5, Sort.by("createdAt").descending()));

        var recentOrders = recentPage.getContent().stream().map(o ->
                DashboardResponse.RecentOrderDTO.builder()
                        .id(o.getId())
                        .userName(o.getUser().getName())
                        .userEmail(o.getUser().getEmail())
                        .status(o.getStatus().name())
                        .totalPrice(o.getTotalPrice())
                        .createdAt(o.getCreatedAt() != null
                                ? DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")
                                    .withZone(ZoneId.of("Asia/Kolkata"))
                                    .format(o.getCreatedAt())
                                : null)
                        .build()
        ).toList();

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalAdmins(totalAdmins)
                .totalOrders(totalOrders)
                .ordersByStatus(ordersByStatus)
                .totalRevenue(totalRevenue)
                .totalMenuItems(totalMenuItems)
                .availableMenuItems(availableMenuItems)
                .totalFeedbacks(totalFeedbacks)
                .avgRating(Math.round(avgRating * 10.0) / 10.0)
                .recentOrders(recentOrders)
                .build();
    }
}
