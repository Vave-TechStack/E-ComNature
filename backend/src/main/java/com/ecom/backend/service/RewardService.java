package com.ecom.backend.service;

import com.ecom.backend.dto.response.RewardSummaryResponse;
import com.ecom.backend.dto.response.RewardTransactionResponse;
import com.ecom.backend.entity.RewardTransaction;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.BusinessException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.RewardTransactionRepository;
import com.ecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardTransactionRepository rewardTransactionRepository;
    private final UserRepository userRepository;

    private static final int SILVER_THRESHOLD = 0;
    private static final int GOLD_THRESHOLD = 5000;
    private static final int PLATINUM_THRESHOLD = 15000;
    private static final int ELITE_THRESHOLD = 50000;

    public RewardSummaryResponse getRewardSummary(Long userId) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Integer currentPoints = user.getRewardPoints() != null ? user.getRewardPoints() : 0;
        Integer lifetimePoints = rewardTransactionRepository.getTotalEarnedPointsByUserId(userId);
        if (lifetimePoints == null) lifetimePoints = 0;

        String currentTier = calculateTier(lifetimePoints);
        String nextTier = getNextTier(currentTier);
        int pointsToNextTier = calculatePointsToNextTier(lifetimePoints, currentTier);
        int pointsProgress = calculateProgress(lifetimePoints, currentTier);

        List<RewardTransaction> recentTransactions = rewardTransactionRepository
                .findRecentByUserId(userId, PageRequest.of(0, 10));

        return RewardSummaryResponse.builder()
                .currentPoints(currentPoints)
                .lifetimePoints(lifetimePoints)
                .currentTier(currentTier)
                .nextTier(nextTier)
                .pointsToNextTier(pointsToNextTier)
                .pointsProgress(pointsProgress)
                .walletBalance(user.getWalletBalance() != null ? user.getWalletBalance() : 0.0)
                .recentTransactions(recentTransactions.stream()
                        .map(this::mapTransactionToResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public List<RewardTransactionResponse> getTransactionHistory(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RewardTransaction> transactions = rewardTransactionRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId, pageable);
        return transactions.stream()
                .map(this::mapTransactionToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RewardTransactionResponse addPoints(Long userId, int points, String referenceType,
                                                String referenceId, String description) {
        if (points <= 0) {
            throw new BusinessException("Points must be positive");
        }

        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int newBalance = (user.getRewardPoints() != null ? user.getRewardPoints() : 0) + points;
        user.setRewardPoints(newBalance);
        userRepository.save(user);

        RewardTransaction transaction = new RewardTransaction();
        transaction.setUser(user);
        transaction.setPoints(points);
        transaction.setTransactionType("EARNED");
        transaction.setReferenceType(referenceType);
        transaction.setReferenceId(referenceId);
        transaction.setDescription(description);
        transaction.setBalanceAfter(newBalance);
        transaction = rewardTransactionRepository.save(transaction);

        log.info("Points earned: {} for user {}, reference: {}/{}", points, userId, referenceType, referenceId);
        return mapTransactionToResponse(transaction);
    }

    @Transactional
    public RewardTransactionResponse redeemPoints(Long userId, int points, String description) {
        if (points <= 0) {
            throw new BusinessException("Points must be positive");
        }

        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int currentBalance = user.getRewardPoints() != null ? user.getRewardPoints() : 0;
        if (currentBalance < points) {
            throw new BusinessException("Insufficient reward points. Available: " + currentBalance);
        }

        int newBalance = currentBalance - points;
        user.setRewardPoints(newBalance);
        userRepository.save(user);

        RewardTransaction transaction = new RewardTransaction();
        transaction.setUser(user);
        transaction.setPoints(points);
        transaction.setTransactionType("REDEEMED");
        transaction.setDescription(description);
        transaction.setBalanceAfter(newBalance);
        transaction = rewardTransactionRepository.save(transaction);

        log.info("Points redeemed: {} for user {}, description: {}", points, userId, description);
        return mapTransactionToResponse(transaction);
    }

    // ============ TIER HELPERS ============

    private String calculateTier(int lifetimePoints) {
        if (lifetimePoints >= ELITE_THRESHOLD) return "ELITE";
        if (lifetimePoints >= PLATINUM_THRESHOLD) return "PLATINUM";
        if (lifetimePoints >= GOLD_THRESHOLD) return "GOLD";
        return "SILVER";
    }

    private String getNextTier(String currentTier) {
        return switch (currentTier) {
            case "SILVER" -> "GOLD";
            case "GOLD" -> "PLATINUM";
            case "PLATINUM" -> "ELITE";
            default -> null;
        };
    }

    private int calculatePointsToNextTier(int lifetimePoints, String currentTier) {
        return switch (currentTier) {
            case "SILVER" -> GOLD_THRESHOLD - lifetimePoints;
            case "GOLD" -> PLATINUM_THRESHOLD - lifetimePoints;
            case "PLATINUM" -> ELITE_THRESHOLD - lifetimePoints;
            default -> 0;
        };
    }

    private int calculateProgress(int lifetimePoints, String currentTier) {
        int tierMin = switch (currentTier) {
            case "SILVER" -> SILVER_THRESHOLD;
            case "GOLD" -> GOLD_THRESHOLD;
            case "PLATINUM" -> PLATINUM_THRESHOLD;
            default -> ELITE_THRESHOLD;
        };
        int tierMax = switch (currentTier) {
            case "SILVER" -> GOLD_THRESHOLD;
            case "GOLD" -> PLATINUM_THRESHOLD;
            case "PLATINUM" -> ELITE_THRESHOLD;
            default -> lifetimePoints; // ELITE is max tier
        };
        if (lifetimePoints >= tierMax) return 100;
        return ((lifetimePoints - tierMin) * 100) / (tierMax - tierMin);
    }

    private RewardTransactionResponse mapTransactionToResponse(RewardTransaction transaction) {
        return RewardTransactionResponse.builder()
                .id(transaction.getId())
                .points(transaction.getPoints())
                .transactionType(transaction.getTransactionType())
                .referenceType(transaction.getReferenceType())
                .referenceId(transaction.getReferenceId())
                .description(transaction.getDescription())
                .balanceAfter(transaction.getBalanceAfter())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
