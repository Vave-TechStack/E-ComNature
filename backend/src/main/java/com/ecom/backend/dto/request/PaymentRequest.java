package com.ecom.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @Positive(message = "Amount must be positive")
    private Double amount;

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private String razorpaySignature;

    private String stripeSessionId;

    private String stripePaymentIntentId;

    private String phonepeTransactionId;

    private String upiId;

    private String cardId;

    private Boolean saveCard;

    private String currency;
}
