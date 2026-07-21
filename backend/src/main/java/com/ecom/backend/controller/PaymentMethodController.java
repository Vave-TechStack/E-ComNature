package com.ecom.backend.controller;

import com.ecom.backend.dto.request.SavedCardRequest;
import com.ecom.backend.dto.request.SavedUPIRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.SavedCardResponse;
import com.ecom.backend.dto.response.SavedUPIResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Payment Methods", description = "Payment Methods API")
@RestController
@RequestMapping("/profile/payments")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    // ============ CARDS ============

    @Operation(summary = "Get Saved Cards", description = "Get Saved Cards")
    @GetMapping("/cards")
    public ResponseEntity<ApiResponse<List<SavedCardResponse>>> getSavedCards(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<SavedCardResponse> cards = paymentMethodService.getSavedCards(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(cards));
    }

    @Operation(summary = "Save Card", description = "Save Card")
    @PostMapping("/cards")
    public ResponseEntity<ApiResponse<SavedCardResponse>> saveCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SavedCardRequest request) {
        SavedCardResponse card = paymentMethodService.saveCard(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Card saved successfully", card));
    }

    @Operation(summary = "Delete Card", description = "Delete Card")
    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<ApiResponse<Void>> deleteCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long cardId) {
        paymentMethodService.deleteCard(principal.getId(), cardId);
        return ResponseEntity.ok(ApiResponse.success("Card deleted successfully"));
    }

    @Operation(summary = "Set Default Card", description = "Set Default Card")
    @PutMapping("/cards/{cardId}/default")
    public ResponseEntity<ApiResponse<SavedCardResponse>> setDefaultCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long cardId) {
        SavedCardResponse card = paymentMethodService.setDefaultCard(principal.getId(), cardId);
        return ResponseEntity.ok(ApiResponse.success("Default card updated", card));
    }

    // ============ UPIS ============

    @Operation(summary = "Get Saved Upis", description = "Get Saved Upis")
    @GetMapping("/upis")
    public ResponseEntity<ApiResponse<List<SavedUPIResponse>>> getSavedUPIs(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<SavedUPIResponse> upis = paymentMethodService.getSavedUPIs(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(upis));
    }

    @Operation(summary = "Save Upi", description = "Save Upi")
    @PostMapping("/upis")
    public ResponseEntity<ApiResponse<SavedUPIResponse>> saveUPI(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SavedUPIRequest request) {
        SavedUPIResponse upi = paymentMethodService.saveUPI(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("UPI saved successfully", upi));
    }

    @Operation(summary = "Delete Upi", description = "Delete Upi")
    @DeleteMapping("/upis/{upiId}")
    public ResponseEntity<ApiResponse<Void>> deleteUPI(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long upiId) {
        paymentMethodService.deleteUPI(principal.getId(), upiId);
        return ResponseEntity.ok(ApiResponse.success("UPI deleted successfully"));
    }

    @Operation(summary = "Set Default Upi", description = "Set Default Upi")
    @PutMapping("/upis/{upiId}/default")
    public ResponseEntity<ApiResponse<SavedUPIResponse>> setDefaultUPI(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long upiId) {
        SavedUPIResponse upi = paymentMethodService.setDefaultUPI(principal.getId(), upiId);
        return ResponseEntity.ok(ApiResponse.success("Default UPI updated", upi));
    }
}
