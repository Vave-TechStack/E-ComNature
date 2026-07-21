package com.ecom.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    private Long billingAddressId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String couponCode;

    private String notes;

    private Boolean isGiftWrap = false;

    private String giftMessage;

    private Boolean isCod = false;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        private Long variantId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        private Double unitPrice;
    }
}
