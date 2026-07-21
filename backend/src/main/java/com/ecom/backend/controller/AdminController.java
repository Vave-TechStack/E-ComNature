package com.ecom.backend.controller;

import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Admin Dashboard", description = "Admin Dashboard API")
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminDashboardService adminDashboardService;

    @Operation(summary = "Execute", description = "Execute")
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
    }

    @Operation(summary = "Execute", description = "Execute")
    @GetMapping("/dashboard/revenue-chart")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueChart(
            @RequestParam(defaultValue = "12") int months) {
        Map<String, Object> chartData = adminDashboardService.getRevenueChart(months);
        return ResponseEntity.ok(ApiResponse.success("Revenue chart data fetched", chartData));
    }

    @Operation(summary = "Execute", description = "Execute")
    @GetMapping("/dashboard/recent-orders")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit) {
        Map<String, Object> orders = adminDashboardService.getRecentOrders(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent orders fetched", orders));
    }

    @Operation(summary = "Execute", description = "Execute")
    @GetMapping("/dashboard/top-products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit) {
        Map<String, Object> products = adminDashboardService.getTopProducts(limit);
        return ResponseEntity.ok(ApiResponse.success("Top products fetched", products));
    }

    @Operation(summary = "Execute", description = "Execute")
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        Map<String, Object> result = adminDashboardService.getAllProducts(page, size, search, categoryId);
        return ResponseEntity.ok(ApiResponse.success("Products fetched", result));
    }

    @Operation(summary = "Execute", description = "Execute")
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Map<String, Object> result = adminDashboardService.getAllOrders(page, size, status);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", result));
    }


}
