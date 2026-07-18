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
public class AdminCustomerListItemResponse {
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
    private int totalOrders;
    private double totalSpent;
    private int rewardPoints;
    private double walletBalance;
    private String referralCode;
    private LocalDateTime joinedAt;
    private LocalDateTime lastLoginAt;
}
