package com.example.foodshop.web;

import com.example.foodshop.dto.feedback.FeedbackRequestDTO;
import com.example.foodshop.dto.feedback.FeedbackResponseDTO;
import com.example.foodshop.service.FeedbackService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/user/feedback/{orderId}")
    public FeedbackResponseDTO submitFeedback(
            @PathVariable(name="orderId") Long orderId,
            @RequestBody FeedbackRequestDTO feedbackDto,
            Principal principal) {
        return feedbackService.addFeedback(orderId, feedbackDto, principal);
    }

    @GetMapping("/admin/feedback")
    public List<FeedbackResponseDTO> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    // ✅ Get feedback for specific order
    @GetMapping("/user/feedback/order/{orderId}")
    public ResponseEntity<Boolean> checkFeedbackExists(@PathVariable(name="orderId") Long orderId) {
        boolean exists = feedbackService.hasFeedbackForOrder(orderId);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/admin/feedback/order/{orderId}")
    public FeedbackResponseDTO getFeedbackByOrder(@PathVariable(name="orderId") Long orderId) {
        return feedbackService.getFeedbackByOrder(orderId);
    }

    // ✅ Get feedback by user
    @GetMapping("/admin/{userId}")
    public List<FeedbackResponseDTO> getFeedbackByUser(@PathVariable Long userId) {
        return feedbackService.getFeedbackByUser(userId);
    }
}
