package com.example.foodshop.repository;

import com.example.foodshop.domain.Order;
import com.example.foodshop.domain.OrderStatus;
import com.example.foodshop.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUser(User user, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}
