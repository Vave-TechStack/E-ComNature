package com.ecom.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private String userEmail;
    private String status;
    private Double subtotal;
    private Double shippingCharge;
    private Double taxAmount;
    private Double discountAmount;
    private Double couponDiscount;
    private Double giftWrapCharge;
    private Double totalAmount;
    private Double paidAmount;
    private Double dueAmount;
    private String currency;
    private String paymentMethod;
    private String paymentStatus;
    private AddressResponse shippingAddress;
    private AddressResponse billingAddress;
    private String couponCode;
    private String notes;
    private Boolean isGiftWrap;
    private String giftMessage;
    private LocalDateTime deliveryEstimate;
    private LocalDateTime deliveredAt;
    private String trackingNumber;
    private String deliveryPartner;
    private String invoiceUrl;
    private String cancellationReason;
    private String returnReason;
    private Double refundAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;
    private List<OrderStatusHistoryResponse> statusHistory;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productSlug;
        private String productImage;
        private String variantName;
        private Integer quantity;
        private Double unitPrice;
        private Double totalPrice;
        private Double discountAmount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OrderStatusHistoryResponse {
        private Long id;
        private String fromStatus;
        private String toStatus;
        private String changedBy;
        private String notes;
        private LocalDateTime createdAt;
    }
}
