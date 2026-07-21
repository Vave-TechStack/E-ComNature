package com.ecom.backend.service;

import com.ecom.backend.dto.request.CouponRequest;
import com.ecom.backend.dto.response.CouponResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.Coupon;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.CouponMapper;
import com.ecom.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;

    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        if (couponRepository.findByCodeAndIsDeletedFalse(request.getCode()).isPresent()) {
            throw new BadRequestException("Coupon with code '" + request.getCode() + "' already exists");
        }
        Coupon coupon = couponMapper.toEntity(request);
        coupon = couponRepository.save(coupon);
        return couponMapper.toResponse(coupon);
    }

    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        couponMapper.updateEntity(coupon, request);
        coupon = couponRepository.save(coupon);
        return couponMapper.toResponse(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        coupon.setIsActive(false);
        coupon.softDelete();
        couponRepository.save(coupon);
    }

    public CouponResponse getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCodeAndIsDeletedFalse(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + code));
        return couponMapper.toResponse(coupon);
    }

    public CouponResponse validateCoupon(String code, Double orderAmount) {
        Coupon coupon = couponRepository.findByCodeAndIsDeletedFalse(code)
                .orElseThrow(() -> new BadRequestException("Invalid coupon code"));

        if (!coupon.getIsActive()) {
            throw new BadRequestException("Coupon is no longer active");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new BadRequestException("Coupon has expired");
        }

        if (coupon.getUsageLimit() != null && coupon.getTotalUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Coupon usage limit exceeded");
        }

        if (coupon.getMinimumOrderAmount() != null && orderAmount < coupon.getMinimumOrderAmount()) {
            throw new BadRequestException("Minimum order amount of " + coupon.getMinimumOrderAmount() + " required");
        }

        return couponMapper.toResponse(coupon);
    }

    public List<CouponResponse> getValidCoupons() {
        List<Coupon> coupons = couponRepository.findValidCoupons(LocalDateTime.now());
        return couponMapper.toResponseList(coupons);
    }

    public PagedResponse<CouponResponse> getAllCoupons(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Coupon> couponPage = couponRepository.findByIsDeletedFalse(pageable);
        return PagedResponse.<CouponResponse>builder()
                .content(couponMapper.toResponseList(couponPage.getContent()))
                .page(couponPage.getNumber())
                .size(couponPage.getSize())
                .totalElements(couponPage.getTotalElements())
                .totalPages(couponPage.getTotalPages())
                .first(couponPage.isFirst())
                .last(couponPage.isLast())
                .build();
    }

    public PagedResponse<CouponResponse> searchCoupons(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Coupon> couponPage = couponRepository.searchCoupons(search, pageable);
        return PagedResponse.<CouponResponse>builder()
                .content(couponMapper.toResponseList(couponPage.getContent()))
                .page(couponPage.getNumber())
                .size(couponPage.getSize())
                .totalElements(couponPage.getTotalElements())
                .totalPages(couponPage.getTotalPages())
                .first(couponPage.isFirst())
                .last(couponPage.isLast())
                .build();
    }
}
