package com.ecom.backend.controller;

import com.ecom.backend.dto.request.CouponRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.CouponResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Coupons", description = "Coupons API")
@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @Operation(summary = "Create Coupon", description = "Create Coupon")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created successfully", response));
    }

    @Operation(summary = "Update Coupon", description = "Update Coupon")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(@PathVariable Long id,
                                                                     @Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", response));
    }

    @Operation(summary = "Delete Coupon", description = "Delete Coupon")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }

    @Operation(summary = "Get Coupon By Code", description = "Get Coupon By Code")
    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponByCode(@PathVariable String code) {
        CouponResponse response = couponService.getCouponByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Coupon fetched", response));
    }

    @Operation(summary = "Validate Coupon", description = "Validate Coupon")
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponResponse>> validateCoupon(@RequestParam String code,
                                                                       @RequestParam Double orderAmount) {
        CouponResponse response = couponService.validateCoupon(code, orderAmount);
        return ResponseEntity.ok(ApiResponse.success("Coupon is valid", response));
    }

    @Operation(summary = "Get Valid Coupons", description = "Get Valid Coupons")
    @GetMapping("/valid")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getValidCoupons() {
        List<CouponResponse> coupons = couponService.getValidCoupons();
        return ResponseEntity.ok(ApiResponse.success("Valid coupons fetched", coupons));
    }

    @Operation(summary = "Get All Coupons", description = "Get All Coupons")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<CouponResponse>>> getAllCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<CouponResponse> response = couponService.getAllCoupons(page, size);
        return ResponseEntity.ok(ApiResponse.success("Coupons fetched", response));
    }

    @Operation(summary = "Search Coupons", description = "Search Coupons")
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<CouponResponse>>> searchCoupons(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<CouponResponse> response = couponService.searchCoupons(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results", response));
    }
}
