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

@RestController
@RequestMapping("/profile/payments")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    // ============ CARDS ============

    @GetMapping("/cards")
    public ResponseEntity<ApiResponse<List<SavedCardResponse>>> getSavedCards(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<SavedCardResponse> cards = paymentMethodService.getSavedCards(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(cards));
    }

    @PostMapping("/cards")
    public ResponseEntity<ApiResponse<SavedCardResponse>> saveCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SavedCardRequest request) {
        SavedCardResponse card = paymentMethodService.saveCard(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Card saved successfully", card));
    }

    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<ApiResponse<Void>> deleteCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long cardId) {
        paymentMethodService.deleteCard(principal.getId(), cardId);
        return ResponseEntity.ok(ApiResponse.success("Card deleted successfully"));
    }

    @PutMapping("/cards/{cardId}/default")
    public ResponseEntity<ApiResponse<SavedCardResponse>> setDefaultCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long cardId) {
        SavedCardResponse card = paymentMethodService.setDefaultCard(principal.getId(), cardId);
        return ResponseEntity.ok(ApiResponse.success("Default card updated", card));
    }

    // ============ UPIS ============

    @GetMapping("/upis")
    public ResponseEntity<ApiResponse<List<SavedUPIResponse>>> getSavedUPIs(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<SavedUPIResponse> upis = paymentMethodService.getSavedUPIs(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(upis));
    }

    @PostMapping("/upis")
    public ResponseEntity<ApiResponse<SavedUPIResponse>> saveUPI(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SavedUPIRequest request) {
        SavedUPIResponse upi = paymentMethodService.saveUPI(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("UPI saved successfully", upi));
    }

    @DeleteMapping("/upis/{upiId}")
    public ResponseEntity<ApiResponse<Void>> deleteUPI(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long upiId) {
        paymentMethodService.deleteUPI(principal.getId(), upiId);
        return ResponseEntity.ok(ApiResponse.success("UPI deleted successfully"));
    }

    @PutMapping("/upis/{upiId}/default")
    public ResponseEntity<ApiResponse<SavedUPIResponse>> setDefaultUPI(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long upiId) {
        SavedUPIResponse upi = paymentMethodService.setDefaultUPI(principal.getId(), upiId);
        return ResponseEntity.ok(ApiResponse.success("Default UPI updated", upi));
    }
}
