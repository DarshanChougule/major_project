package com.example.foodshop.service;

import com.example.foodshop.domain.*;
import com.example.foodshop.dto.order.CreateOrderRequest;
import com.example.foodshop.dto.order.OrderItemResponse;
import com.example.foodshop.dto.order.OrderResponse;
import com.example.foodshop.repository.MenuItemRepository;
import com.example.foodshop.repository.OrderRepository;
import com.example.foodshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.var;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository users;
    private final MenuItemRepository menuRepo;
    private final OrderRepository orderRepo;

    @Transactional
    public OrderResponse create(CreateOrderRequest req, Authentication auth) {
        var user = users.findByEmail(auth.getName()).orElseThrow();

        if (req.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // ✅ include description when building the order
        var order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalPrice(0.0)
                .description(req.getDescription()) // <--- new line
                .build();

        double total = 0.0;
        for (var it : req.getItems()) {
            var menu = menuRepo.findById(it.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + it.getMenuItemId()));

            var oi = OrderItem.builder()
                    .order(order)
                    .menuItem(menu)
                    .quantity(it.getQuantity())
                    .unitPrice(menu.getPrice())
                    .build();

            order.getItems().add(oi);
            total += menu.getPrice() * it.getQuantity();
        }

        order.setTotalPrice(total);

        var saved = orderRepo.save(order);
        return toResponse(saved);
    }

    public Page<OrderResponse> myOrders(Authentication auth, Pageable pageable) {
        var user = users.findByEmail(auth.getName()).orElseThrow();
        return orderRepo.findByUser(user, pageable).map(this::toResponse);
    }

    public Page<OrderResponse> listByStatus(OrderStatus status, Pageable pageable) {
        return orderRepo.findByStatus(status, pageable).map(this::toResponse);
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        var order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return toResponse(order);
    }

    private OrderResponse toResponse(Order o) {
        var items = o.getItems().stream().map(oi ->
                OrderItemResponse.builder()
                        .id(oi.getId())
                        .menuItemId(oi.getMenuItem().getId())
                        .name(oi.getMenuItem().getName())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getUnitPrice())
                        .build()
        ).toList();

        // ✅ include description when mapping entity → response
        return OrderResponse.builder()
                .id(o.getId())
                .status(o.getStatus().name())
                .totalPrice(o.getTotalPrice())
                .items(items)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .description(o.getDescription()) // <--- new line
                .build();
    }
}
