package com.ecom.backend.repository;

import com.ecom.backend.entity.Order;
import com.ecom.backend.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Optional<Order> findByTrackingNumber(String trackingNumber);

    List<Order> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    Page<Order> findByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);

    Page<Order> findByStatusAndIsDeletedFalse(OrderStatus status, Pageable pageable);

    Page<Order> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.isDeleted = false")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.user.id = :userId AND o.isDeleted = false")
    double getTotalSpentByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.isDeleted = false")
    double getTotalRevenue();

    long countByIsDeletedFalse();

    @Query("SELECT COUNT(DISTINCT o) > 0 FROM Order o JOIN o.items oi WHERE o.user.id = :userId AND oi.product.id = :productId AND o.isDeleted = false")
    boolean existsByUserIdAndOrderItemsProductId(@Param("userId") Long userId, @Param("productId") Long productId);
}
