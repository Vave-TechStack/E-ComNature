package com.ecom.backend.controller;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Addresses", description = "Addresses API")
@RestController
@RequestMapping("/profile/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Get Addresses", description = "Get Addresses")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<AddressResponse> addresses = addressService.getUserAddresses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @Operation(summary = "Get Address", description = "Get Address")
    @GetMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> getAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        AddressResponse address = addressService.getAddress(principal.getId(), addressId);
        return ResponseEntity.ok(ApiResponse.success(address));
    }

    @Operation(summary = "Create Address", description = "Create Address")
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse created = addressService.createAddress(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address created successfully", created));
    }

    @Operation(summary = "Update Address", description = "Update Address")
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse updated = addressService.updateAddress(principal.getId(), addressId, request);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @Operation(summary = "Delete Address", description = "Delete Address")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        addressService.deleteAddress(principal.getId(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully"));
    }

    @Operation(summary = "Set Default Address", description = "Set Default Address")
    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        AddressResponse updated = addressService.setDefaultAddress(principal.getId(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Default address updated", updated));
    }
}
