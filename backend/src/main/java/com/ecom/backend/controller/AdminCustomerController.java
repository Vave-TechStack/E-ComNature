package com.ecom.backend.controller;

import com.ecom.backend.dto.request.AdminPointAdjustmentRequest;
import com.ecom.backend.dto.response.*;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.AdminCustomerService;
import com.ecom.backend.service.AdminDashboardService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Admin Customers", description = "Admin Customers API")
@RestController
@RequestMapping("/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;
    private final AdminDashboardService adminDashboardService;

    @Operation(summary = "List Customers", description = "List Customers")
    @GetMapping
    public ResponseEntity<ApiResponse<AdminCustomerPageResponse>> listCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean locked,
            @RequestParam(defaultValue = "joined") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        AdminCustomerPageResponse response = adminCustomerService.listCustomers(
                search, status, locked, sortBy, sortDir, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "Get Customer Detail", description = "Get Customer Detail")
    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<AdminCustomerDetailResponse>> getCustomerDetail(
            @PathVariable Long customerId) {
        AdminCustomerDetailResponse detail = adminCustomerService.getCustomerDetail(customerId);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @Operation(summary = "Lock Account", description = "Lock Account")
    @PostMapping("/{customerId}/lock")
    public ResponseEntity<ApiResponse<UserDto>> lockAccount(
            @PathVariable Long customerId,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        String reason = body != null ? body.getOrDefault("reason", "Admin action") : "Admin action";
        UserDto user = adminCustomerService.lockAccount(
                customerId, reason,
                principal.getId(), principal.getEmail(),
                principal.getFirstName() + " " + principal.getLastName(),
                principal.getRole().name(),
                request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Account locked successfully", user));
    }

    @Operation(summary = "Unlock Account", description = "Unlock Account")
    @PostMapping("/{customerId}/unlock")
    public ResponseEntity<ApiResponse<UserDto>> unlockAccount(
            @PathVariable Long customerId,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        UserDto user = adminCustomerService.unlockAccount(
                customerId,
                principal.getId(), principal.getEmail(),
                principal.getFirstName() + " " + principal.getLastName(),
                principal.getRole().name(),
                request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Account unlocked successfully", user));
    }

    @Operation(summary = "Impersonate", description = "Impersonate")
    @PostMapping("/{customerId}/impersonate")
    public ResponseEntity<ApiResponse<ImpersonationResponse>> impersonate(
            @PathVariable Long customerId,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        ImpersonationResponse response = adminCustomerService.impersonateUser(
                customerId,
                principal.getId(), principal.getEmail(),
                principal.getFirstName() + " " + principal.getLastName(),
                principal.getRole().name(),
                request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Impersonation token generated", response));
    }

    @Operation(summary = "Adjust Reward Points", description = "Adjust Reward Points")
    @PostMapping("/{customerId}/rewards")
    public ResponseEntity<ApiResponse<RewardTransactionResponse>> adjustRewardPoints(
            @PathVariable Long customerId,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request,
            @Valid @RequestBody AdminPointAdjustmentRequest req) {
        RewardTransactionResponse transaction = adminCustomerService.adjustRewardPoints(
                customerId,
                principal.getId(), principal.getEmail(),
                principal.getFirstName() + " " + principal.getLastName(),
                principal.getRole().name(),
                request.getRemoteAddr(),
                req);
        String message = "ADD".equalsIgnoreCase(req.getAdjustmentType())
                ? "Points added successfully" : "Points deducted successfully";
        return ResponseEntity.ok(ApiResponse.success(message, transaction));
    }

    @Operation(summary = "Toggle Customer Status", description = "Activate or deactivate a customer account")
    @PutMapping("/{customerId}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleCustomerStatus(
            @PathVariable Long customerId,
            @RequestParam boolean active) {
        Map<String, Object> result = adminDashboardService.toggleCustomerStatus(customerId, active);
        return ResponseEntity.ok(ApiResponse.success("Customer status updated", result));
    }

    @Operation(summary = "Customer Stats", description = "Customer Stats")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerStats() {
        long totalCustomers = 0;
        long activeToday = 0;
        long newThisMonth = 0;
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "totalCustomers", totalCustomers,
                "activeToday", activeToday,
                "newThisMonth", newThisMonth
        )));
    }
}
