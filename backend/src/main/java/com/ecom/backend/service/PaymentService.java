package com.ecom.backend.service;

import com.ecom.backend.dto.request.PaymentRequest;
import com.ecom.backend.dto.response.PaymentResponse;
import com.ecom.backend.entity.Order;
import com.ecom.backend.entity.enums.OrderStatus;
import com.ecom.backend.entity.enums.PaymentStatus;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    public String createRazorpayOrder(Long orderId, Double amount) {
        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject options = new JSONObject();
            options.put("amount", (long) (amount * 100)); // Amount in paise
            options.put("currency", "INR");
            options.put("receipt", "order_" + orderId);
            options.put("payment_capture", 1);

            com.razorpay.Order razorpayOrder = client.orders.create(options);
            return razorpayOrder.get("id");
        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponse verifyRazorpayPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Verify signature
        String generatedSignature = hmacSha256(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                razorpayKeySecret
        );

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            throw new BadRequestException("Payment signature verification failed");
        }

        order.setPaymentId(request.getRazorpayPaymentId());
        order.setRazorpayOrderId(request.getRazorpayOrderId());
        order.setPaymentStatus(PaymentStatus.SUCCESSFUL);
        order.setPaidAmount(order.getTotalAmount());
        order.setStatus(OrderStatus.CONFIRMED);
        order = orderRepository.save(order);

        return PaymentResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .amount(order.getTotalAmount())
                .paymentMethod("RAZORPAY")
                .paymentStatus("SUCCESSFUL")
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .isSuccess(true)
                .message("Payment successful")
                .build();
    }

    @Transactional
    public PaymentResponse processRefund(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setPaymentStatus(PaymentStatus.REFUNDED);
        order.setRefundAmount(order.getPaidAmount());
        order.setRefundedAt(java.time.LocalDateTime.now());
        order.setStatus(OrderStatus.REFUNDED);
        order = orderRepository.save(order);

        return PaymentResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .amount(order.getRefundAmount())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus("REFUNDED")
                .isSuccess(true)
                .message("Refund processed successfully")
                .build();
    }

    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hmacBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to generate HMAC", e);
        }
    }
}
