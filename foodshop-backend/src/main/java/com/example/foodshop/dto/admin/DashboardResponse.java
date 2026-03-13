package com.example.foodshop.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalAdmins;

    private long totalOrders;
    private Map<String, Long> ordersByStatus;

    private double totalRevenue;

    private long totalMenuItems;
    private long availableMenuItems;

    private long totalFeedbacks;
    private double avgRating;

    private List<RecentOrderDTO> recentOrders;

    @Data
    @Builder
    public static class RecentOrderDTO {
        private Long id;
        private String userName;
        private String userEmail;
        private String status;
        private Double totalPrice;
        private String createdAt;
    }
}
