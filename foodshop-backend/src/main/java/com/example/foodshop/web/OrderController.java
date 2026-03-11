package com.example.foodshop.web;

import com.example.foodshop.domain.OrderStatus;
import com.example.foodshop.dto.order.CreateOrderRequest;
import com.example.foodshop.dto.order.OrderResponse;
import com.example.foodshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orders;

    @PostMapping("/user/orders")
    public ResponseEntity<OrderResponse> create(@RequestBody @Valid CreateOrderRequest req,
                                                Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orders.create(req, auth));
    }


    @GetMapping("/user/orders/me")
    public Page<OrderResponse> myOrders(@RequestParam(name="page",defaultValue = "0") int page,
                                        @RequestParam(name="size",defaultValue = "10") int size,
                                        Authentication auth) {
        return orders.myOrders(auth, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/admin/orders")
    public Page<OrderResponse> byStatus(@RequestParam(name="status",defaultValue = "PENDING") OrderStatus status,
                                        @RequestParam(name="page",defaultValue = "0") int page,
                                        @RequestParam(name="size",defaultValue = "10") int size) {
        return orders.listByStatus(status, PageRequest.of(page, size, Sort.by("createdAt").ascending()));
    }

    @PutMapping("/admin/orders/{id}/status")
    public OrderResponse updateStatus(@PathVariable(name="id") Long id, @RequestParam(name="status") OrderStatus status) {
        return orders.updateStatus(id, status);
    }
}
