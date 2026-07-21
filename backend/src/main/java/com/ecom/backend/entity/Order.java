package com.ecom.backend.entity;

import com.ecom.backend.entity.enums.OrderStatus;
import com.ecom.backend.entity.enums.PaymentMethod;
import com.ecom.backend.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_number", columnList = "order_number", unique = true),
    @Index(name = "idx_order_user", columnList = "user_id"),
    @Index(name = "idx_order_status", columnList = "status"),
    @Index(name = "idx_order_payment_status", columnList = "payment_status"),
    @Index(name = "idx_order_created", columnList = "created_at"),
    @Index(name = "idx_order_tracking", columnList = "tracking_number")
})
public class Order extends BaseEntity {

    @Column(name = "order_number", unique = true, nullable = false, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "subtotal", nullable = false)
    private Double subtotal;

    @Column(name = "shipping_charge")
    private Double shippingCharge = 0.0;

    @Column(name = "tax_amount")
    private Double taxAmount = 0.0;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "coupon_discount")
    private Double couponDiscount = 0.0;

    @Column(name = "gift_wrap_charge")
    private Double giftWrapCharge = 0.0;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "paid_amount")
    private Double paidAmount;

    @Column(name = "due_amount")
    private Double dueAmount;

    @Column(name = "currency", length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_id", length = 255)
    private String paymentId;

    @Column(name = "razorpay_order_id", length = 255)
    private String razorpayOrderId;

    @Column(name = "stripe_session_id", length = 255)
    private String stripeSessionId;

    @Column(name = "phonepe_transaction_id", length = 255)
    private String phonepeTransactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_address_id")
    private Address billingAddress;

    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_gift_wrap")
    private Boolean isGiftWrap = false;

    @Column(name = "gift_message", length = 500)
    private String giftMessage;

    @Column(name = "is_cod")
    private Boolean isCod = false;

    @Column(name = "cod_charge")
    private Double codCharge = 0.0;

    @Column(name = "delivery_estimate")
    private LocalDateTime deliveryEstimate;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    @Column(name = "return_reason", length = 500)
    private String returnReason;

    @Column(name = "return_requested_at")
    private LocalDateTime returnRequestedAt;

    @Column(name = "return_approved_at")
    private LocalDateTime returnApprovedAt;

    @Column(name = "refund_amount")
    private Double refundAmount;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @Column(name = "invoice_url", length = 500)
    private String invoiceUrl;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "delivery_partner", length = 100)
    private String deliveryPartner;

    @Column(name = "delivery_partner_phone", length = 20)
    private String deliveryPartnerPhone;

    @Column(name = "delivery_partner_lat")
    private Double deliveryPartnerLat;

    @Column(name = "delivery_partner_lng")
    private Double deliveryPartnerLng;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<OrderItem> items = new HashSet<>();

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("createdAt ASC")
    private Set<OrderStatusHistory> statusHistory = new HashSet<>();
}
