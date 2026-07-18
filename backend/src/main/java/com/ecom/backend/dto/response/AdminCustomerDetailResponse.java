package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCustomerDetailResponse {
    // Profile
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String displayName;
    private String profileImage;
    private String role;
    private String status;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean accountLocked;
    private boolean twoFactorEnabled;
    private String gender;
    private String dateOfBirth;
    private int rewardPoints;
    private double walletBalance;
    private String referralCode;
    private String referredBy;
    private LocalDateTime joinedAt;
    private LocalDateTime lastLoginAt;
    private String lastLoginIp;
    private String lastLoginDevice;
    private int failedLoginAttempts;

    // Stats
    private int totalOrders;
    private double totalSpent;
    private double averageOrderValue;

    // Sub-resources
    private List<AddressResponse> addresses;
    private List<WishlistItemResponse> wishlistItems;
    private RewardSummaryResponse rewardSummary;
    private List<AdminOrderSummaryResponse> recentOrders;
}
