package com.ecom.backend.controller;

import com.ecom.backend.dto.request.WishlistRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.WishlistItemResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Wishlist", description = "Wishlist API")
@RestController
@RequestMapping("/profile/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @Operation(summary = "Get Wishlist", description = "Get Wishlist")
    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItemResponse>>> getWishlist(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<WishlistItemResponse> items = wishlistService.getUserWishlist(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @Operation(summary = "Get Wishlist Count", description = "Get Wishlist Count")
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getWishlistCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        long count = wishlistService.getWishlistCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @Operation(summary = "Get Wishlist Product Ids", description = "Get Wishlist Product Ids")
    @GetMapping("/product-ids")
    public ResponseEntity<ApiResponse<Set<Long>>> getWishlistProductIds(
            @AuthenticationPrincipal UserPrincipal principal) {
        Set<Long> ids = wishlistService.getWishlistProductIds(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(ids));
    }

    @Operation(summary = "Check In Wishlist", description = "Check In Wishlist")
    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkInWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(principal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }

    @Operation(summary = "Add To Wishlist", description = "Add To Wishlist")
    @PostMapping
    public ResponseEntity<ApiResponse<WishlistItemResponse>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody WishlistRequest request) {
        WishlistItemResponse item = wishlistService.addToWishlist(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Added to wishlist", item));
    }

    @Operation(summary = "Remove From Wishlist", description = "Remove From Wishlist")
    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId) {
        wishlistService.removeFromWishlist(principal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist"));
    }

    @Operation(summary = "Remove By Product", description = "Remove By Product")
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeByProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        wishlistService.removeByProduct(principal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist"));
    }

    @Operation(summary = "Clear Wishlist", description = "Clear Wishlist")
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearWishlist(
            @AuthenticationPrincipal UserPrincipal principal) {
        wishlistService.clearWishlist(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Wishlist cleared"));
    }

    @Operation(summary = "Move To Cart", description = "Move To Cart")
    @PostMapping("/{itemId}/move-to-cart")
    public ResponseEntity<ApiResponse<WishlistItemResponse>> moveToCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId) {
        WishlistItemResponse item = wishlistService.moveToCart(principal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Moved to cart", item));
    }
}
