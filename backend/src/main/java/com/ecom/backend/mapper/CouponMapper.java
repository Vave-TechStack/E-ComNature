package com.ecom.backend.mapper;

import com.ecom.backend.dto.request.CouponRequest;
import com.ecom.backend.dto.response.CouponResponse;
import com.ecom.backend.entity.Coupon;
import com.ecom.backend.entity.enums.CouponType;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CouponMapper {

    public Coupon toEntity(CouponRequest request) {
        if (request == null) return null;
        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setCouponType(CouponType.valueOf(request.getCouponType()));
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupon.setMaximumDiscountAmount(request.getMaximumDiscountAmount());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setUsageLimitPerUser(request.getUsageLimitPerUser());
        coupon.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setIsFirstOrderOnly(request.getIsFirstOrderOnly());
        coupon.setIsNewUserOnly(request.getIsNewUserOnly());
        coupon.setApplicableCategories(request.getApplicableCategories());
        coupon.setApplicableProducts(request.getApplicableProducts());
        coupon.setExcludedProducts(request.getExcludedProducts());
        coupon.setMinimumItemQuantity(request.getMinimumItemQuantity());
        return coupon;
    }

    public void updateEntity(Coupon coupon, CouponRequest request) {
        if (request.getCode() != null) coupon.setCode(request.getCode());
        if (request.getDescription() != null) coupon.setDescription(request.getDescription());
        if (request.getCouponType() != null) coupon.setCouponType(CouponType.valueOf(request.getCouponType()));
        if (request.getDiscountValue() != null) coupon.setDiscountValue(request.getDiscountValue());
        if (request.getMinimumOrderAmount() != null) coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        if (request.getMaximumDiscountAmount() != null) coupon.setMaximumDiscountAmount(request.getMaximumDiscountAmount());
        if (request.getUsageLimit() != null) coupon.setUsageLimit(request.getUsageLimit());
        if (request.getUsageLimitPerUser() != null) coupon.setUsageLimitPerUser(request.getUsageLimitPerUser());
        if (request.getIsActive() != null) coupon.setIsActive(request.getIsActive());
        if (request.getValidFrom() != null) coupon.setValidFrom(request.getValidFrom());
        if (request.getValidUntil() != null) coupon.setValidUntil(request.getValidUntil());
        if (request.getIsFirstOrderOnly() != null) coupon.setIsFirstOrderOnly(request.getIsFirstOrderOnly());
        if (request.getIsNewUserOnly() != null) coupon.setIsNewUserOnly(request.getIsNewUserOnly());
        if (request.getApplicableCategories() != null) coupon.setApplicableCategories(request.getApplicableCategories());
        if (request.getApplicableProducts() != null) coupon.setApplicableProducts(request.getApplicableProducts());
        if (request.getExcludedProducts() != null) coupon.setExcludedProducts(request.getExcludedProducts());
        if (request.getMinimumItemQuantity() != null) coupon.setMinimumItemQuantity(request.getMinimumItemQuantity());
    }

    public CouponResponse toResponse(Coupon coupon) {
        if (coupon == null) return null;
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .couponType(coupon.getCouponType() != null ? coupon.getCouponType().name() : null)
                .discountValue(coupon.getDiscountValue())
                .minimumOrderAmount(coupon.getMinimumOrderAmount())
                .maximumDiscountAmount(coupon.getMaximumDiscountAmount())
                .usageLimit(coupon.getUsageLimit())
                .usageLimitPerUser(coupon.getUsageLimitPerUser())
                .totalUsedCount(coupon.getTotalUsedCount())
                .isActive(coupon.getIsActive())
                .validFrom(coupon.getValidFrom())
                .validUntil(coupon.getValidUntil())
                .isFirstOrderOnly(coupon.getIsFirstOrderOnly())
                .isNewUserOnly(coupon.getIsNewUserOnly())
                .build();
    }

    public List<CouponResponse> toResponseList(List<Coupon> coupons) {
        if (coupons == null) return Collections.emptyList();
        return coupons.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
