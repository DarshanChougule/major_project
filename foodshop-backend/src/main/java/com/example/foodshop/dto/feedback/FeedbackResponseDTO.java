package com.example.foodshop.dto.feedback;

import java.time.Instant;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponseDTO {
    private int rating;
    private String comment;
    private Long orderId;
    private Long userId;
    private Instant createdAt;
}
