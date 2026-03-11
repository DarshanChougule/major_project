package com.example.foodshop.dto.feedback;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackRequestDTO {
    private int rating;
    private String comment;
}
