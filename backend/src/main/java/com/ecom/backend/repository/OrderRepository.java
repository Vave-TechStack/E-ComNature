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

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    Page<Order> findByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.isDeleted = false")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.user.id = :userId AND o.isDeleted = false")
    double getTotalSpentByUserId(@Param("userId") Long userId);
}
