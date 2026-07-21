package com.ecom.backend.controller;

import com.ecom.backend.dto.request.OrderRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.OrderResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.enums.OrderStatus;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Orders", description = "Orders API")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Create Order", description = "Create Order")
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", response));
    }

    @Operation(summary = "Get Order By Id", description = "Get Order By Id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", response));
    }

    @Operation(summary = "Get Order By Number", description = "Get Order By Number")
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", response));
    }

    @Operation(summary = "Get User Orders", description = "Get User Orders")
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<OrderResponse> response = orderService.getUserOrders(principal.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", response));
    }

    @Operation(summary = "Get All Orders", description = "Get All Orders")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        PagedResponse<OrderResponse> response = orderService.getAllOrders(page, size, status);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", response));
    }

    @Operation(summary = "Update Order Status", description = "Update Order Status")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF', 'DELIVERY_STAFF')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            @RequestParam(required = false) String notes) {
        OrderResponse response = orderService.updateOrderStatus(id, status, notes);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", response));
    }
}
