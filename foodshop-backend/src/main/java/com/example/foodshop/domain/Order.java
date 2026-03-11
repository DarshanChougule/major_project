package com.example.foodshop.domain;

import com.example.foodshop.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "orders", indexes = {
        @Index(name="idx_orders_status", columnList = "status")
})

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @PositiveOrZero
    @Column(nullable = false)
    private Double totalPrice;

    @Column(length = 500) // allows up to 500 characters
    private String description; // ✅ new field for notes or comments

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // @Column(nullable = false, updatable = false)
    // @CreatedDate
    // private LocalDateTime createdAt;

    // @Column(nullable = false)
    // @LastModifiedDate
    // private LocalDateTime updatedAt;
}
