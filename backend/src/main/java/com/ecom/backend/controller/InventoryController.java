package com.ecom.backend.controller;

import com.ecom.backend.dto.request.InventoryRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.InventoryResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Inventory", description = "Inventory API")
@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
public class InventoryController {

    private final InventoryService inventoryService;

    @Operation(summary = "Adjust Stock", description = "Adjust Stock")
    @PostMapping("/adjust")
    public ResponseEntity<ApiResponse<InventoryResponse>> adjustStock(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.adjustStock(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Stock adjusted successfully", response));
    }

    @Operation(summary = "Get Stock Movements", description = "Get Stock Movements")
    @GetMapping("/movements/{productId}")
    public ResponseEntity<ApiResponse<PagedResponse<InventoryResponse>>> getStockMovements(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<InventoryResponse> response = inventoryService.getStockMovements(productId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Stock movements fetched", response));
    }

    @Operation(summary = "Get Low Stock Products", description = "Get Low Stock Products")
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<String>>> getLowStockProducts() {
        List<Product> lowStockProducts = inventoryService.getLowStockProducts();
        List<String> productNames = lowStockProducts.stream()
                .map(p -> p.getName() + " (Stock: " + p.getAvailableStock() + ")")
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Low stock products", productNames));
    }
}
