package com.example.foodshop.service;

import com.example.foodshop.domain.Feedback;
import com.example.foodshop.domain.Order;
import com.example.foodshop.domain.OrderStatus;
import com.example.foodshop.domain.User;
import com.example.foodshop.dto.feedback.FeedbackRequestDTO;
import com.example.foodshop.dto.feedback.FeedbackResponseDTO;
import com.example.foodshop.repository.FeedbackRepository;
import com.example.foodshop.repository.OrderRepository;
import com.example.foodshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    @Transactional
    public FeedbackResponseDTO addFeedback(Long orderId, FeedbackRequestDTO dto, Principal principal) {
        // find user
        User user = userRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // find order
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // validate order status
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new RuntimeException("Feedback allowed only for completed orders.");
        }

        // check if feedback already exists
        feedbackRepo.findByOrderId(orderId).ifPresent(f -> {
            throw new RuntimeException("Feedback already submitted for this order.");
        });

        // create feedback
        Feedback feedback = Feedback.builder()
                .rating(dto.getRating())
                .comment(dto.getComment())
                .order(order)
                .user(user)
                .build();

        Feedback saved = feedbackRepo.save(feedback);

        return FeedbackResponseDTO.builder()
                .rating(saved.getRating())
                .comment(saved.getComment())
                .orderId(order.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .createdAt(saved.getCreatedAt())
                .build();
    }

     public List<FeedbackResponseDTO> getAllFeedbacks() {
        return feedbackRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ Get feedbacks by order ID
    public FeedbackResponseDTO getFeedbackByOrder(Long orderId) {
        return feedbackRepo.findByOrderId(orderId)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("No feedback found for this order"));
    }

    // ✅ Get feedbacks by user ID
    public List<FeedbackResponseDTO> getFeedbackByUser(Long userId) {
        return feedbackRepo.findByUserId(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FeedbackResponseDTO mapToDto(Feedback feedback) {
        return FeedbackResponseDTO.builder()
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .orderId(feedback.getOrder().getId())
                .userId(feedback.getUser().getId())
                .userName(feedback.getUser().getName())
                .userEmail(feedback.getUser().getEmail())
                .createdAt(feedback.getCreatedAt())
                .build();
    }


    public boolean hasFeedbackForOrder(Long orderId) {
        return feedbackRepo.existsByOrderId(orderId);
    }
}
