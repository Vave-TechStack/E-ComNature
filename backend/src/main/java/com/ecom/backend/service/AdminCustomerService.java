package com.ecom.backend.service;

import com.ecom.backend.dto.request.AdminPointAdjustmentRequest;
import com.ecom.backend.dto.response.*;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.WishlistItem;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.BusinessException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.*;
import com.ecom.backend.security.JwtTokenProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminCustomerService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final OrderRepository orderRepository;
    private final RewardService rewardService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    // ============ LIST CUSTOMERS ============

    public AdminCustomerPageResponse listCustomers(String search, String status, Boolean locked,
                                                    String sortBy, String sortDir, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                        getSortField(sortBy)));

        Page<User> userPage;
        if (search != null && !search.isBlank()) {
            userPage = userRepository.searchUsers(search, pageable);
        } else {
            userPage = userRepository.findByIsDeletedFalse(pageable);
        }

        List<AdminCustomerListItemResponse> customers = userPage.getContent().stream()
                .map(this::mapToListItem)
                .collect(Collectors.toList());

        // Apply post-filtering for status/locked that can't be done at DB level
        if ((status != null && !status.isBlank()) || locked != null) {
            customers = customers.stream()
                    .filter(c -> {
                        boolean matchesStatus = true;
                        boolean matchesLocked = true;
                        if (status != null && !status.isBlank()) {
                            matchesStatus = c.getStatus().equalsIgnoreCase(status);
                        }
                        if (locked != null) {
                            matchesLocked = c.isAccountLocked() == locked;
                        }
                        return matchesStatus && matchesLocked;
                    })
                    .collect(Collectors.toList());
        }

        return AdminCustomerPageResponse.builder()
                .customers(customers)
                .page(page)
                .size(size)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminCustomerDetailResponse getCustomerDetail(Long customerId) {
        User user = findUserById(customerId);

        // Profile
        String status = Boolean.TRUE.equals(user.getIsAccountLocked()) ? "LOCKED"
                : Boolean.FALSE.equals(user.getIsActive()) ? "INACTIVE" : "ACTIVE";

        // Stats
        long totalOrders = orderRepository.countByUserId(customerId);
        double totalSpent = orderRepository.getTotalSpentByUserId(customerId);
        double avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        // Sub-resources
        List<AddressResponse> addresses = addressRepository
                .findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(customerId)
                .stream()
                .map(this::mapAddressToResponse)
                .collect(Collectors.toList());

        List<WishlistItemResponse> wishlistItems = wishlistItemRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::mapWishlistToResponse)
                .collect(Collectors.toList());

        RewardSummaryResponse rewardSummary = rewardService.getRewardSummary(customerId);

        List<AdminOrderSummaryResponse> recentOrders = orderRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(customerId)
                .stream()
                .limit(10)
                .map(order -> AdminOrderSummaryResponse.builder()
                        .id(order.getId())
                        .orderNumber(order.getOrderNumber())
                        .orderDate(order.getCreatedAt())
                        .itemCount(order.getItems() != null ? order.getItems().size() : 0)
                        .totalAmount(order.getTotalAmount())
                        .status(order.getStatus().name())
                        .paymentStatus(order.getPaymentStatus().name())
                        .build())
                .collect(Collectors.toList());

        return AdminCustomerDetailResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .displayName(user.getDisplayName())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .status(status)
                .emailVerified(Boolean.TRUE.equals(user.getIsEmailVerified()))
                .phoneVerified(Boolean.TRUE.equals(user.getIsPhoneVerified()))
                .accountLocked(Boolean.TRUE.equals(user.getIsAccountLocked()))
                .twoFactorEnabled(Boolean.TRUE.equals(user.getTwoFactorEnabled()))
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .rewardPoints(user.getRewardPoints() != null ? user.getRewardPoints() : 0)
                .walletBalance(user.getWalletBalance() != null ? user.getWalletBalance() : 0.0)
                .referralCode(user.getReferralCode())
                .referredBy(user.getReferredBy())
                .joinedAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .lastLoginIp(user.getLastLoginIp())
                .lastLoginDevice(user.getLastLoginDevice())
                .failedLoginAttempts(user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() : 0)
                .totalOrders((int) totalOrders)
                .totalSpent(totalSpent)
                .averageOrderValue(avgOrderValue)
                .addresses(addresses)
                .wishlistItems(wishlistItems)
                .rewardSummary(rewardSummary)
                .recentOrders(recentOrders)
                .build();
    }

    // ============ LOCK / UNLOCK ============

    @Transactional
    public UserDto lockAccount(Long customerId, String reason, Long adminId, String adminEmail,
                               String adminName, String adminRole, String adminIp) {
        User user = findUserById(customerId);
        user.setIsAccountLocked(true);
        user.setLockoutEnd(null);
        user = userRepository.save(user);

        log.warn("Account locked by admin: customer={}, reason={}", customerId, reason);

        auditLogService.recordAudit(AuditLogService.AuditLogEntry.builder()
                .action("ACCOUNT_LOCKED")
                .actionLabel("Account Locked")
                .description(String.format("Admin locked account of %s %s. Reason: %s",
                        user.getFirstName(), user.getLastName(), reason))
                .changes(toJson(Map.of("isAccountLocked", "false→true", "reason", reason)))
                .actorId(adminId)
                .actorEmail(adminEmail)
                .actorName(adminName)
                .actorRole(adminRole)
                .actorIp(adminIp)
                .targetId(customerId)
                .targetEmail(user.getEmail())
                .targetName(user.getFullName())
                .resource("USER")
                .resourceId(String.valueOf(customerId))
                .severity("WARNING")
                .isSuccess(true)
                .build());

        return mapToUserDto(user);
    }

    @Transactional
    public UserDto unlockAccount(Long customerId, Long adminId, String adminEmail,
                                 String adminName, String adminRole, String adminIp) {
        User user = findUserById(customerId);
        user.setIsAccountLocked(false);
        user.setFailedLoginAttempts(0);
        user.setLockoutEnd(null);
        user = userRepository.save(user);

        log.info("Account unlocked by admin: customer={}", customerId);

        auditLogService.recordAudit(AuditLogService.AuditLogEntry.builder()
                .action("ACCOUNT_UNLOCKED")
                .actionLabel("Account Unlocked")
                .description(String.format("Admin unlocked account of %s %s",
                        user.getFirstName(), user.getLastName()))
                .changes(toJson(Map.of(
                        "isAccountLocked", "true→false",
                        "failedLoginAttempts", "reset→0")))
                .actorId(adminId)
                .actorEmail(adminEmail)
                .actorName(adminName)
                .actorRole(adminRole)
                .actorIp(adminIp)
                .targetId(customerId)
                .targetEmail(user.getEmail())
                .targetName(user.getFullName())
                .resource("USER")
                .resourceId(String.valueOf(customerId))
                .severity("INFO")
                .isSuccess(true)
                .build());

        return mapToUserDto(user);
    }

    // ============ IMPERSONATION ============

    public ImpersonationResponse impersonateUser(Long customerId, Long adminId, String adminEmail,
                                                   String adminName, String adminRole, String adminIp) {
        User user = findUserById(customerId);

        String accessToken = jwtTokenProvider.generateAccessTokenFromUserId(
                user.getId(), user.getEmail(), user.getRole().name());

        UserDto userDto = mapToUserDto(user);

        log.warn("Admin impersonation: admin={} impersonating customer={} (email={})",
                adminId, customerId, user.getEmail());

        auditLogService.recordAudit(AuditLogService.AuditLogEntry.builder()
                .action("IMPERSONATION")
                .actionLabel("User Impersonation")
                .description(String.format("Admin impersonated customer %s %s (%s)",
                        user.getFirstName(), user.getLastName(), user.getEmail()))
                .actorId(adminId)
                .actorEmail(adminEmail)
                .actorName(adminName)
                .actorRole(adminRole)
                .actorIp(adminIp)
                .targetId(customerId)
                .targetEmail(user.getEmail())
                .targetName(user.getFullName())
                .resource("USER")
                .resourceId(String.valueOf(customerId))
                .severity("CRITICAL")
                .isSuccess(true)
                .build());

        return ImpersonationResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .user(userDto)
                .build();
    }

    // ============ REWARD POINTS ADJUSTMENT ============

    @Transactional
    public RewardTransactionResponse adjustRewardPoints(Long customerId, Long adminId, String adminEmail,
                                                         String adminName, String adminRole, String adminIp,
                                                         AdminPointAdjustmentRequest request) {
        String adjustmentType = request.getAdjustmentType().toUpperCase();

        if (!"ADD".equals(adjustmentType) && !"DEDUCT".equals(adjustmentType)) {
            throw new BadRequestException("Adjustment type must be 'ADD' or 'DEDUCT'");
        }

        String description = String.format("Admin adjustment (%s): %s [by admin %d]",
                adjustmentType, request.getReason(), adminId);

        RewardTransactionResponse result;
        if ("ADD".equals(adjustmentType)) {
            result = rewardService.addPoints(customerId, request.getPoints(),
                    "ADMIN_ADJUSTMENT", String.valueOf(adminId), description);
        } else {
            result = rewardService.redeemPoints(customerId, request.getPoints(), description);
        }

        User user = findUserById(customerId);
        String changes = toJson(Map.of(
                "adjustmentType", adjustmentType,
                "points", request.getPoints(),
                "reason", request.getReason(),
                "newBalance", user.getRewardPoints() != null ? user.getRewardPoints() : 0));

        auditLogService.recordAudit(AuditLogService.AuditLogEntry.builder()
                .action("POINTS_ADJUSTMENT")
                .actionLabel("Reward Points Adjustment")
                .description(String.format("Admin %s %d points to/from %s %s. Reason: %s",
                        "ADD".equals(adjustmentType) ? "added" : "deducted",
                        request.getPoints(), user.getFirstName(), user.getLastName(),
                        request.getReason()))
                .changes(changes)
                .actorId(adminId)
                .actorEmail(adminEmail)
                .actorName(adminName)
                .actorRole(adminRole)
                .actorIp(adminIp)
                .targetId(customerId)
                .targetEmail(user.getEmail())
                .targetName(user.getFullName())
                .resource("REWARD")
                .resourceId(String.valueOf(customerId))
                .severity("INFO")
                .isSuccess(true)
                .build());

        return result;
    }

    // ============ HELPERS ============

    private User findUserById(Long userId) {
        return userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private AdminCustomerListItemResponse mapToListItem(User user) {
        long orderCount = orderRepository.countByUserId(user.getId());
        double totalSpent = orderRepository.getTotalSpentByUserId(user.getId());
        String status = Boolean.TRUE.equals(user.getIsAccountLocked()) ? "LOCKED"
                : Boolean.FALSE.equals(user.getIsActive()) ? "INACTIVE" : "ACTIVE";

        return AdminCustomerListItemResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .displayName(user.getDisplayName())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .status(status)
                .emailVerified(Boolean.TRUE.equals(user.getIsEmailVerified()))
                .phoneVerified(Boolean.TRUE.equals(user.getIsPhoneVerified()))
                .accountLocked(Boolean.TRUE.equals(user.getIsAccountLocked()))
                .twoFactorEnabled(Boolean.TRUE.equals(user.getTwoFactorEnabled()))
                .totalOrders((int) orderCount)
                .totalSpent(totalSpent)
                .rewardPoints(user.getRewardPoints() != null ? user.getRewardPoints() : 0)
                .walletBalance(user.getWalletBalance() != null ? user.getWalletBalance() : 0.0)
                .referralCode(user.getReferralCode())
                .joinedAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .displayName(user.getDisplayName())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .emailVerified(Boolean.TRUE.equals(user.getIsEmailVerified()))
                .phoneVerified(Boolean.TRUE.equals(user.getIsPhoneVerified()))
                .rewardPoints(user.getRewardPoints() != null ? user.getRewardPoints() : 0)
                .walletBalance(user.getWalletBalance() != null ? user.getWalletBalance() : 0.0)
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    private AddressResponse mapAddressToResponse(com.ecom.backend.entity.Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .alternatePhone(address.getAlternatePhone())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .landmark(address.getLandmark())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .country(address.getCountry())
                .isDefault(address.getIsDefault())
                .addressType(address.getAddressType())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .createdAt(address.getCreatedAt())
                .build();
    }

    private WishlistItemResponse mapWishlistToResponse(WishlistItem item) {
        com.ecom.backend.entity.Product product = item.getProduct();
        String imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().iterator().next().getImageUrl() : null;

        return WishlistItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .productImage(imageUrl)
                .brand(product.getBrand() != null ? product.getBrand().getName() : null)
                .price(product.getSellingPrice())
                .originalPrice(product.getBasePrice())
                .discount(product.getDiscountPercentage())
                .rating(product.getAverageRating())
                .reviewCount(product.getRatingCount())
                .inStock(product.getAvailableStock() > 0)
                .notes(item.getNotes())
                .createdAt(item.getCreatedAt())
                .build();
    }

    private String getSortField(String sortBy) {
        return switch (sortBy != null ? sortBy.toLowerCase() : "createdAt") {
            case "name" -> "firstName";
            case "email" -> "email";
            case "orders" -> "createdAt";
            case "spent" -> "createdAt";
            case "joined" -> "createdAt";
            default -> "createdAt";
        };
    }

    private String toJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize audit changes to JSON", e);
            return "{}";
        }
    }
}
