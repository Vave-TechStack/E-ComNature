package com.ecom.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeliveryResponse {
    private Long orderId;
    private String orderNumber;
    private String status;
    private String trackingNumber;
    private String deliveryPartner;
    private String deliveryPartnerPhone;
    private Double deliveryPartnerLat;
    private Double deliveryPartnerLng;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime deliveredAt;
}
