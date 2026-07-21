package com.ecom.backend.service;

import com.ecom.backend.dto.request.OrderRequest;
import com.ecom.backend.dto.response.OrderResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.*;
import com.ecom.backend.entity.enums.OrderStatus;
import com.ecom.backend.entity.enums.PaymentMethod;
import com.ecom.backend.entity.enums.PaymentStatus;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.OrderMapper;
import com.ecom.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address shippingAddress = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        if (!shippingAddress.getUser().getId().equals(userId)) {
            throw new BadRequestException("Shipping address does not belong to this user");
        }

        Address billingAddress = request.getBillingAddressId() != null
                ? addressRepository.findById(request.getBillingAddressId())
                        .orElseThrow(() -> new ResourceNotFoundException("Billing address not found"))
                : shippingAddress;

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setNotes(request.getNotes());
        order.setIsGiftWrap(request.getIsGiftWrap());
        order.setGiftMessage(request.getGiftMessage());
        order.setIsCod(request.getIsCod());
        order.setCurrency("INR");

        double subtotal = 0.0;
        double totalDiscount = 0.0;
        java.util.Set<OrderItem> orderItems = new HashSet<>();

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByIdAndIsDeletedFalse(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            if (!product.getIsActive()) {
                throw new BadRequestException("Product is not available: " + product.getName());
            }

            if (product.getAvailableStock() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getSellingPrice());
            item.setTotalPrice(product.getSellingPrice() * itemReq.getQuantity());
            item.setDiscountAmount(product.getDiscountPercentage() != null
                    ? (product.getSellingPrice() * itemReq.getQuantity() * product.getDiscountPercentage() / 100) : 0.0);

            subtotal += item.getTotalPrice();
            totalDiscount += item.getDiscountAmount();
            orderItems.add(item);

            // Update stock
            product.setAvailableStock(product.getAvailableStock() - itemReq.getQuantity());
            product.setReservedStock(product.getReservedStock() + itemReq.getQuantity());
            product.setTotalSold(product.getTotalSold() != null ? product.getTotalSold() + itemReq.getQuantity() : itemReq.getQuantity());
            productRepository.save(product);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setDiscountAmount(totalDiscount);
        order.setTaxAmount(subtotal * 0.18); // 18% GST
        order.setShippingCharge(subtotal > 500 ? 0.0 : 49.0); // Free shipping above Rs 500
        order.setTotalAmount(subtotal - totalDiscount + order.getTaxAmount() + order.getShippingCharge());

        // Clear user's cart
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cartItemRepository.deleteByCartId(cart.getId());
            cart.getItems().clear();
            cart.setTotalAmount(0.0);
            cart.setItemCount(0);
            cartRepository.save(cart);
        });

        order = orderRepository.save(order);

        // Add initial status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setToStatus(OrderStatus.PENDING);
        history.setChangedBy(user.getFullName());
        history.setNotes("Order placed");
        order.getStatusHistory().add(history);
        order = orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus, String notes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        } else if (newStatus == OrderStatus.CANCELLED) {
            order.setCancelledAt(LocalDateTime.now());
            order.setCancellationReason(notes);
            restoreStock(order);
        }

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setFromStatus(oldStatus);
        history.setToStatus(newStatus);
        history.setChangedBy("SYSTEM");
        history.setNotes(notes);
        order.getStatusHistory().add(history);

        order = orderRepository.save(order);
        return orderMapper.toResponse(order);
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setAvailableStock(product.getAvailableStock() + item.getQuantity());
                product.setReservedStock(Math.max(0, product.getReservedStock() - item.getQuantity()));
                productRepository.save(product);
            }
        }
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.toResponse(order);
    }

    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
        return orderMapper.toResponse(order);
    }

    public PagedResponse<OrderResponse> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findByUserIdAndIsDeletedFalse(userId, pageable);
        return toPagedResponse(orderPage);
    }

    public PagedResponse<OrderResponse> getAllOrders(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage;
        if (status != null && !status.isEmpty()) {
            orderPage = orderRepository.findByStatusAndIsDeletedFalse(OrderStatus.valueOf(status), pageable);
        } else {
            orderPage = orderRepository.findByIsDeletedFalse(pageable);
        }
        return toPagedResponse(orderPage);
    }

    private String generateOrderNumber() {
        return "ECO-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private PagedResponse<OrderResponse> toPagedResponse(Page<Order> page) {
        return PagedResponse.<OrderResponse>builder()
                .content(orderMapper.toResponseList(page.getContent()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
