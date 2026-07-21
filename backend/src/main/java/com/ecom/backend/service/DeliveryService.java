package com.ecom.backend.service;

import com.ecom.backend.dto.request.DeliveryRequest;
import com.ecom.backend.dto.response.DeliveryResponse;
import com.ecom.backend.entity.Order;
import com.ecom.backend.entity.enums.OrderStatus;
import com.ecom.backend.entity.OrderStatusHistory;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final OrderRepository orderRepository;

    @Transactional
    public DeliveryResponse assignDelivery(DeliveryRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setTrackingNumber(request.getTrackingNumber());
        order.setDeliveryPartner(request.getDeliveryPartner());
        order.setDeliveryPartnerPhone(request.getDeliveryPartnerPhone());
        order.setDeliveryPartnerLat(request.getDeliveryPartnerLat());
        order.setDeliveryPartnerLng(request.getDeliveryPartnerLng());
        order.setStatus(OrderStatus.SHIPPED);

        if (request.getStatus() != null) {
            order.setStatus(OrderStatus.valueOf(request.getStatus()));
        }

        if (order.getStatus() == OrderStatus.SHIPPED) {
            order.setDeliveryEstimate(LocalDateTime.now().plusDays(3));
        } else if (order.getStatus() == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setToStatus(order.getStatus());
        history.setChangedBy("DELIVERY_SYSTEM");
        history.setNotes("Delivery assigned to " + request.getDeliveryPartner());
        order.getStatusHistory().add(history);

        order = orderRepository.save(order);
        return toResponse(order);
    }

    @Transactional
    public DeliveryResponse updateDeliveryLocation(Long orderId, Double lat, Double lng) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setDeliveryPartnerLat(lat);
        order.setDeliveryPartnerLng(lng);
        orderRepository.save(order);
        return toResponse(order);
    }

    public DeliveryResponse getDeliveryStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toResponse(order);
    }

    public DeliveryResponse getDeliveryByTracking(String trackingNumber) {
        Order order = orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with tracking: " + trackingNumber));
        return toResponse(order);
    }

    private DeliveryResponse toResponse(Order order) {
        return DeliveryResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus() != null ? order.getStatus().name() : null)
                .trackingNumber(order.getTrackingNumber())
                .deliveryPartner(order.getDeliveryPartner())
                .deliveryPartnerPhone(order.getDeliveryPartnerPhone())
                .deliveryPartnerLat(order.getDeliveryPartnerLat())
                .deliveryPartnerLng(order.getDeliveryPartnerLng())
                .estimatedDelivery(order.getDeliveryEstimate())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }
}
