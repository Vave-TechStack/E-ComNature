package com.ecom.backend.controller;

import com.ecom.backend.dto.request.DeliveryRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.DeliveryResponse;
import com.ecom.backend.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Delivery", description = "Delivery API")
@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @Operation(summary = "Assign Delivery", description = "Assign Delivery")
    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<DeliveryResponse>> assignDelivery(@Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.assignDelivery(request);
        return ResponseEntity.ok(ApiResponse.success("Delivery assigned", response));
    }

    @Operation(summary = "Update Location", description = "Update Location")
    @PutMapping("/{orderId}/location")
    @PreAuthorize("hasAnyRole('ADMIN', 'DELIVERY_STAFF')")
    public ResponseEntity<ApiResponse<DeliveryResponse>> updateLocation(
            @PathVariable Long orderId,
            @RequestParam Double lat,
            @RequestParam Double lng) {
        DeliveryResponse response = deliveryService.updateDeliveryLocation(orderId, lat, lng);
        return ResponseEntity.ok(ApiResponse.success("Location updated", response));
    }

    @Operation(summary = "Get Delivery Status", description = "Get Delivery Status")
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<DeliveryResponse>> getDeliveryStatus(@PathVariable Long orderId) {
        DeliveryResponse response = deliveryService.getDeliveryStatus(orderId);
        return ResponseEntity.ok(ApiResponse.success("Delivery status fetched", response));
    }

    @Operation(summary = "Track By Number", description = "Track By Number")
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ApiResponse<DeliveryResponse>> trackByNumber(@PathVariable String trackingNumber) {
        DeliveryResponse response = deliveryService.getDeliveryByTracking(trackingNumber);
        return ResponseEntity.ok(ApiResponse.success("Tracking info fetched", response));
    }
}
