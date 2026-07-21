package com.ecom.backend.controller;

import com.ecom.backend.dto.request.ReviewRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.dto.response.ReviewResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Reviews", description = "Reviews API")
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Create Review", description = "Create Review")
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review created successfully", response));
    }

    @Operation(summary = "Get Product Reviews", description = "Get Product Reviews")
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ReviewResponse> response = reviewService.getProductReviews(productId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", response));
    }

    @Operation(summary = "Get User Reviews", description = "Get User Reviews")
    @GetMapping("/my-reviews")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getUserReviews(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ReviewResponse> response = reviewService.getUserReviews(principal.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Your reviews fetched", response));
    }

    @Operation(summary = "Get Pending Reviews", description = "Get Pending Reviews")
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getPendingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ReviewResponse> response = reviewService.getPendingReviews(page, size);
        return ResponseEntity.ok(ApiResponse.success("Pending reviews fetched", response));
    }

    @Operation(summary = "Approve Review", description = "Approve Review")
    @PutMapping("/{reviewId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> approveReview(@PathVariable Long reviewId) {
        ReviewResponse response = reviewService.approveReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review approved", response));
    }

    @Operation(summary = "Delete Review", description = "Delete Review")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
