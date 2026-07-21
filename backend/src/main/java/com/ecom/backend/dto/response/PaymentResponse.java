package com.ecom.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {
    private Long orderId;
    private String orderNumber;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String stripeSessionId;
    private String stripePaymentIntentId;
    private String phonepeTransactionId;
    private String redirectUrl;
    private Boolean isSuccess;
    private String message;
}
