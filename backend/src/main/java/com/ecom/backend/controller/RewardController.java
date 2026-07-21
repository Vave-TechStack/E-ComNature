package com.ecom.backend.controller;

import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.RewardSummaryResponse;
import com.ecom.backend.dto.response.RewardTransactionResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Rewards", description = "Rewards API")
@RestController
@RequestMapping("/profile/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @Operation(summary = "Get Reward Summary", description = "Get Reward Summary")
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<RewardSummaryResponse>> getRewardSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        RewardSummaryResponse summary = rewardService.getRewardSummary(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @Operation(summary = "Get Transaction History", description = "Get Transaction History")
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<RewardTransactionResponse>>> getTransactionHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<RewardTransactionResponse> transactions = rewardService.getTransactionHistory(
                principal.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}
