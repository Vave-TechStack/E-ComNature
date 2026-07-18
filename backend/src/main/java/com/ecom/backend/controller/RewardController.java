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

@RestController
@RequestMapping("/profile/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<RewardSummaryResponse>> getRewardSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        RewardSummaryResponse summary = rewardService.getRewardSummary(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

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
