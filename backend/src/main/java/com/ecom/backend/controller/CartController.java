package com.ecom.backend.controller;

import com.ecom.backend.dto.request.CartRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.CartResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Cart", description = "Cart API")
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Get Cart", description = "Get Cart")
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        Long userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.getCart(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", response));
    }

    @Operation(summary = "Add To Cart", description = "Add To Cart")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @Valid @RequestBody CartRequest request) {
        Long userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.addToCart(userId, sessionId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item added to cart", response));
    }

    @Operation(summary = "Update Cart Item", description = "Update Cart Item")
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Long userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.updateCartItem(userId, sessionId, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", response));
    }

    @Operation(summary = "Remove From Cart", description = "Remove From Cart")
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable Long itemId) {
        Long userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.removeFromCart(userId, sessionId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", response));
    }

    @Operation(summary = "Clear Cart", description = "Clear Cart")
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        Long userId = principal != null ? principal.getId() : null;
        cartService.clearCart(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
