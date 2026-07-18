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
public class RewardTransactionResponse {
    private Long id;
    private Integer points;
    private String transactionType;
    private String referenceType;
    private String referenceId;
    private String description;
    private Integer balanceAfter;
    private LocalDateTime createdAt;
}
