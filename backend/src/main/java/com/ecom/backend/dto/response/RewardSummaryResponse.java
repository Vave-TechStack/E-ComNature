package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardSummaryResponse {
    private Integer currentPoints;
    private Integer lifetimePoints;
    private String currentTier;
    private String nextTier;
    private Integer pointsToNextTier;
    private Integer pointsProgress;
    private Double walletBalance;
    private List<RewardTransactionResponse> recentTransactions;
}
