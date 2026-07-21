package com.ecom.backend.repository;

import com.ecom.backend.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCodeAndIsDeletedFalse(String code);

    List<Coupon> findByIsActiveTrueAndIsDeletedFalseAndValidFromBeforeAndValidUntilAfter(
            LocalDateTime now1, LocalDateTime now2);

    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND c.isDeleted = false " +
           "AND c.validFrom <= :now AND c.validUntil >= :now " +
           "AND (c.usageLimit IS NULL OR c.totalUsedCount < c.usageLimit)")
    List<Coupon> findValidCoupons(@Param("now") LocalDateTime now);

    Page<Coupon> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT c FROM Coupon c WHERE c.isDeleted = false " +
           "AND (LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Coupon> searchCoupons(@Param("search") String search, Pageable pageable);

    long countByIsActiveTrueAndIsDeletedFalseAndValidFromBeforeAndValidUntilAfter(
            LocalDateTime now1, LocalDateTime now2);
}
