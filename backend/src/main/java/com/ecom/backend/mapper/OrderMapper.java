package com.ecom.backend.mapper;

import com.ecom.backend.dto.response.OrderResponse;
import com.ecom.backend.entity.Order;
import com.ecom.backend.entity.OrderItem;
import com.ecom.backend.entity.OrderStatusHistory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        if (order == null) return null;

        OrderResponse response = OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getFullName() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .status(order.getStatus() != null ? order.getStatus().name() : null)
                .subtotal(order.getSubtotal())
                .shippingCharge(order.getShippingCharge())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .couponDiscount(order.getCouponDiscount())
                .giftWrapCharge(order.getGiftWrapCharge())
                .totalAmount(order.getTotalAmount())
                .paidAmount(order.getPaidAmount())
                .dueAmount(order.getDueAmount())
                .currency(order.getCurrency())
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null)
                .couponCode(order.getCouponCode())
                .notes(order.getNotes())
                .isGiftWrap(order.getIsGiftWrap())
                .giftMessage(order.getGiftMessage())
                .deliveryEstimate(order.getDeliveryEstimate())
                .deliveredAt(order.getDeliveredAt())
                .trackingNumber(order.getTrackingNumber())
                .deliveryPartner(order.getDeliveryPartner())
                .invoiceUrl(order.getInvoiceUrl())
                .cancellationReason(order.getCancellationReason())
                .returnReason(order.getReturnReason())
                .refundAmount(order.getRefundAmount())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(toItemResponseList(order.getItems()))
                .statusHistory(toStatusHistoryList(order.getStatusHistory()))
                .build();

        return response;
    }

    private List<OrderResponse.OrderItemResponse> toItemResponseList(java.util.Set<OrderItem> items) {
        if (items == null) return Collections.emptyList();
        return items.stream().map(item -> OrderResponse.OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                .productSlug(item.getProduct() != null ? item.getProduct().getSlug() : null)
                .variantName(item.getVariantInfo())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .discountAmount(item.getDiscountAmount())
                .build()).collect(Collectors.toList());
    }

    private List<OrderResponse.OrderStatusHistoryResponse> toStatusHistoryList(java.util.Set<OrderStatusHistory> history) {
        if (history == null) return Collections.emptyList();
        return history.stream()
                .sorted(Comparator.comparing(OrderStatusHistory::getCreatedAt))
                .map(h -> OrderResponse.OrderStatusHistoryResponse.builder()
                        .id(h.getId())
                        .fromStatus(h.getFromStatus() != null ? h.getFromStatus().name() : null)
                        .toStatus(h.getToStatus() != null ? h.getToStatus().name() : null)
                        .changedBy(h.getChangedBy())
                        .notes(h.getNotes())
                        .createdAt(h.getCreatedAt())
                        .build()).collect(Collectors.toList());
    }

    public List<OrderResponse> toResponseList(List<Order> orders) {
        if (orders == null) return Collections.emptyList();
        return orders.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
