package com.ecom.backend.controller;

import com.ecom.backend.dto.request.PaymentRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.PaymentResponse;
import com.ecom.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Payments", description = "Payments API")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Create Razorpay Order", description = "Create Razorpay Order")
    @PostMapping("/razorpay/create-order")
    public ResponseEntity<ApiResponse<String>> createRazorpayOrder(@RequestParam Long orderId,
                                                                     @RequestParam Double amount) {
        String razorpayOrderId = paymentService.createRazorpayOrder(orderId, amount);
        return ResponseEntity.ok(ApiResponse.success("Razorpay order created", razorpayOrderId));
    }

    @Operation(summary = "Verify Razorpay Payment", description = "Verify Razorpay Payment")
    @PostMapping("/razorpay/verify")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyRazorpayPayment(
            @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.verifyRazorpayPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified", response));
    }

    @Operation(summary = "Process Refund", description = "Process Refund")
    @PostMapping("/{orderId}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> processRefund(@PathVariable Long orderId) {
        PaymentResponse response = paymentService.processRefund(orderId);
        return ResponseEntity.ok(ApiResponse.success("Refund processed", response));
    }
}
