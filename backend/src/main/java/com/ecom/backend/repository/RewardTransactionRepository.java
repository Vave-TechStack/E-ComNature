package com.ecom.backend.repository;

import com.ecom.backend.entity.RewardTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {

    List<RewardTransaction> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    Page<RewardTransaction> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(r.points), 0) FROM RewardTransaction r WHERE r.user.id = :userId " +
           "AND r.transactionType = 'EARNED' AND r.isDeleted = false")
    Integer getTotalEarnedPointsByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(r.points), 0) FROM RewardTransaction r WHERE r.user.id = :userId " +
           "AND r.transactionType = 'REDEEMED' AND r.isDeleted = false")
    Integer getTotalRedeemedPointsByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM RewardTransaction r WHERE r.user.id = :userId AND r.isDeleted = false " +
           "ORDER BY r.createdAt DESC")
    List<RewardTransaction> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);
}
