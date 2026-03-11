package com.example.foodshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.foodshop.domain.Feedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByOrderId(Long orderId);
    List<Feedback> findByUserId(Long userId); // ✅ get feedback by user
    boolean existsByOrderId(Long orderId);
}