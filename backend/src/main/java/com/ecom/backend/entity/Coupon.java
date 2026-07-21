package com.ecom.backend.entity;

import com.ecom.backend.entity.enums.CouponType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "coupons")
public class Coupon extends BaseEntity {

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "coupon_type", nullable = false)
    private CouponType couponType;

    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @Column(name = "minimum_order_amount")
    private Double minimumOrderAmount = 0.0;

    @Column(name = "maximum_discount_amount")
    private Double maximumDiscountAmount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "usage_limit_per_user")
    private Integer usageLimitPerUser = 1;

    @Column(name = "total_used_count")
    private Integer totalUsedCount = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "is_first_order_only")
    private Boolean isFirstOrderOnly = false;

    @Column(name = "is_new_user_only")
    private Boolean isNewUserOnly = false;

    @Column(name = "applicable_categories")
    private String applicableCategories; // Comma-separated category IDs

    @Column(name = "applicable_products")
    private String applicableProducts; // Comma-separated product IDs

    @Column(name = "excluded_products")
    private String excludedProducts; // Comma-separated product IDs

    @Column(name = "minimum_item_quantity")
    private Integer minimumItemQuantity = 1;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "coupon_metadata", columnDefinition = "TEXT")
    private String couponMetadata;
}
