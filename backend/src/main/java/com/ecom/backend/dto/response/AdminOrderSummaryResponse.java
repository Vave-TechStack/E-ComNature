package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderSummaryResponse {
    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private int itemCount;
    private double totalAmount;
    private String status;
    private String paymentStatus;
}
