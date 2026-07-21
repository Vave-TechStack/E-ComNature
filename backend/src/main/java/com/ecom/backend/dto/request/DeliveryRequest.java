package com.ecom.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;
    @NotBlank(message = "Tracking number is required")
    private String trackingNumber;
    @NotBlank(message = "Delivery partner is required")
    private String deliveryPartner;
    private String deliveryPartnerPhone;
    private Double deliveryPartnerLat;
    private Double deliveryPartnerLng;
    private String status;
}
