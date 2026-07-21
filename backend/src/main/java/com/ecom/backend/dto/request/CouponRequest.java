package com.ecom.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    @NotBlank(message = "Coupon code is required")
    @Size(max = 50, message = "Coupon code must not exceed 50 characters")
    private String code;

    private String description;

    @NotBlank(message = "Coupon type is required")
    private String couponType;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    private Double discountValue;

    @Min(value = 0, message = "Minimum order amount must be non-negative")
    private Double minimumOrderAmount;

    @Min(value = 0, message = "Maximum discount amount must be non-negative")
    private Double maximumDiscountAmount;

    @Min(value = 1, message = "Usage limit must be at least 1")
    private Integer usageLimit;

    @Min(value = 1, message = "Usage limit per user must be at least 1")
    private Integer usageLimitPerUser;

    private Boolean isActive;

    @NotNull(message = "Valid from date is required")
    private LocalDateTime validFrom;

    @NotNull(message = "Valid until date is required")
    private LocalDateTime validUntil;

    private Boolean isFirstOrderOnly;

    private Boolean isNewUserOnly;

    private String applicableCategories;

    private String applicableProducts;

    private String excludedProducts;

    private Integer minimumItemQuantity;
}
